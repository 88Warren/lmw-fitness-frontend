import { useState, useEffect } from 'react';
import { BACKEND_URL } from '../utils/config';
import { useNavigate } from 'react-router-dom';
import useAuth from './useAuth'; 
import { showToast } from '../utils/toastUtil';

const useBlogData = () => {
  const { token } = useAuth(); 
  const [actualBlogPosts, setActualBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');
  const [newBlogData, setNewBlogData] = useState({
    title: '',
    excerpt: '',
    fullContent: '',
    image: '',
    isFeatured: false,
  });
  const [editingPost, setEditingPost] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogPosts = async () => {
      setLoading(true);
      setError(null);
      setMessage(''); 
      try {
        const response = await fetch(`${BACKEND_URL}/api/blog`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setActualBlogPosts(data); 
      } catch (err) {
        console.error('Error fetching blog posts:', err);
        setError('Failed to load blog posts.');
        showToast("error", "Failed to load blog posts.");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPosts();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewBlogData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleFormSubmit = async (e, mode) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage('');

    if (!token) { 
    showToast('error', 'You must be logged in to perform this action.');
    setLoading(false);
    return;
  }

    // console.log("Submitting newBlogData:", newBlogData);

    let response;
    let url;
    let method;
    let successMessage;

    if (mode === 'create') {
      url = `${BACKEND_URL}/api/blog`;
      method = 'POST';
      successMessage = 'Blog post created successfully!';
    } else if (mode === 'edit' && editingPost) {
      url = `${BACKEND_URL}/api/blog/${editingPost.ID}`;
      method = 'PUT';
      successMessage = 'Blog post updated successfully!';
    } else {
        showToast('error', 'Invalid mode or no post selected for submission.');
        setLoading(false);
        return;
    }

    try{
      response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
        body: JSON.stringify(newBlogData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Server error response:", errorData);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      showToast('success', successMessage);

      const refreshResponse = await fetch(`${BACKEND_URL}/api/blog`);
      const refreshData = await refreshResponse.json();
      setActualBlogPosts(refreshData);
      setNewBlogData({
        title: '',
        excerpt: '',
        fullContent: '',
        image: '',
        isFeatured: false,
      });
      setEditingPost(null);
      navigate('/blog');
    } catch (err) {
      console.error('Error submitting blog post:', err);
      setError('Failed to save blog post. Please try again.');
      showToast('error', `${err.message || 'Failed to save blog post.'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNewBlogClick = () => {
    setNewBlogData({
      title: '',
      excerpt: '',
      fullContent: '',
      image: '',
      isFeatured: false,
    });
  };

  const handleEditClick = (postToEdit) => {
    setEditingPost(postToEdit);
    setNewBlogData({
      title: postToEdit.title,
      excerpt: postToEdit.excerpt,
      fullContent: postToEdit.fullContent,
      image: postToEdit.image,
      isFeatured: postToEdit.isFeatured,
    });
  };

  const handleDelete = async (postIdToDelete) => {
    if (!window.confirm("Are you sure you want to delete this post?")) {
      return;
    }

    setLoading(true);
    setError(null);
    setMessage('');

    if (!token) { 
    showToast('error', 'You must be logged in to perform this action.');
    setLoading(false);
    return;
  }

    // console.log(`Attempting to delete post with ID: ${postIdToDelete}`);

    try {
      const response = await fetch(`${BACKEND_URL}/api/blog/${postIdToDelete}`, {
        method: 'DELETE',
        headers: { 
        'Authorization': `Bearer ${token}`, 
      },
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json(); 
        console.error("Server error response on delete:", errorData);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      showToast('success', 'Blog post deleted successfully!');
      setActualBlogPosts(prevPosts => 
        prevPosts.filter(post => post.ID !== postIdToDelete)
      );

      if (window.location.pathname.includes(`/blog/${postIdToDelete}`)) {
        navigate('/blog');
      }
    } catch (err) {
      console.error('Error deleting blog post:', err);
      setError('Failed to delete blog post.');
      showToast('error', `${err.message || 'Failed to delete blog post.'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToList = () => {
    setNewBlogData({ 
      title: '',
      excerpt: '',
      fullContent: '',
      image: '',
      isFeatured: false,
    });
    setEditingPost(null); 
    navigate('/blog'); 
  };

  return {
    editingPost,
    actualBlogPosts,
    newBlogData,
    loading,
    error,
    message,
    handleCreateNewBlogClick,
    handleInputChange,
    handleFormSubmit,
    handleEditClick,
    handleDelete,
    handleBackToList, 
  };
};

export default useBlogData;
