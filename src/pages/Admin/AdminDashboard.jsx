import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import DynamicHeading from '../../components/Shared/DynamicHeading';

const AdminDashboard = () => {
  const adminSections = [
    {
      title: 'Exercise Management',
      description: 'Create, edit, and manage exercises',
      link: '/admin/exercises',
      icon: '🏋️‍♀️'
    },
    {
      title: 'Program Management',
      description: 'Manage workout programs and their structure',
      link: '/admin/programs',
      icon: '📋'
    },
    {
      title: 'Workout Management',
      description: 'Manage individual workout days and blocks',
      link: '/admin/workout-days',
      icon: '📅'
    },
    {
      title: 'User Management',
      description: 'View and manage user accounts',
      link: '/admin/users',
      icon: '👥'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className="min-h-screen bg-gradient-to-b from-customGray/30 to-white p-6 pt-24"
    >
      <div className="max-w-6xl mx-auto">
        <DynamicHeading
          text="Admin Dashboard"
          className="font-higherJump text-4xl md:text-5xl text-center font-bold text-customGray mb-12 leading-loose tracking-widest"
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {adminSections.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="h-full"
            >
              <Link
                to={section.link}
                className="flex flex-col h-full bg-customGray p-8 rounded-lg border-2 border-brightYellow hover:border-hotPink transition-colors duration-300 group min-h-[280px]"
              >
                <div className="text-center flex-1 flex flex-col justify-center">
                  <div className="text-6xl mb-4">{section.icon}</div>
                  <h3 className="text-2xl font-bold text-customWhite mb-4 font-higherJump tracking-wider leading-loose">
                    {section.title}
                  </h3>
                  <p className="text-logoGray font-titillium group-hover:text-customWhite transition-colors duration-300 leading-relaxed">
                    {section.description}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default AdminDashboard;