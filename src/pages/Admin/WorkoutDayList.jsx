import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { showToast } from '../../utils/toastUtil';
import { ToastContainer } from 'react-toastify';
import api from '../../utils/api';
import { BACKEND_URL } from '../../utils/config';
import DynamicHeading from '../../components/Shared/DynamicHeading';

const WorkoutDayList = () => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);

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
      <div className="min-h-screen flex items-center justify-center bg-customGray">
        <p className="text-xl font-titillium text-customWhite">Loading programs...</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className="min-h-screen bg-gradient-to-b from-customGray/30 to-white p-6 pt-24"
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-center gap-4 mb-12">
          <Link
            to="/admin"
            className="p-2 bg-customGray text-brightYellow rounded hover:bg-brightYellow hover:text-customGray transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <DynamicHeading
            text="Select Program to Edit Workout Days"
            className="font-higherJump text-3xl md:text-4xl text-center font-bold text-customGray leading-loose tracking-widest"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {programs.map((program, index) => (
            <motion.div
              key={program.ID}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link
                to={`/admin/workout-days/${program.ID}`}
                className="block bg-customGray p-8 rounded-lg border-2 border-brightYellow hover:border-hotPink transition-colors duration-300 group"
              >
                <div className="text-center">
                  <div className="text-6xl mb-4">📅</div>
                  <h3 className="text-2xl font-bold text-customWhite mb-4 font-higherJump tracking-wider leading-loose">
                    {program.name}
                  </h3>
                  <div className="text-logoGray font-titillium group-hover:text-customWhite transition-colors duration-300">
                    <p className="mb-2">{program.difficulty} • {program.duration} days</p>
                    <p className="text-sm">{(program.Days || program.days)?.length || 0} workout days</p>
                    {program.description && (
                      <p className="text-sm mt-2 opacity-75">{program.description}</p>
                    )}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {programs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-logoGray font-titillium text-lg">No programs found.</p>
            <Link 
              to="/admin/programs" 
              className="btn-full-colour mt-4 inline-block"
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