import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import DynamicHeading from '../../components/Shared/DynamicHeading';

const AdminDashboard = () => {
  const adminSections = [
    {
      title: 'Analytics Dashboard',
      description: 'View comprehensive analytics and insights',
      link: '/admin/analytics',
      icon: '📊'
    },
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
      title: 'Blog Management',
      description: 'Create, edit, and manage blog posts',
      link: '/admin/blogs',
      icon: '📝'
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
      className="min-h-screen bg-linear-to-b from-customGray/30 to-white p-6 pt-32"
    >
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-customGray mb-12">
          Admin Dashboard
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {adminSections.map((section, index) => (
            <Link
              key={section.title}
              to={section.link}
              className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 p-6"
            >
              <div className="text-center">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {section.icon}
                </div>
                <h3 className="text-xl font-semibold text-customGray mb-3 group-hover:text-limeGreen transition-colors duration-300">
                  {section.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {section.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default AdminDashboard;