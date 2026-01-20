import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Hash, Trash2, Edit, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { showToast } from '../../utils/toastUtil';
import assessmentApi from '../../utils/assessmentApi';
import AssessmentInput from './AssessmentInput';
import DynamicHeading from '../Shared/DynamicHeading';

const AssessmentHistory = ({ initialTab = 'history' }) => {
  const [assessments, setAssessments] = useState([]);
  const [comparisons, setComparisons] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(initialTab);
  const [editingAssessment, setEditingAssessment] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    loadAssessmentData();
  }, []);

  const loadAssessmentData = async () => {
    setLoading(true);
    
    // Load assessment history
    const historyResult = await assessmentApi.getAssessmentHistory();
    if (historyResult.success) {
      setAssessments(historyResult.data);
      
      // Load comparisons for each program
      const programs = [...new Set(historyResult.data.map(a => a.programName))];
      const comparisonPromises = programs.map(program => 
        assessmentApi.getAssessmentComparison(program)
      );
      
      const comparisonResults = await Promise.all(comparisonPromises);
      const comparisonsData = {};
      
      programs.forEach((program, index) => {
        if (comparisonResults[index].success) {
          comparisonsData[program] = comparisonResults[index].data;
        }
      });
      
      setComparisons(comparisonsData);
    } else {
      showToast('error', historyResult.error);
    }
    
    setLoading(false);
  };

  const handleDeleteAssessment = async (assessmentId) => {
    if (!window.confirm('Are you sure you want to delete this assessment?')) {
      return;
    }

    const result = await assessmentApi.deleteAssessment(assessmentId);
    if (result.success) {
      showToast('success', 'Assessment deleted successfully');
      loadAssessmentData(); // Reload data
    } else {
      showToast('error', result.error);
    }
  };

  const handleEditAssessment = (assessment) => {
    setEditingAssessment(assessment);
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    setShowEditModal(false);
    setEditingAssessment(null);
    loadAssessmentData(); // Reload data
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getImprovementIcon = (improvement) => {
    if (!improvement) return <Minus className="text-logoGray" size={16} />;
    
    const value = improvement.repsDifference || improvement.timeDifference || 0;
    if (value > 0) return <TrendingUp className="text-green-400" size={16} />;
    if (value < 0) return <TrendingDown className="text-red-400" size={16} />;
    return <Minus className="text-logoGray" size={16} />;
  };

  const getImprovementText = (improvement) => {
    if (!improvement) return 'No Day 30 data';
    
    const repsDiff = improvement.repsDifference;
    const timeDiff = improvement.timeDifference;
    const percent = improvement.percentImproved;
    
    if (repsDiff !== undefined) {
      const sign = repsDiff > 0 ? '+' : '';
      const percentText = percent ? ` (${sign}${percent.toFixed(1)}%)` : '';
      return `${sign}${repsDiff} reps${percentText}`;
    }
    
    if (timeDiff !== undefined) {
      const sign = timeDiff > 0 ? '+' : '';
      const percentText = percent ? ` (${sign}${percent.toFixed(1)}%)` : '';
      return `${sign}${timeDiff}s${percentText}`;
    }
    
    return 'No change';
  };

  const groupedAssessments = assessments.reduce((groups, assessment) => {
    const key = `${assessment.programName}-${assessment.dayNumber}`;
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(assessment);
    return groups;
  }, {});

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-customWhite font-titillium">Loading assessment data...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex space-x-4 border-b border-logoGray">
        <button
          onClick={() => setActiveTab('history')}
          className={`pb-2 px-1 font-titillium transition-colors ${
            activeTab === 'history'
              ? 'text-brightYellow border-b-2 border-brightYellow'
              : 'text-logoGray hover:text-customWhite'
          }`}
        >
          Assessment History
        </button>
        <button
          onClick={() => setActiveTab('progress')}
          className={`pb-2 px-1 font-titillium transition-colors ${
            activeTab === 'progress'
              ? 'text-brightYellow border-b-2 border-brightYellow'
              : 'text-logoGray hover:text-customWhite'
          }`}
        >
          Progress Comparison
        </button>
      </div>

      {activeTab === 'history' && (
        <div className="space-y-4">
          {Object.keys(groupedAssessments).length === 0 ? (
            <div className="text-center py-8">
              <p className="text-logoGray font-titillium">No assessment results recorded yet.</p>
              <p className="text-sm text-logoGray font-titillium mt-2">
                Complete Day 1 of a program to start tracking your fitness progress!
              </p>
            </div>
          ) : (
            Object.entries(groupedAssessments).map(([key, groupAssessments]) => {
              const [programName, dayNumber] = key.split('-');
              return (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gray-800 rounded-lg p-4 border border-logoGray"
                >
                  <div className="flex items-center justify-between mb-3">
                    <DynamicHeading
                      text={`${programName.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} - Day ${dayNumber}`}
                      className="text-lg font-higherJump text-customWhite tracking-wider"
                    />
                    <div className="flex items-center text-logoGray text-sm font-titillium">
                      <Calendar size={14} className="mr-1" />
                      {formatDate(groupAssessments[0].recordedDate)}
                    </div>
                  </div>
                  
                  <div className="grid gap-3">
                    {groupAssessments.map((assessment) => (
                      <div key={assessment.id} className="flex items-center justify-between bg-gray-700 rounded p-3">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <span className="text-customWhite font-titillium">
                              {assessment.exerciseName}
                            </span>
                            <div className="flex items-center text-brightYellow">
                              {assessment.reps ? (
                                <>
                                  <Hash size={14} className="mr-1" />
                                  {assessment.reps} reps
                                </>
                              ) : (
                                <>
                                  <Clock size={14} className="mr-1" />
                                  {formatTime(assessment.timeSeconds)}
                                </>
                              )}
                            </div>
                          </div>
                          {assessment.notes && (
                            <p className="text-sm text-logoGray mt-1 font-titillium">
                              {assessment.notes}
                            </p>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleEditAssessment(assessment)}
                            className="text-logoGray hover:text-brightYellow transition-colors"
                            title="Edit assessment"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteAssessment(assessment.id)}
                            className="text-logoGray hover:text-red-400 transition-colors"
                            title="Delete assessment"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      )}

      {activeTab === 'progress' && (
        <div className="space-y-4">
          {Object.keys(comparisons).length === 0 ? (
            <div className="text-center py-8">
              <p className="text-logoGray font-titillium">No progress comparisons available yet.</p>
              <p className="text-sm text-logoGray font-titillium mt-2">
                Complete both Day 1 and Day 30 assessments to see your progress!
              </p>
            </div>
          ) : (
            Object.entries(comparisons).map(([programName, programComparisons]) => (
              <motion.div
                key={programName}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-800 rounded-lg p-4 border border-logoGray"
              >
                <DynamicHeading
                  text={`${programName.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} Progress`}
                  className="text-lg font-higherJump text-customWhite mb-4 tracking-wider"
                />
                
                <div className="grid gap-3">
                  {programComparisons.map((comparison, index) => (
                    <div key={index} className="bg-gray-700 rounded p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-customWhite font-titillium">
                          {comparison.exerciseName}
                        </span>
                        <div className="flex items-center space-x-2">
                          {getImprovementIcon(comparison.improvement)}
                          <span className="text-sm text-logoGray font-titillium">
                            {getImprovementText(comparison.improvement)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-logoGray">Day 1: </span>
                          <span className="text-brightYellow">
                            {comparison.day1?.reps ? 
                              `${comparison.day1.reps} reps` : 
                              `${formatTime(comparison.day1?.timeSeconds || 0)}`
                            }
                          </span>
                        </div>
                        <div>
                          <span className="text-logoGray">Day 30: </span>
                          <span className="text-brightYellow">
                            {comparison.day30?.reps ? 
                              `${comparison.day30.reps} reps` : 
                              comparison.day30?.timeSeconds ? 
                                formatTime(comparison.day30.timeSeconds) : 
                                'Not completed'
                            }
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))
          )}
        </div>
      )}

      {/* Edit Assessment Modal */}
      {editingAssessment && (
        <AssessmentInput
          exercise={{
            id: editingAssessment.exerciseId,
            name: editingAssessment.exerciseName
          }}
          programName={editingAssessment.programName}
          dayNumber={editingAssessment.dayNumber}
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setEditingAssessment(null);
          }}
          onSave={handleSaveEdit}
          existingAssessment={editingAssessment}
        />
      )}
    </div>
  );
};

export default AssessmentHistory;