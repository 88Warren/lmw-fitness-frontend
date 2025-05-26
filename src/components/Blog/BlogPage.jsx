import { useState, useEffect } from 'react';
import { getEnvVar } from "../../utils/config";

const BACKEND_URL = getEnvVar("VITE_BACKEND_URL");

const BlogPage = () => {
  const [viewMode, setViewMode] = useState('list');
  const [selectedPost, setSelectedPost] = useState(null);
  const [actualBlogPosts, setActualBlogPosts] = useState([]);
  const [newBlogData, setNewBlogData] = useState({
    title: '', // Frontend state for form binding (lowercase, matches json tag)
    author: '',
    date: '',
    image: '', // Corresponds to ImageURL in Go model, but json tag is 'image'
    excerpt: '',
    fullContent: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const fetchBlogPosts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${BACKEND_URL}/api/blog`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        // Ensure data is an array before setting state
        setActualBlogPosts(Array.isArray(data) ? data : []);
      } catch (e) {
        setError('Failed to load blog posts. Please ensure the backend server is running and accessible, and check your network connection.');
        console.error('Error fetching blog posts:', e);
      } finally {
        setLoading(false);
      }
    };

    if (viewMode === 'list') {
      fetchBlogPosts();
    }
  }, [viewMode]);


  const handleReadMore = (post) => {
    setSelectedPost(post);
    setViewMode('detail');
    window.scrollTo(0, 0);
  };

  const handleBackToBlog = () => {
    setSelectedPost(null);
    setViewMode('list');
    window.scrollTo(0, 0);
  };

  const handleCreateNewBlogClick = () => {
    setNewBlogData({
      title: '',
      author: '',
      date: '',
      image: '',
      excerpt: '',
      fullContent: '',
    });
    setViewMode('create');
    window.scrollTo(0, 0);
  };

  const handleCancelCreate = () => {
    setViewMode('list');
    window.scrollTo(0, 0);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBlogData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const response = await fetch(`${BACKEND_URL}/api/blog`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newBlogData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const createdPost = await response.json();
      setMessage('Blog post created successfully!');
      console.log('New blog post created:', createdPost);

      handleCancelCreate(); // This will trigger re-fetch of blog list
    } catch (e) {
      setError(`Failed to create blog post: ${e.message}. Please check backend server and your network connection.`);
      console.error('Error creating blog post:', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#747474] pt-20 pb-10 font-titillium">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading && (
          <div className="text-center text-white text-xl mb-4">Loading...</div>
        )}
        {error && (
          <div className="bg-red-500 text-white p-4 rounded-lg mb-4 text-center">{error}</div>
        )}
        {message && (
          <div className="bg-green-500 text-white p-4 rounded-lg mb-4 text-center">{message}</div>
        )}

        {viewMode === 'detail' ? (
          // Full Blog Post View
          <div className="bg-white p-6 md:p-8 rounded-lg shadow-xl border-t-4 border-[#ffcf00] animate-fadeIn">
            <button
              onClick={handleBackToBlog}
              className="mb-6 flex items-center text-[#21fc0d] hover:text-[#ff11ff] transition-colors duration-300 font-bold"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              Back to all blogs
            </button>
            {/* CORRECTED: Use lowercase properties from Go backend JSON */}
            <h1 className="text-4xl md:text-5xl font-bold text-[#747474] mb-4 font-higherJump leading-tight">{selectedPost.title}</h1>
            <p className="text-sm text-[#ff11ff] mb-6">
              By {selectedPost.author} on {selectedPost.date}
            </p>
            <img src={selectedPost.image || 'https://placehold.co/600x400/cecece/747474?text=No+Image'} alt={selectedPost.title} className="w-full h-auto rounded-lg mb-6 shadow-md" />
            <div className="prose prose-lg max-w-none text-[#747474]" dangerouslySetInnerHTML={{ __html: selectedPost.fullContent }}></div>
          </div>
        ) : viewMode === 'create' ? (
          // New Blog Post Form
          <div className="bg-white p-6 md:p-8 rounded-lg shadow-xl border-t-4 border-[#ffcf00] animate-fadeIn">
            <h1 className="text-4xl md:text-5xl font-bold text-[#747474] mb-6 font-higherJump leading-tight text-center">Create New Blog Post</h1>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-lg font-bold text-[#747474] mb-2">Title</label>
                <input type="text" id="title" name="title" value={newBlogData.title} onChange={handleInputChange} className="w-full p-3 border border-[#cecece] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#21fc0d]" placeholder="Enter blog title" required />
              </div>
              <div>
                <label htmlFor="author" className="block text-lg font-bold text-[#747474] mb-2">Author</label>
                <input type="text" id="author" name="author" value={newBlogData.author} onChange={handleInputChange} className="w-full p-3 border border-[#cecece] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#21fc0d]" placeholder="Enter author name" required />
              </div>
              <div>
                <label htmlFor="date" className="block text-lg font-bold text-[#747474] mb-2">Date</label>
                <input type="date" id="date" name="date" value={newBlogData.date} onChange={handleInputChange} className="w-full p-3 border border-[#cecece] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#21fc0d]" required />
              </div>
              <div>
                <label htmlFor="image" className="block text-lg font-bold text-[#747474] mb-2">Image URL</label>
                <input type="url" id="image" name="image" value={newBlogData.image} onChange={handleInputChange} className="w-full p-3 border border-[#cecece] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#21fc0d]" placeholder="e.g., https://placehold.co/600x400" />
              </div>
              <div>
                <label htmlFor="excerpt" className="block text-lg font-bold text-[#747474] mb-2">Excerpt</label>
                <textarea id="excerpt" name="excerpt" rows="3" value={newBlogData.excerpt} onChange={handleInputChange} className="w-full p-3 border border-[#cecece] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#21fc0d]" placeholder="A short summary of the blog post" required></textarea>
              </div>
              <div>
                <label htmlFor="fullContent" className="block text-lg font-bold text-[#747474] mb-2">Full Content (HTML allowed)</label>
                <textarea id="fullContent" name="fullContent" rows="10" value={newBlogData.fullContent} onChange={handleInputChange} className="w-full p-3 border border-[#cecece] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#21fc0d]" placeholder="Write your full blog content here (HTML tags like <p>, <h3>, <ul> are supported)" required></textarea>
              </div>
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  type="button"
                  onClick={handleCancelCreate}
                  className="px-6 py-3 text-[#747474] font-bold rounded-full border border-[#747474] hover:bg-[#cecece] transition-colors duration-300 shadow-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 text-white font-bold rounded-full bg-gradient-to-r from-[#21fc0d] via-[#ffcf00] to-[#ff11ff] hover:from-[#ff11ff] hover:to-[#21fc0d] transition-all duration-300 shadow-md"
                >
                  Create Blog Post
                </button>
              </div>
            </form>
          </div>
        ) : (
          // Blog Post List View
          <>
            <div className="flex justify-center mb-10">
              <button
                onClick={handleCreateNewBlogClick}
                className="px-8 py-4 text-white font-bold rounded-full bg-gradient-to-r from-[#ffcf00] via-[#ff11ff] to-[#21fc0d] hover:from-[#21fc0d] hover:to-[#ffcf00] transition-all duration-300 shadow-lg text-xl font-higherJump"
              >
                + Create New Blog Post
              </button>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white text-center mb-10 font-higherJump leading-tight">
              LMW Fitness Blog
            </h1>
            <p className="text-xl text-white text-center mb-12 max-w-2xl mx-auto">
              Unlock your potential and "Live More With" our insights on holistic fitness, mindful movement, and sustainable well-being.
            </p>

            {actualBlogPosts.length === 0 && !loading && !error && (
              <p className="text-center text-white text-lg">No blog posts found. Be the first to create one!</p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {actualBlogPosts.map((post) => (
                <div
                  key={post.ID} // Use post.ID from GORM model
                  className="bg-white rounded-lg shadow-xl overflow-hidden transform hover:scale-105 transition-all duration-300 border-t-4 border-[#21fc0d]"
                >
                  {/* CORRECTED: Use lowercase 'image' from Go backend JSON */}
                  <img src={post.image || 'https://placehold.co/600x400/cecece/747474?text=No+Image'} alt={post.title} className="w-full h-48 object-cover" />
                  <div className="p-6">
                    {/* CORRECTED: Use lowercase properties from Go backend JSON */}
                    <h2 className="text-2xl font-bold text-[#747474] mb-3 font-higherJump leading-snug">
                      {post.title}
                    </h2>
                    <p className="text-sm text-[#ff11ff] mb-4">
                      By {post.author} on {post.date}
                    </p>
                    <p className="text-[#747474] text-base mb-5">
                      {post.excerpt}
                    </p>
                    <button
                      onClick={() => handleReadMore(post)}
                      className="inline-block px-6 py-3 text-white font-bold rounded-full bg-gradient-to-r from-[#21fc0d] via-[#ffcf00] to-[#ff11ff] hover:from-[#ff11ff] hover:to-[#21fc0d] transition-all duration-300 shadow-md"
                    >
                      Read More
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BlogPage;
