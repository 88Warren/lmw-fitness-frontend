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
} from "react-icons/fi";
import { BACKEND_URL } from "../../utils/config";
import api from "../../utils/api";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [showResetModal, setShowResetModal] = useState(false);
  const [userToReset, setUserToReset] = useState(null);
  const [resetLoading, setResetLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get(`${BACKEND_URL}/api/admin/users`);
      setUsers(response.data || []);
    } catch (err) {
      setError("Failed to load users");
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-customGray/30 to-white p-6 pt-24">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-customGray"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-customGray/30 to-white p-6 pt-24">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link
              to="/admin"
              className="flex items-center text-customGray hover:text-logoGray transition-colors"
            >
              <FiArrowLeft className="mr-2" />
              Back to Dashboard
            </Link>
            <h1 className="text-4xl font-bold text-customGray">
              User Management
            </h1>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Users Table */}
        {users.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-customGray mb-4">
              No users found
            </h3>
            <p className="text-logoGray">No registered users in the system.</p>
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
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Registered
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Login
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.ID} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-customGray/10 flex items-center justify-center">
                              <FiUser className="h-5 w-5 text-customGray" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-customGray">
                              {user.email}
                            </div>
                            <div className="text-sm text-logoGray">
                              ID: {user.ID}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
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
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
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
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-logoGray">
                        {formatDate(user.CreatedAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-logoGray">
                        {user.lastLogin ? formatDate(user.lastLogin) : "Never"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
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
    </div>
  );
};

export default UserManagement;
