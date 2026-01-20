import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiEdit2, FiTrash2, FiEye, FiStar, FiArrowLeft } from 'react-icons/fi';
import { BACKEND_URL } from '../../utils/config';
import api from '../../utils/api';

const BlogManagement = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await api.get(`${BACKEND_URL}/api/blog`);
      setBlogs(response.data || []);
    } catch (err) {
      setError('Failed to load blog posts');
      console.error('Error fetching blogs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (blogId) => {
    try {
      await api.delete(`${BACKEND_URL}/api/blog/${blogId}`);
      setBlogs(blogs.filter(blog => blog.ID !== blogId));
      setShowDeleteModal(false);
      setBlogToDelete(null);
    } catch (err) {
      setError('Failed to delete blog post');
      console.error('Error deleting blog:', err);
    }
  };

  const toggleFeatured = async (blog) => {
    try {
      const response = await api.put(`${BACKEND_URL}/api/blog/${blog.ID}`, {
        ...blog,
        isFeatured: !blog.isFeatured
      });
      setBlogs(blogs.map(b => b.ID === blog.ID ? response.data : b));
    } catch (err) {
      setError('Failed to update blog post');
      console.error('Error updating blog:', err);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const truncateText = (text, maxLength = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
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
          <h1 className="text-4xl font-bold text-customGray mb-6">Blog Management</h1>
          <Link
            to="/admin/blogs/create"
            className="bg-customGray text-white px-6 py-3 rounded-lg hover:bg-logoGray transition-colors flex items-center space-x-2 mx-auto w-fit"
          >
            <FiPlus />
            <span>Create New Post</span>
          </Link>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Blog Posts Grid */}
        {blogs.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-customGray mb-4">No blog posts found</h3>
            <p className="text-logoGray mb-6">Get started by creating your first blog post.</p>
            <Link
              to="/admin/blogs/create"
              className="bg-customGray text-white px-6 py-3 rounded-lg hover:bg-logoGray transition-colors inline-flex items-center space-x-2"
            >
              <FiPlus />
              <span>Create First Post</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog) => (
              <div key={blog.ID} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                {/* Blog Image */}
                {blog.image && (
                  <div className="h-48 bg-gray-200 overflow-hidden">
                    <img 
                      src={blog.image} 
                      alt={blog.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                )}
                
                {/* Blog Content */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-customGray mb-2 line-clamp-2">
                        {blog.title}
                      </h3>
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-xs bg-customGray/10 text-customGray px-2 py-1 rounded">
                          {blog.category}
                        </span>
                        {blog.isFeatured && (
                          <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded flex items-center">
                            <FiStar className="w-3 h-3 mr-1" />
                            Featured
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-logoGray text-sm mb-4 line-clamp-3">
                    {truncateText(blog.excerpt)}
                  </p>
                  
                  <div className="text-xs text-logoGray mb-4">
                    Created: {formatDate(blog.CreatedAt)}
                    {blog.UpdatedAt !== blog.CreatedAt && (
                      <span className="ml-2">• Updated: {formatDate(blog.UpdatedAt)}</span>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between">
                    <div className="flex space-x-2">
                      <Link
                        to={`/blog/${blog.ID}`}
                        className="text-customGray hover:text-logoGray transition-colors p-2 rounded-lg hover:bg-gray-100"
                        title="View Post"
                      >
                        <FiEye className="w-4 h-4" />
                      </Link>
                      <Link
                        to={`/admin/blogs/edit/${blog.ID}`}
                        className="text-blue-600 hover:text-blue-800 transition-colors p-2 rounded-lg hover:bg-blue-50"
                        title="Edit Post"
                      >
                        <FiEdit2 className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => toggleFeatured(blog)}
                        className={`transition-colors p-2 rounded-lg ${
                          blog.isFeatured 
                            ? 'text-yellow-600 hover:text-yellow-800 hover:bg-yellow-50' 
                            : 'text-gray-400 hover:text-yellow-600 hover:bg-yellow-50'
                        }`}
                        title={blog.isFeatured ? 'Remove from Featured' : 'Mark as Featured'}
                      >
                        <FiStar className="w-4 h-4" />
                      </button>
                    </div>
                    <button
                      onClick={() => {
                        setBlogToDelete(blog);
                        setShowDeleteModal(true);
                      }}
                      className="text-red-600 hover:text-red-800 transition-colors p-2 rounded-lg hover:bg-red-50"
                      title="Delete Post"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && blogToDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold text-customGray mb-4">Delete Blog Post</h3>
              <p className="text-logoGray mb-6">
                Are you sure you want to delete &ldquo;{blogToDelete.title}&rdquo;? This action cannot be undone.
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setBlogToDelete(null);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-customGray rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(blogToDelete.ID)}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogManagement;