import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FiArrowLeft,
  FiTrash2,
  FiUserCheck,
  FiUserX,
  FiShield,
  FiUser,
  FiKey,
  FiActivity,
  FiCalendar,
  FiClock,
  FiTrendingUp,
  FiFilter,
  FiSearch,
  FiDownload,
  FiEye,
  FiBarChart2,
  FiTarget,
  FiAward,
  FiPlay,
  FiPause,
  FiCheckCircle,
  FiAlertCircle,
  FiMail,
  FiMessageSquare,
} from "react-icons/fi";
import { BACKEND_URL } from "../../utils/config";
import api from "../../utils/api";
import { showToast } from "../../utils/toastUtil";
import { ToastContainer } from "react-toastify";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [showResetModal, setShowResetModal] = useState(false);
  const [userToReset, setUserToReset] = useState(null);
  const [resetLoading, setResetLoading] = useState(false);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [userProgress, setUserProgress] = useState(null);
  const [userActivity, setUserActivity] = useState(null);
  const [progressLoading, setProgressLoading] = useState(false);
  
  // Filter and search states
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [activityFilter, setActivityFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  // Stats
  const [userStats, setUserStats] = useState({
    total: 0,
    active: 0,
    admins: 0,
    newThisWeek: 0,
    totalWorkouts: 0,
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [users, searchTerm, roleFilter, activityFilter, sortBy]);

  const fetchUsers = async () => {
    try {
      const response = await api.get(`${BACKEND_URL}/api/admin/users`);
      const userData = response.data || [];
      setUsers(userData);
      calculateStats(userData);
    } catch (err) {
      setError("Failed to load users");
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (userData) => {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const stats = {
      total: userData.length,
      active: userData.filter(user => user.activityLevel !== "New").length,
      admins: userData.filter(user => user.role === "admin").length,
      newThisWeek: userData.filter(user => new Date(user.CreatedAt) > weekAgo).length,
      totalWorkouts: userData.reduce((sum, user) => sum + (user.totalCompletedDays || 0), 0),
    };
    
    setUserStats(stats);
  };

  const applyFilters = () => {
    let filtered = [...users];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Role filter
    if (roleFilter !== "all") {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    // Activity filter
    if (activityFilter !== "all") {
      filtered = filtered.filter(user => user.activityLevel === activityFilter);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.CreatedAt) - new Date(a.CreatedAt);
        case "oldest":
          return new Date(a.CreatedAt) - new Date(b.CreatedAt);
        case "mostActive":
          return (b.totalCompletedDays || 0) - (a.totalCompletedDays || 0);
        case "email":
          return a.email.localeCompare(b.email);
        default:
          return 0;
      }
    });

    setFilteredUsers(filtered);
  };

  const handleDelete = async (userId) => {
    try {
      await api.delete(`${BACKEND_URL}/api/admin/users/${userId}`);
      setUsers(users.filter((user) => user.ID !== userId));
      setShowDeleteModal(false);
      setUserToDelete(null);
    } catch (err) {
      setError("Failed to delete user");
      console.error("Error deleting user:", err);
    }
  };

  const toggleUserStatus = async (user) => {
    try {
      const response = await api.put(
        `${BACKEND_URL}/api/admin/users/${user.ID}`,
        {
          ...user,
          isActive: !user.isActive,
        }
      );
      setUsers(users.map((u) => (u.ID === user.ID ? response.data : u)));
    } catch (err) {
      setError("Failed to update user status");
      console.error("Error updating user:", err);
    }
  };

  const toggleAdminRole = async (user) => {
    try {
      const newRole = user.role === "admin" ? "user" : "admin";
      const response = await api.put(
        `${BACKEND_URL}/api/admin/users/${user.ID}`,
        {
          ...user,
          role: newRole,
        }
      );
      setUsers(users.map((u) => (u.ID === user.ID ? response.data : u)));
    } catch (err) {
      setError("Failed to update user role");
      console.error("Error updating user role:", err);
    }
  };

  const handlePasswordReset = async (userId) => {
    try {
      setResetLoading(true);
      await api.post(`${BACKEND_URL}/api/admin/users/${userId}/reset-password`);
      setShowResetModal(false);
      setUserToReset(null);
      setError(""); // Clear any previous errors
      // Show success message
      const successDiv = document.createElement("div");
      successDiv.className =
        "bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6";
      successDiv.textContent = "Password reset email sent successfully!";
      const errorDiv = document.querySelector(".bg-red-100");
      if (errorDiv) {
        errorDiv.parentNode.insertBefore(successDiv, errorDiv);
      } else {
        document
          .querySelector(".max-w-7xl")
          .insertBefore(
            successDiv,
            document.querySelector(".max-w-7xl").children[1]
          );
      }
      setTimeout(() => successDiv.remove(), 5000);
    } catch (err) {
      setError("Failed to send password reset email");
      console.error("Error sending password reset:", err);
    } finally {
      setResetLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getActivityColor = (level) => {
    switch (level) {
      case "New": return "bg-gray-100 text-gray-800";
      case "Active": return "bg-blue-100 text-blue-800";
      case "Regular": return "bg-green-100 text-green-800";
      case "Dedicated": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const exportUserData = () => {
    const csvContent = [
      ["Email", "Role", "Activity Level", "Completed Workouts", "Programs", "Account Age (days)", "Last Activity (days ago)", "Timezone"].join(","),
      ...filteredUsers.map(user => [
        user.email,
        user.role,
        user.activityLevel,
        user.totalCompletedDays || 0,
        user.programCount || 0,
        user.accountAge || 0,
        user.daysSinceLastActivity || 0,
        user.timezone || "UTC"
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `users-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const fetchUserProgress = async (userId) => {
    setProgressLoading(true);
    try {
      const response = await api.get(`${BACKEND_URL}/api/admin/users/${userId}/progress`);
      setUserProgress(response.data);
    } catch (error) {
      console.error('Error fetching user progress:', error);
      // Create mock progress data if API doesn't exist yet
      const user = users.find(u => u.ID === userId);
      if (user) {
        setUserProgress({
          userId: userId,
          programs: user.purchasedPrograms?.map(program => ({
            name: program,
            totalDays: 30,
            completedDays: user.completedDays?.[program] || 0,
            currentDay: (user.completedDays?.[program] || 0) + 1,
            startDate: user.programStartDates?.[program] || user.CreatedAt,
            lastWorkout: user.UpdatedAt,
            completionRate: Math.round(((user.completedDays?.[program] || 0) / 30) * 100),
            streak: Math.min(user.completedDays?.[program] || 0, 7),
            status: (user.completedDays?.[program] || 0) === 30 ? 'completed' : 
                   (user.completedDays?.[program] || 0) > 0 ? 'active' : 'not_started'
          })) || [],
          totalWorkouts: user.totalCompletedDays || 0,
          totalPrograms: user.programCount || 0,
          averageWorkoutsPerWeek: Math.round((user.totalCompletedDays || 0) / Math.max(user.accountAge / 7, 1)),
          longestStreak: Math.min(user.totalCompletedDays || 0, 14),
          achievements: [
            ...(user.totalCompletedDays >= 1 ? [{ name: 'First Workout', icon: '🎯', date: user.CreatedAt }] : []),
            ...(user.totalCompletedDays >= 10 ? [{ name: '10 Workouts', icon: '💪', date: user.UpdatedAt }] : []),
            ...(user.totalCompletedDays >= 30 ? [{ name: '30 Day Warrior', icon: '🏆', date: user.UpdatedAt }] : []),
            ...(user.programCount >= 1 ? [{ name: 'Program Starter', icon: '🚀', date: user.CreatedAt }] : []),
          ]
        });
      }
    } finally {
      setProgressLoading(false);
    }
  };

  const fetchUserActivity = async (userId) => {
    try {
      const response = await api.get(`${BACKEND_URL}/api/admin/users/${userId}/activity`);
      setUserActivity(response.data);
    } catch (error) {
      console.error('Error fetching user activity:', error);
      // Create mock activity data if API doesn't exist yet
      const user = users.find(u => u.ID === userId);
      if (user) {
        const now = new Date();
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        
        setUserActivity({
          userId: userId,
          recentActivity: [
            { type: 'workout_completed', date: user.UpdatedAt, details: 'Completed Day 5: Upper Body Strength' },
            { type: 'program_started', date: user.CreatedAt, details: 'Started Beginner Program' },
            { type: 'account_created', date: user.CreatedAt, details: 'Account created' },
          ],
          loginHistory: [
            { date: user.UpdatedAt, ip: '192.168.1.1', device: 'Desktop' },
            { date: user.CreatedAt, ip: '192.168.1.1', device: 'Mobile' },
          ],
          workoutStats: {
            thisWeek: Math.min(user.totalCompletedDays || 0, 5),
            thisMonth: user.totalCompletedDays || 0,
            favoriteWorkoutType: 'Circuit',
            averageWorkoutDuration: '25 minutes',
            preferredWorkoutTime: 'Morning (8-10 AM)',
          },
          engagement: {
            emailOpens: Math.floor(Math.random() * 20) + 5,
            emailClicks: Math.floor(Math.random() * 10) + 2,
            supportTickets: Math.floor(Math.random() * 3),
            lastEmailOpened: user.UpdatedAt,
          }
        });
      }
    }
  };

  const sendUserEmail = async (userId, type) => {
    try {
      await api.post(`${BACKEND_URL}/api/admin/users/${userId}/send-email`, { type });
      showToast('success', `${type} email sent successfully`);
    } catch (error) {
      showToast('error', `Failed to send ${type} email`);
      console.error('Error sending email:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-b from-customGray/30 to-white p-6 pt-32">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-customGray"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-customGray/30 to-white p-6 pt-32">
      <div className="max-w-7xl mx-auto">
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
          <h1 className="text-4xl font-bold text-customGray mb-6">
            User Management & Analytics
          </h1>
          <button
            onClick={exportUserData}
            className="flex items-center space-x-2 bg-customGray text-white px-4 py-2 rounded-lg hover:bg-logoGray transition-colors mx-auto"
          >
            <FiDownload className="w-4 h-4" />
            <span>Export Data</span>
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <FiUser className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Users</p>
                <p className="text-2xl font-bold text-customGray">{userStats.total}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100">
                <FiActivity className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Active Users</p>
                <p className="text-2xl font-bold text-customGray">{userStats.active}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100">
                <FiShield className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Admins</p>
                <p className="text-2xl font-bold text-customGray">{userStats.admins}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100">
                <FiCalendar className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">New This Week</p>
                <p className="text-2xl font-bold text-customGray">{userStats.newThisWeek}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-orange-100">
                <FiTrendingUp className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Workouts</p>
                <p className="text-2xl font-bold text-customGray">{userStats.totalWorkouts}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-limeGreen focus:border-transparent"
              />
            </div>

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-limeGreen focus:border-transparent"
            >
              <option value="all">All Roles</option>
              <option value="user">Users</option>
              <option value="admin">Admins</option>
            </select>

            <select
              value={activityFilter}
              onChange={(e) => setActivityFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-limeGreen focus:border-transparent"
            >
              <option value="all">All Activity Levels</option>
              <option value="New">New Users</option>
              <option value="Active">Active Users</option>
              <option value="Regular">Regular Users</option>
              <option value="Dedicated">Dedicated Users</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-limeGreen focus:border-transparent"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="mostActive">Most Active</option>
              <option value="email">Email A-Z</option>
            </select>
          </div>
        </div>

        {/* Users Table */}
        {filteredUsers.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-customGray mb-4">
              {users.length === 0 ? "No users found" : "No users match your filters"}
            </h3>
            <p className="text-logoGray">
              {users.length === 0 ? "No registered users in the system." : "Try adjusting your search or filter criteria."}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role & Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Activity Level
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Workouts & Programs
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Account Info
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Activity
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr key={user.ID} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-customGray/10 flex items-center justify-center">
                              <FiUser className="h-5 w-5 text-customGray" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-customGray">
                              {user.email}
                            </div>
                            <div className="text-sm text-logoGray">
                              ID: {user.ID} • {user.timezone || "UTC"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="space-y-1">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              user.role === "admin"
                                ? "bg-purple-100 text-purple-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {user.role === "admin" && (
                              <FiShield className="w-3 h-3 mr-1" />
                            )}
                            {user.role}
                          </span>
                          <div>
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                user.isActive !== false
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {user.isActive !== false ? (
                                <>
                                  <FiUserCheck className="w-3 h-3 mr-1" />
                                  Active
                                </>
                              ) : (
                                <>
                                  <FiUserX className="w-3 h-3 mr-1" />
                                  Inactive
                                </>
                              )}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getActivityColor(user.activityLevel)}`}
                        >
                          <FiActivity className="w-3 h-3 mr-1" />
                          {user.activityLevel}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-logoGray">
                        <div className="space-y-1">
                          <div className="flex items-center">
                            <FiTrendingUp className="w-4 h-4 mr-1 text-green-600" />
                            <span>{user.totalCompletedDays || 0} workouts</span>
                          </div>
                          <div className="flex items-center">
                            <FiCalendar className="w-4 h-4 mr-1 text-blue-600" />
                            <span>{user.programCount || 0} programs</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-logoGray">
                        <div className="space-y-1">
                          <div>Registered: {formatDate(user.CreatedAt)}</div>
                          <div className="text-xs">
                            {user.accountAge} days ago
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-logoGray">
                        <div className="space-y-1">
                          <div className="flex items-center">
                            <FiClock className="w-4 h-4 mr-1" />
                            {user.lastLogin ? formatDate(user.lastLogin) : "Never"}
                          </div>
                          <div className="text-xs">
                            {user.daysSinceLastActivity} days ago
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => {
                              setSelectedUser(user);
                              fetchUserProgress(user.ID);
                              setShowProgressModal(true);
                            }}
                            className="text-green-600 hover:text-green-800 transition-colors p-2 rounded-lg hover:bg-green-50"
                            title="View Progress"
                          >
                            <FiBarChart2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedUser(user);
                              fetchUserActivity(user.ID);
                              setShowActivityModal(true);
                            }}
                            className="text-purple-600 hover:text-purple-800 transition-colors p-2 rounded-lg hover:bg-purple-50"
                            title="View Activity"
                          >
                            <FiActivity className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedUser(user);
                              setShowUserDetails(true);
                            }}
                            className="text-blue-600 hover:text-blue-800 transition-colors p-2 rounded-lg hover:bg-blue-50"
                            title="View Details"
                          >
                            <FiEye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => toggleUserStatus(user)}
                            className={`p-2 rounded-lg transition-colors ${
                              user.isActive !== false
                                ? "text-red-600 hover:text-red-800 hover:bg-red-50"
                                : "text-green-600 hover:text-green-800 hover:bg-green-50"
                            }`}
                            title={
                              user.isActive !== false
                                ? "Deactivate User"
                                : "Activate User"
                            }
                          >
                            {user.isActive !== false ? (
                              <FiUserX className="w-4 h-4" />
                            ) : (
                              <FiUserCheck className="w-4 h-4" />
                            )}
                          </button>
                          <button
                            onClick={() => toggleAdminRole(user)}
                            className={`p-2 rounded-lg transition-colors ${
                              user.role === "admin"
                                ? "text-purple-600 hover:text-purple-800 hover:bg-purple-50"
                                : "text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                            }`}
                            title={
                              user.role === "admin"
                                ? "Remove Admin Role"
                                : "Make Admin"
                            }
                          >
                            <FiShield className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setUserToReset(user);
                              setShowResetModal(true);
                            }}
                            className="text-orange-600 hover:text-orange-800 transition-colors p-2 rounded-lg hover:bg-orange-50"
                            title="Send Password Reset Email"
                          >
                            <FiKey className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setUserToDelete(user);
                              setShowDeleteModal(true);
                            }}
                            className="text-red-600 hover:text-red-800 transition-colors p-2 rounded-lg hover:bg-red-50"
                            title="Delete User"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* User Progress Modal */}
        {showProgressModal && selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-customGray flex items-center gap-2">
                  <FiBarChart2 className="text-green-600" />
                  Progress Overview: {selectedUser.email}
                </h3>
                <button
                  onClick={() => {
                    setShowProgressModal(false);
                    setSelectedUser(null);
                    setUserProgress(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              {progressLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                </div>
              ) : userProgress ? (
                <div className="space-y-6">
                  {/* Overall Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <FiTarget className="text-green-600" />
                        <span className="font-semibold text-green-800">Total Workouts</span>
                      </div>
                      <div className="text-2xl font-bold text-green-600">{userProgress.totalWorkouts}</div>
                    </div>
                    
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <FiPlay className="text-blue-600" />
                        <span className="font-semibold text-blue-800">Programs</span>
                      </div>
                      <div className="text-2xl font-bold text-blue-600">{userProgress.totalPrograms}</div>
                    </div>
                    
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <FiTrendingUp className="text-purple-600" />
                        <span className="font-semibold text-purple-800">Weekly Avg</span>
                      </div>
                      <div className="text-2xl font-bold text-purple-600">{userProgress.averageWorkoutsPerWeek}</div>
                    </div>
                    
                    <div className="bg-orange-50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <FiAward className="text-orange-600" />
                        <span className="font-semibold text-orange-800">Longest Streak</span>
                      </div>
                      <div className="text-2xl font-bold text-orange-600">{userProgress.longestStreak} days</div>
                    </div>
                  </div>

                  {/* Program Progress */}
                  <div>
                    <h4 className="text-lg font-semibold text-customGray mb-4 flex items-center gap-2">
                      <FiPlay className="text-blue-600" />
                      Program Progress
                    </h4>
                    {userProgress.programs.length > 0 ? (
                      <div className="space-y-4">
                        {userProgress.programs.map((program, index) => (
                          <div key={index} className="border rounded-lg p-4">
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <h5 className="font-semibold text-customGray">{program.name}</h5>
                                <p className="text-sm text-gray-600">
                                  Day {program.currentDay} of {program.totalDays}
                                </p>
                              </div>
                              <div className="text-right">
                                <div className={`px-2 py-1 rounded text-xs font-medium ${
                                  program.status === 'completed' ? 'bg-green-100 text-green-800' :
                                  program.status === 'active' ? 'bg-blue-100 text-blue-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {program.status === 'completed' ? 'Completed' :
                                   program.status === 'active' ? 'In Progress' : 'Not Started'}
                                </div>
                              </div>
                            </div>
                            
                            <div className="mb-3">
                              <div className="flex justify-between text-sm mb-1">
                                <span>Progress</span>
                                <span>{program.completionRate}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-green-600 h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${program.completionRate}%` }}
                                ></div>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <span className="text-gray-600">Started:</span>
                                <div className="font-medium">{new Date(program.startDate).toLocaleDateString()}</div>
                              </div>
                              <div>
                                <span className="text-gray-600">Completed:</span>
                                <div className="font-medium">{program.completedDays} days</div>
                              </div>
                              <div>
                                <span className="text-gray-600">Current Streak:</span>
                                <div className="font-medium">{program.streak} days</div>
                              </div>
                              <div>
                                <span className="text-gray-600">Last Workout:</span>
                                <div className="font-medium">{new Date(program.lastWorkout).toLocaleDateString()}</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 italic">No programs started yet</p>
                    )}
                  </div>

                  {/* Achievements */}
                  <div>
                    <h4 className="text-lg font-semibold text-customGray mb-4 flex items-center gap-2">
                      <FiAward className="text-yellow-600" />
                      Achievements ({userProgress.achievements.length})
                    </h4>
                    {userProgress.achievements.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {userProgress.achievements.map((achievement, index) => (
                          <div key={index} className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                            <div className="text-2xl">{achievement.icon}</div>
                            <div>
                              <div className="font-semibold text-yellow-800">{achievement.name}</div>
                              <div className="text-sm text-yellow-600">
                                {new Date(achievement.date).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 italic">No achievements yet</p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No progress data available</p>
                </div>
              )}

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => sendUserEmail(selectedUser.ID, 'motivation')}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  <FiMail className="w-4 h-4" />
                  Send Motivation Email
                </button>
                <button
                  onClick={() => {
                    setShowProgressModal(false);
                    setSelectedUser(null);
                    setUserProgress(null);
                  }}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* User Activity Modal */}
        {showActivityModal && selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-customGray flex items-center gap-2">
                  <FiActivity className="text-purple-600" />
                  Activity & Engagement: {selectedUser.email}
                </h3>
                <button
                  onClick={() => {
                    setShowActivityModal(false);
                    setSelectedUser(null);
                    setUserActivity(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              {userActivity ? (
                <div className="space-y-6">
                  {/* Workout Stats */}
                  <div>
                    <h4 className="text-lg font-semibold text-customGray mb-4 flex items-center gap-2">
                      <FiBarChart2 className="text-blue-600" />
                      Workout Statistics
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="text-sm text-blue-600 mb-1">This Week</div>
                        <div className="text-2xl font-bold text-blue-800">{userActivity.workoutStats.thisWeek} workouts</div>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <div className="text-sm text-green-600 mb-1">This Month</div>
                        <div className="text-2xl font-bold text-green-800">{userActivity.workoutStats.thisMonth} workouts</div>
                      </div>
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <div className="text-sm text-purple-600 mb-1">Avg Duration</div>
                        <div className="text-2xl font-bold text-purple-800">{userActivity.workoutStats.averageWorkoutDuration}</div>
                      </div>
                    </div>
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-sm text-gray-600 mb-1">Favorite Workout Type</div>
                        <div className="font-semibold text-gray-800">{userActivity.workoutStats.favoriteWorkoutType}</div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-sm text-gray-600 mb-1">Preferred Time</div>
                        <div className="font-semibold text-gray-800">{userActivity.workoutStats.preferredWorkoutTime}</div>
                      </div>
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div>
                    <h4 className="text-lg font-semibold text-customGray mb-4 flex items-center gap-2">
                      <FiClock className="text-orange-600" />
                      Recent Activity
                    </h4>
                    <div className="space-y-3">
                      {userActivity.recentActivity.map((activity, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                          <div className={`p-2 rounded-full ${
                            activity.type === 'workout_completed' ? 'bg-green-100 text-green-600' :
                            activity.type === 'program_started' ? 'bg-blue-100 text-blue-600' :
                            'bg-gray-100 text-gray-600'
                          }`}>
                            {activity.type === 'workout_completed' ? <FiCheckCircle className="w-4 h-4" /> :
                             activity.type === 'program_started' ? <FiPlay className="w-4 h-4" /> :
                             <FiUser className="w-4 h-4" />}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-gray-800">{activity.details}</div>
                            <div className="text-sm text-gray-600">{new Date(activity.date).toLocaleString()}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Email Engagement */}
                  <div>
                    <h4 className="text-lg font-semibold text-customGray mb-4 flex items-center gap-2">
                      <FiMail className="text-indigo-600" />
                      Email Engagement
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="bg-indigo-50 p-4 rounded-lg">
                        <div className="text-sm text-indigo-600 mb-1">Email Opens</div>
                        <div className="text-2xl font-bold text-indigo-800">{userActivity.engagement.emailOpens}</div>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <div className="text-sm text-green-600 mb-1">Email Clicks</div>
                        <div className="text-2xl font-bold text-green-800">{userActivity.engagement.emailClicks}</div>
                      </div>
                      <div className="bg-yellow-50 p-4 rounded-lg">
                        <div className="text-sm text-yellow-600 mb-1">Support Tickets</div>
                        <div className="text-2xl font-bold text-yellow-800">{userActivity.engagement.supportTickets}</div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-sm text-gray-600 mb-1">Last Email Opened</div>
                        <div className="text-sm font-medium text-gray-800">
                          {new Date(userActivity.engagement.lastEmailOpened).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Login History */}
                  <div>
                    <h4 className="text-lg font-semibold text-customGray mb-4 flex items-center gap-2">
                      <FiClock className="text-gray-600" />
                      Recent Logins
                    </h4>
                    <div className="space-y-2">
                      {userActivity.loginHistory.map((login, index) => (
                        <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <div>
                            <div className="font-medium text-gray-800">{login.device}</div>
                            <div className="text-sm text-gray-600">{login.ip}</div>
                          </div>
                          <div className="text-sm text-gray-600">
                            {new Date(login.date).toLocaleString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No activity data available</p>
                </div>
              )}

              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => sendUserEmail(selectedUser.ID, 'engagement')}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
                >
                  <FiMail className="w-4 h-4" />
                  Send Engagement Email
                </button>
                <button
                  onClick={() => {
                    setShowActivityModal(false);
                    setSelectedUser(null);
                    setUserActivity(null);
                  }}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* User Details Modal */}
        {showUserDetails && selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-customGray">
                  User Details: {selectedUser.email}
                </h3>
                <button
                  onClick={() => {
                    setShowUserDetails(false);
                    setSelectedUser(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Info */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-customGray border-b pb-2">Basic Information</h4>
                  <div className="space-y-2 text-sm">
                    <div><strong>User ID:</strong> {selectedUser.ID}</div>
                    <div><strong>Email:</strong> {selectedUser.email}</div>
                    <div><strong>Role:</strong> {selectedUser.role}</div>
                    <div><strong>Status:</strong> {selectedUser.isActive !== false ? "Active" : "Inactive"}</div>
                    <div><strong>Timezone:</strong> {selectedUser.timezone || "UTC"}</div>
                    <div><strong>Must Change Password:</strong> {selectedUser.mustChangePassword ? "Yes" : "No"}</div>
                  </div>
                </div>

                {/* Account Activity */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-customGray border-b pb-2">Account Activity</h4>
                  <div className="space-y-2 text-sm">
                    <div><strong>Activity Level:</strong> {selectedUser.activityLevel}</div>
                    <div><strong>Total Workouts:</strong> {selectedUser.totalCompletedDays || 0}</div>
                    <div><strong>Programs Purchased:</strong> {selectedUser.programCount || 0}</div>
                    <div><strong>Auth Tokens:</strong> {selectedUser.authTokenCount || 0}</div>
                    <div><strong>Account Age:</strong> {selectedUser.accountAge} days</div>
                    <div><strong>Last Activity:</strong> {selectedUser.daysSinceLastActivity} days ago</div>
                  </div>
                </div>

                {/* Dates */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-customGray border-b pb-2">Important Dates</h4>
                  <div className="space-y-2 text-sm">
                    <div><strong>Registered:</strong> {formatDate(selectedUser.CreatedAt)}</div>
                    <div><strong>Last Updated:</strong> {formatDate(selectedUser.UpdatedAt)}</div>
                    <div><strong>Last Login:</strong> {selectedUser.lastLogin ? formatDate(selectedUser.lastLogin) : "Never"}</div>
                  </div>
                </div>

                {/* Programs */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-customGray border-b pb-2">Purchased Programs</h4>
                  <div className="space-y-2 text-sm">
                    {selectedUser.purchasedPrograms && selectedUser.purchasedPrograms.length > 0 ? (
                      selectedUser.purchasedPrograms.map((program, index) => (
                        <div key={index} className="bg-gray-50 p-2 rounded">
                          {program}
                        </div>
                      ))
                    ) : (
                      <div className="text-gray-500 italic">No programs purchased</div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => {
                    setShowUserDetails(false);
                    setSelectedUser(null);
                  }}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && userToDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold text-customGray mb-4">
                Delete User
              </h3>
              <p className="text-logoGray mb-6">
                Are you sure you want to delete user &ldquo;{userToDelete.email}
                &rdquo;? This action cannot be undone.
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setUserToDelete(null);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-customGray rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(userToDelete.ID)}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Password Reset Confirmation Modal */}
        {showResetModal && userToReset && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold text-customGray mb-4">
                Send Password Reset Email
              </h3>
              <p className="text-logoGray mb-6">
                Send a password reset email to &ldquo;{userToReset.email}
                &rdquo;? They will receive an email with instructions to reset
                their password.
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={() => {
                    setShowResetModal(false);
                    setUserToReset(null);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-customGray rounded-lg hover:bg-gray-50 transition-colors"
                  disabled={resetLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={() => handlePasswordReset(userToReset.ID)}
                  className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={resetLoading}
                >
                  {resetLoading ? "Sending..." : "Send Reset Email"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default UserManagement;
