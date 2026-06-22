import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Hash, Trash2, Edit, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { showToast } from '../../utils/toastUtil';
import assessmentApi from '../../utils/assessmentApi';
import AssessmentInput from './AssessmentInput';

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
    const historyResult = await assessmentApi.getAssessmentHistory();
    if (historyResult.success) {
      setAssessments(historyResult.data);
      const programs = [...new Set(historyResult.data.map(a => a.programName))];
      const comparisonResults = await Promise.all(
        programs.map(p => assessmentApi.getAssessmentComparison(p))
      );
      const comparisonsData = {};
      programs.forEach((program, i) => {
        if (comparisonResults[i].success) comparisonsData[program] = comparisonResults[i].data;
      });
      setComparisons(comparisonsData);
    } else {
      showToast('error', historyResult.error);
    }
    setLoading(false);
  };

  const handleDeleteAssessment = async (assessmentId) => {
    if (!window.confirm('Are you sure you want to delete this assessment?')) return;
    const result = await assessmentApi.deleteAssessment(assessmentId);
    if (result.success) {
      showToast('success', 'Assessment deleted successfully');
      loadAssessmentData();
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
    loadAssessmentData();
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric', month: 'short', year: 'numeric',
    });

  const programLabel = (name) =>
    name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  const getImprovementIcon = (improvement) => {
    if (!improvement) return <Minus className="text-customGray/30" size={15} />;
    const value = improvement.repsDifference ?? improvement.timeDifference ?? 0;
    if (value > 0) return <TrendingUp className="text-limeGreen" size={15} />;
    if (value < 0) return <TrendingDown className="text-hotPink" size={15} />;
    return <Minus className="text-customGray/30" size={15} />;
  };

  const getImprovementText = (improvement) => {
    if (!improvement) return 'No Day 30 data';
    const repsDiff = improvement.repsDifference;
    const timeDiff = improvement.timeDifference;
    const percent = improvement.percentImproved;
    if (repsDiff !== undefined) {
      const sign = repsDiff > 0 ? '+' : '';
      return `${sign}${repsDiff} reps${percent ? ` (${sign}${percent.toFixed(1)}%)` : ''}`;
    }
    if (timeDiff !== undefined) {
      const sign = timeDiff > 0 ? '+' : '';
      return `${sign}${timeDiff}s${percent ? ` (${sign}${percent.toFixed(1)}%)` : ''}`;
    }
    return 'No change';
  };

  const groupedAssessments = assessments.reduce((groups, assessment) => {
    const key = `${assessment.programName}-${assessment.dayNumber}`;
    if (!groups[key]) groups[key] = [];
    groups[key].push(assessment);
    return groups;
  }, {});

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brightYellow mx-auto mb-3"></div>
          <p className="text-sm text-customGray/50 font-titillium">Loading assessment data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Tab navigation */}
      <div className="flex gap-1 bg-gray-50 rounded-xl p-1 border border-gray-100">
        {[
          { key: 'history', label: 'History' },
          { key: 'progress', label: 'Progress' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-titillium font-semibold transition-all duration-200 ${
              activeTab === tab.key
                ? 'bg-white text-customGray shadow-sm border border-gray-100'
                : 'text-customGray/50 hover:text-customGray'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* History tab */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          {Object.keys(groupedAssessments).length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center">
              <div className="text-4xl mb-3">📋</div>
              <p className="text-sm font-bold text-customGray font-titillium mb-1">No results yet</p>
              <p className="text-xs text-customGray/50 font-titillium">
                Complete Day 1 of a programme to start tracking your fitness progress.
              </p>
            </div>
          ) : (
            Object.entries(groupedAssessments).map(([key, groupAssessments]) => {
              const [programName, dayNumber] = key.split('-');
              return (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm font-bold text-customGray font-titillium">
                        {programLabel(programName)}
                      </p>
                      <p className="text-xs text-customGray/50 font-titillium">Day {dayNumber}</p>
                    </div>
                    <div className="flex items-center gap-1.5 text-customGray/40 text-xs font-titillium">
                      <Calendar size={12} />
                      <span>{formatDate(groupAssessments[0].recordedDate)}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {groupAssessments.map((assessment) => (
                      <div
                        key={assessment.id}
                        className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-xl"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-customGray font-titillium truncate">
                            {assessment.exerciseName}
                          </p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            {assessment.reps ? (
                              <>
                                <Hash size={11} className="text-brightYellow shrink-0" />
                                <span className="text-xs text-brightYellow font-titillium font-semibold">
                                  {assessment.reps} reps
                                </span>
                              </>
                            ) : (
                              <>
                                <Clock size={11} className="text-brightYellow shrink-0" />
                                <span className="text-xs text-brightYellow font-titillium font-semibold">
                                  {formatTime(assessment.timeSeconds)}
                                </span>
                              </>
                            )}
                          </div>
                          {assessment.notes && (
                            <p className="text-xs text-customGray/40 font-titillium italic mt-0.5">
                              {assessment.notes}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-2 shrink-0 ml-3">
                          <button
                            onClick={() => handleEditAssessment(assessment)}
                            className="p-1.5 text-customGray/30 hover:text-brightYellow transition-colors rounded-lg hover:bg-yellow-50"
                            title="Edit"
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteAssessment(assessment.id)}
                            className="p-1.5 text-customGray/30 hover:text-red-400 transition-colors rounded-lg hover:bg-red-50"
                            title="Delete"
                          >
                            <Trash2 size={14} />
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

      {/* Progress tab */}
      {activeTab === 'progress' && (
        <div className="space-y-4">
          {Object.keys(comparisons).length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center">
              <div className="text-4xl mb-3">📈</div>
              <p className="text-sm font-bold text-customGray font-titillium mb-1">No comparisons yet</p>
              <p className="text-xs text-customGray/50 font-titillium">
                Complete both Day 1 and Day 30 assessments to see your progress.
              </p>
            </div>
          ) : (
            Object.entries(comparisons).map(([programName, programComparisons]) => (
              <motion.div
                key={programName}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"
              >
                <p className="text-sm font-bold text-customGray font-titillium mb-4">
                  {programLabel(programName)} — Progress
                </p>

                <div className="space-y-3">
                  {programComparisons.map((comparison, index) => (
                    <div key={index} className="px-4 py-3 bg-gray-50 rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-semibold text-customGray font-titillium">
                          {comparison.exerciseName}
                        </p>
                        <div className="flex items-center gap-1.5">
                          {getImprovementIcon(comparison.improvement)}
                          <span className="text-xs font-titillium text-customGray/60">
                            {getImprovementText(comparison.improvement)}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white rounded-lg px-3 py-2 border border-gray-100">
                          <p className="text-xs text-customGray/40 font-titillium mb-0.5">Day 1</p>
                          <p className="text-sm font-bold text-brightYellow font-titillium">
                            {comparison.day1?.reps
                              ? `${comparison.day1.reps} reps`
                              : formatTime(comparison.day1?.timeSeconds || 0)}
                          </p>
                        </div>
                        <div className="bg-white rounded-lg px-3 py-2 border border-gray-100">
                          <p className="text-xs text-customGray/40 font-titillium mb-0.5">Day 30</p>
                          <p className="text-sm font-bold text-limeGreen font-titillium">
                            {comparison.day30?.reps
                              ? `${comparison.day30.reps} reps`
                              : comparison.day30?.timeSeconds
                              ? formatTime(comparison.day30.timeSeconds)
                              : 'Not completed'}
                          </p>
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

      {/* Edit modal */}
      {editingAssessment && (
        <AssessmentInput
          exercise={{ id: editingAssessment.exerciseId, name: editingAssessment.exerciseName }}
          programName={editingAssessment.programName}
          dayNumber={editingAssessment.dayNumber}
          isOpen={showEditModal}
          onClose={() => { setShowEditModal(false); setEditingAssessment(null); }}
          onSave={handleSaveEdit}
          existingAssessment={editingAssessment}
        />
      )}
    </div>
  );
};

export default AssessmentHistory;
