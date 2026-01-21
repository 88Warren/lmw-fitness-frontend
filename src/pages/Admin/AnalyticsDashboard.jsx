import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  FiArrowLeft,
  FiUsers,
  FiActivity,
  FiTrendingUp,
  FiTrendingDown,
  FiCalendar,
  FiBarChart,
  FiPieChart,
  FiRefreshCw,
  FiDownload,
  FiUserPlus,
  FiMail,
  FiDatabase,
  FiClock,
} from 'react-icons/fi';
import { showToast } from '../../utils/toastUtil';
import { ToastContainer } from 'react-toastify';
import api from '../../utils/api';
import { BACKEND_URL } from '../../utils/config';

const AnalyticsDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState(30);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      setRefreshing(true);
      const response = await api.get(`${BACKEND_URL}/api/admin/analytics?days=${timeRange}`);
      setAnalytics(response.data);
    } catch (error) {
      showToast('error', 'Failed to fetch analytics data');
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const formatProgramName = (name) => {
    if (!name) return '';
    return name
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const exportData = () => {
    if (!analytics) return;
    
    const dataStr = JSON.stringify(analytics, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `analytics-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('success', 'Analytics data exported successfully');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-customGray/30 to-white pt-32">
        <div className="text-center">
          <FiBarChart className="mx-auto text-6xl text-customGray mb-4 animate-pulse" />
          <p className="text-xl text-customGray">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-customGray/30 to-white pt-32">
        <div className="text-center">
          <p className="text-xl text-customGray mb-4">Failed to load analytics data</p>
          <button
            onClick={fetchAnalytics}
            className="bg-customGray text-white px-6 py-3 rounded-lg hover:bg-logoGray transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const { overview, trends, programs, content, system } = analytics;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className="min-h-screen bg-linear-to-b from-customGray/30 to-white p-6 pt-32"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-between items-center mb-4">
            <Link
              to="/admin"
              className="flex items-center text-customGray hover:text-logoGray transition-colors"
            >
              <FiArrowLeft className="mr-2" />
              Dashboard
            </Link>
            
            <div className="flex items-center gap-4">
              {/* Time Range Selector */}
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(parseInt(e.target.value))}
                className="px-4 py-2 rounded border border-gray-300 text-customGray focus:ring-2 focus:ring-customGray focus:border-transparent"
              >
                <option value={7}>Last 7 days</option>
                <option value={30}>Last 30 days</option>
                <option value={90}>Last 90 days</option>
                <option value={365}>Last year</option>
              </select>
              
              {/* Refresh Button */}
              <button
                onClick={fetchAnalytics}
                disabled={refreshing}
                className="flex items-center gap-2 bg-customGray text-white px-4 py-2 rounded-lg hover:bg-logoGray transition-colors disabled:opacity-50"
              >
                <FiRefreshCw className={refreshing ? 'animate-spin' : ''} size={16} />
                Refresh
              </button>
              
              {/* Export Button */}
              <button
                onClick={exportData}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FiDownload size={16} />
                Export
              </button>
            </div>
          </div>
          
          <h1 className="text-4xl font-bold text-customGray mb-2">Analytics Dashboard</h1>
          <p className="text-gray-600">
            Real-time insights into your fitness platform • Last updated: {new Date(analytics.generatedAt).toLocaleString()}
          </p>
        </div>

        {/* Key Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Total Users"
            value={overview.totalUsers}
            icon={FiUsers}
            color="blue"
            subtitle={`${overview.newUsers} new in ${timeRange} days`}
            trend={overview.newUsers > 0 ? 'up' : 'neutral'}
          />
          <MetricCard
            title="Active Programs"
            value={overview.activePrograms}
            icon={FiActivity}
            color="green"
            subtitle={`${overview.totalPrograms} total programs`}
            trend="neutral"
          />
          <MetricCard
            title="Workout Days"
            value={overview.totalWorkoutDays}
            icon={FiCalendar}
            color="purple"
            subtitle={`${overview.totalExercises} exercises`}
            trend="neutral"
          />
          <MetricCard
            title="Newsletter Subs"
            value={overview.newsletterSubscribers}
            icon={FiMail}
            color="orange"
            subtitle={`${overview.confirmedSubscribers} confirmed`}
            trend={overview.confirmedSubscribers > 0 ? 'up' : 'neutral'}
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Registration Trends */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-customGray flex items-center gap-2">
                <FiTrendingUp className="text-blue-500" />
                User Registration Trends
              </h3>
              <span className="text-sm text-gray-500">Last 7 days</span>
            </div>
            <div className="space-y-3">
              {trends.registrationTrends.map((day) => (
                <div key={day.date} className="flex items-center justify-between">
                  <span className="text-gray-600">{formatDate(day.date)}</span>
                  <div className="flex items-center gap-2">
                    <div 
                      className="bg-blue-500 h-2 rounded"
                      style={{ width: `${Math.max(day.count * 20, 4)}px` }}
                    />
                    <span className="text-customGray font-semibold w-8 text-right">{day.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* User Activity Levels */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-customGray flex items-center gap-2">
                <FiPieChart className="text-green-500" />
                User Activity Levels
              </h3>
            </div>
            <div className="space-y-4">
              {Object.entries(programs.activityLevels).map(([level, count]) => {
                const colors = {
                  'New': 'bg-gray-400',
                  'Active': 'bg-blue-500',
                  'Regular': 'bg-green-500',
                  'Dedicated': 'bg-purple-500'
                };
                const percentage = overview.totalUsers > 0 ? (count / overview.totalUsers * 100).toFixed(1) : 0;
                
                return (
                  <div key={level} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded ${colors[level]}`} />
                      <span className="text-gray-700">{level}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-customGray font-semibold">{count}</span>
                      <span className="text-gray-500 text-sm">({percentage}%)</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Program Statistics */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h3 className="text-xl font-bold text-customGray mb-4 flex items-center gap-2">
            <FiBarChart className="text-purple-500" />
            Program Popularity
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-customGray">Program</th>
                  <th className="text-left py-3 px-4 text-customGray">Difficulty</th>
                  <th className="text-left py-3 px-4 text-customGray">Duration</th>
                  <th className="text-left py-3 px-4 text-customGray">Users</th>
                  <th className="text-left py-3 px-4 text-customGray">Days</th>
                  <th className="text-left py-3 px-4 text-customGray">Status</th>
                </tr>
              </thead>
              <tbody>
                {programs.programStats.map((program, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-semibold text-customGray">
                      {formatProgramName(program.name)}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-xs ${
                        program.difficulty === 'Beginner' ? 'bg-green-100 text-green-800' :
                        program.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {program.difficulty}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{program.duration} days</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <FiUsers size={14} className="text-gray-400" />
                        <span className="font-semibold text-customGray">{program.userCount}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{program.dayCount}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-xs ${
                        program.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {program.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Content & System Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Exercise Categories */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-customGray mb-4 flex items-center gap-2">
              <FiActivity className="text-orange-500" />
              Exercise Categories
            </h3>
            <div className="space-y-3">
              {content.exerciseCategories.map((category) => {
                const maxCount = Math.max(...content.exerciseCategories.map(c => c.count));
                const percentage = maxCount > 0 ? (category.count / maxCount * 100) : 0;
                
                return (
                  <div key={category.category} className="flex items-center justify-between">
                    <span className="text-gray-700 capitalize">
                      {category.category.replace('_', ' ')}
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-orange-500 h-2 rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-customGray font-semibold w-8 text-right">
                        {category.count}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* System Health */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-customGray mb-4 flex items-center gap-2">
              <FiDatabase className="text-green-500" />
              System Health
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Database Status</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="text-green-600 font-semibold">Connected</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Total Records</span>
                <span className="text-customGray font-semibold">
                  {formatNumber(
                    system.totalUsers + 
                    system.totalPrograms + 
                    system.totalWorkoutDays + 
                    system.totalExercises + 
                    system.totalBlogs
                  )}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Last Updated</span>
                <div className="flex items-center gap-1 text-gray-600">
                  <FiClock size={14} />
                  <span className="text-sm">
                    {new Date(system.lastUpdated).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-bold text-customGray mb-4 flex items-center gap-2">
            <FiUserPlus className="text-blue-500" />
            Recent User Registrations
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-customGray">Email</th>
                  <th className="text-left py-3 px-4 text-customGray">Role</th>
                  <th className="text-left py-3 px-4 text-customGray">Timezone</th>
                  <th className="text-left py-3 px-4 text-customGray">Registered</th>
                </tr>
              </thead>
              <tbody>
                {content.recentActivity.map((user, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-customGray">{user.email}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-xs ${
                        user.role === 'admin' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{user.timezone}</td>
                    <td className="py-3 px-4 text-gray-600">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <ToastContainer />
    </motion.div>
  );
};

// Metric Card Component
const MetricCard = ({ title, value, icon: Icon, color, subtitle, trend }) => {
  const colorClasses = {
    blue: 'text-blue-500 bg-blue-50',
    green: 'text-green-500 bg-green-50',
    purple: 'text-purple-500 bg-purple-50',
    orange: 'text-orange-500 bg-orange-50',
    red: 'text-red-500 bg-red-50'
  };

  const TrendIcon = trend === 'up' ? FiTrendingUp : trend === 'down' ? FiTrendingDown : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon size={24} />
        </div>
        {TrendIcon && (
          <TrendIcon 
            size={20} 
            className={trend === 'up' ? 'text-green-500' : 'text-red-500'} 
          />
        )}
      </div>
      <div>
        <h3 className="text-2xl font-bold text-customGray mb-1">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </h3>
        <p className="text-gray-600 text-sm">{title}</p>
        {subtitle && (
          <p className="text-gray-500 text-xs mt-1">{subtitle}</p>
        )}
      </div>
    </motion.div>
  );
};

MetricCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  icon: PropTypes.elementType.isRequired,
  color: PropTypes.oneOf(['blue', 'green', 'purple', 'orange', 'red']).isRequired,
  subtitle: PropTypes.string,
  trend: PropTypes.oneOf(['up', 'down', 'neutral'])
};

export default AnalyticsDashboard;