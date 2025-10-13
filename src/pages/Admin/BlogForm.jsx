import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { FiArrowLeft, FiSave, FiEye } from 'react-icons/fi';
import { BACKEND_URL } from '../../utils/config';
import api from '../../utils/api';

const BlogForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    title: '',
    image: '',
    excerpt: '',
    fullContent: '',
    isFeatured: false,
    category: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  const categories = [
    'Fitness',
    'Nutrition',
    'Wellness',
    'Workout Tips',
    'Motivation',
    'Health',
    'Lifestyle',
    'Training'
  ];

  useEffect(() => {
    if (isEditing) {
      fetchBlog();
    }
  }, [id, isEditing]);

  const fetchBlog = async () => {
    try {
      setLoading(true);
      const response = await api.get(`${BACKEND_URL}/api/blog/${id}`);
      const blog = response.data;
      setFormData({
        title: blog.title || '',
        image: blog.image || '',
        excerpt: blog.excerpt || '',
        fullContent: blog.fullContent || '',
        isFeatured: blog.isFeatured || false,
        category: blog.category || ''
      });
    } catch (err) {
      setError('Failed to load blog post');
      console.error('Error fetching blog:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.excerpt.trim() || !formData.fullContent.trim() || !formData.category.trim()) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      if (isEditing) {
        await api.put(`${BACKEND_URL}/api/blog/${id}`, formData);
      } else {
        await api.post(`${BACKEND_URL}/api/blog`, formData);
      }

      navigate('/admin/blogs');
    } catch (err) {
      setError(`Failed to ${isEditing ? 'update' : 'create'} blog post`);
      console.error('Error saving blog:', err);
    } finally {
      setLoading(false);
    }
  };

  const renderPreview = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-customGray mb-4">Preview</h2>
      
      {formData.image && (
        <div className="mb-6">
          <img 
            src={formData.image} 
            alt={formData.title}
            className="w-full h-64 object-cover rounded-lg"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        </div>
      )}
      
      <div className="flex items-center space-x-2 mb-4">
        <span className="text-sm bg-customGray/10 text-customGray px-3 py-1 rounded">
          {formData.category}
        </span>
        {formData.isFeatured && (
          <span className="text-sm bg-yellow-100 text-yellow-800 px-3 py-1 rounded">
            Featured
          </span>
        )}
      </div>
      
      <h1 className="text-3xl font-bold text-customGray mb-4">{formData.title}</h1>
      <p className="text-lg text-logoGray mb-6 italic">{formData.excerpt}</p>
      
      <div 
        className="prose max-w-none text-customGray"
        dangerouslySetInnerHTML={{ __html: formData.fullContent }}
      />
    </div>
  );

  if (loading && isEditing) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-customGray/30 to-white p-6 pt-24">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-customGray"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-customGray/30 to-white p-6 pt-24">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link 
              to="/admin/blogs" 
              className="flex items-center text-customGray hover:text-logoGray transition-colors"
            >
              <FiArrowLeft className="mr-2" />
              Back to Blog Management
            </Link>
            <h1 className="text-4xl font-bold text-customGray">
              {isEditing ? 'Edit Blog Post' : 'Create New Blog Post'}
            </h1>
          </div>
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => setShowPreview(!showPreview)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <FiEye />
              <span>{showPreview ? 'Hide Preview' : 'Show Preview'}</span>
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <div className={`grid ${showPreview ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'} gap-8`}>
          {/* Form */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-customGray mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-customGray focus:border-transparent"
                  placeholder="Enter blog post title"
                  required
                />
              </div>

              {/* Image URL */}
              <div>
                <label htmlFor="image" className="block text-sm font-medium text-customGray mb-2">
                  Image URL
                </label>
                <input
                  type="url"
                  id="image"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-customGray focus:border-transparent"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              {/* Category */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-customGray mb-2">
                  Category *
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-customGray focus:border-transparent"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              {/* Featured */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isFeatured"
                  name="isFeatured"
                  checked={formData.isFeatured}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-customGray focus:ring-customGray border-gray-300 rounded"
                />
                <label htmlFor="isFeatured" className="ml-2 block text-sm text-customGray">
                  Mark as featured post
                </label>
              </div>

              {/* Excerpt */}
              <div>
                <label htmlFor="excerpt" className="block text-sm font-medium text-customGray mb-2">
                  Excerpt *
                </label>
                <textarea
                  id="excerpt"
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-customGray focus:border-transparent"
                  placeholder="Brief description of the blog post"
                  required
                />
                <p className="text-sm text-logoGray mt-1">
                  This will be shown in blog previews and search results.
                </p>
              </div>

              {/* Full Content */}
              <div>
                <label htmlFor="fullContent" className="block text-sm font-medium text-customGray mb-2">
                  Content *
                </label>
                <textarea
                  id="fullContent"
                  name="fullContent"
                  value={formData.fullContent}
                  onChange={handleInputChange}
                  rows={15}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-customGray focus:border-transparent font-mono text-sm"
                  placeholder="Write your blog content here. You can use HTML tags for formatting."
                  required
                />
                <p className="text-sm text-logoGray mt-1">
                  You can use HTML tags for formatting (e.g., &lt;p&gt;, &lt;h2&gt;, &lt;strong&gt;, &lt;em&gt;, etc.)
                </p>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-customGray text-white px-8 py-3 rounded-lg hover:bg-logoGray transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiSave />
                  <span>{loading ? 'Saving...' : (isEditing ? 'Update Post' : 'Create Post')}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Preview */}
          {showPreview && (
            <div className="lg:sticky lg:top-24 lg:h-fit">
              {renderPreview()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogForm;