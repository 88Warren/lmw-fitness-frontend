import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { showToast } from '../../utils/toastUtil';
import { ToastContainer } from 'react-toastify';
import api from '../../utils/api';
import { BACKEND_URL } from '../../utils/config';

const WorkoutDayList = () => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);

  // Helper function to format program names for display
  const formatProgramName = (name) => {
    if (!name) return '';
    return name
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      const response = await api.get(`${BACKEND_URL}/api/admin/programs`);
      setPrograms(response.data);
    } catch (error) {
      showToast('error', 'Failed to fetch programs');
      console.error('Error fetching programs:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-customGray/30 to-white pt-32">
        <p className="text-xl font-titillium text-customGray">Loading programs...</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className="min-h-screen bg-linear-to-b from-customGray/30 to-white p-6 pt-32"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-start mb-4">
            <Link
              to="/admin"
              className="flex items-center text-customGray hover:text-logoGray transition-colors"
            >
              <FiArrowLeft className="mr-2" />
              Dashboard
            </Link>
          </div>
          <h1 className="text-4xl font-bold text-customGray mb-4">
            Workout Day Management
          </h1>
          <p className="text-gray-600 text-lg">
            Select a program to manage its workout days
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {programs.map((program, index) => (
            <motion.div
              key={program.ID}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <Link
                to={`/admin/workout-days/${program.ID}`}
                className="block p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="text-center">
                  <div className="text-4xl mb-4">📅</div>
                  <h3 className="text-xl font-bold text-customGray mb-3">
                    {formatProgramName(program.name)}
                  </h3>
                  <div className="text-gray-600 space-y-2">
                    <div className="flex justify-center items-center space-x-2">
                      <span className="bg-customGray text-white px-2 py-1 rounded text-sm">
                        {program.difficulty}
                      </span>
                      <span className="text-sm">
                        {program.duration} days
                      </span>
                    </div>
                    <p className="text-sm">
                      {(program.Days || program.days)?.length || 0} workout days created
                    </p>
                    {program.description && (
                      <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                        {program.description}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {programs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg mb-4">No programs found.</p>
            <Link 
              to="/admin/programs" 
              className="bg-customGray text-white px-6 py-3 rounded-lg hover:bg-logoGray transition-colors inline-block"
            >
              Create a Program First
            </Link>
          </div>
        )}
      </div>
      <ToastContainer />
    </motion.div>
  );
};

export default WorkoutDayList;