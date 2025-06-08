import { useEffect, useState } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { BACKEND_URL } from '../../utils/config';
import LoadingAndErrorDisplay from "../Shared/Errors/LoadingAndErrorDisplay"
import NewsletterSignup from "./Sections/NewsletterSignup";
import { showToast } from '../../utils/toastUtil'; 

const BlogPostDetail = ({
  handleEditClick,
  handleDelete,
}) => {
  const { isAdmin } = useAuth();
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${BACKEND_URL}/api/blog/${postId}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error(`Blog post with ID '${postId}' not found.`);
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setPost(data); 
      } catch (err) {
        console.error('Error fetching blog post:', err);
        setError('Failed to load blog post. Please try again.');
        showToast("error", `${err.message || 'Failed to load blog post.'}`);
      } finally {
        setLoading(false);
      }
    };

    if (postId) {
      fetchPost();
    }
  }, [postId]);

  if (loading || error || !post) {
    let displayMessage = null;
    if (!post && !loading && !error) {
        displayMessage = 'Blog post not found.'; 
    }

    return (
        <div className="py-16 text-center min-h-screen flex items-center justify-center"> 
            <LoadingAndErrorDisplay
                loading={loading}
                error={error} 
                message={displayMessage}
            />
        </div>
    );
  }

  const handleBackToArticles = () => {
    navigate('/blog');
  };

  const handleEdit = () => {
    if (handleEditClick) {
      handleEditClick(post);
    }
  };

  const handleDeletePost = () => {
    if (handleDelete) {
      handleDelete(post.ID);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-customGray/40 to-customGray rounded-xl pt-24 pb-32">
      <div className="max-w-4xl mx-auto px-4">
        {/* Back Button */}
        <button
          onClick={handleBackToArticles}
          className="mb-8 inline-flex items-center space-x-2 text-customGray hover:text-hotPink transition-colors duration-300 font-titillium font-semibold group"
        >
          <svg
            className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          <span>Back to all articles</span>
        </button>

        {/* Article Header */}
        <header className="mb-12 text-center">
          <h1 className="text-3xl md:text-4xl font-higherJump text-black/80 leading-loose tracking-wider mb-8">
            {post.title}
          </h1>
          {post.excerpt && (
            <p className="text-lg text-customGray font-titillium mx-4 leading-relaxed tracking-wide">
              {post.excerpt}
            </p>
          )}
        </header>

        {/* Featured Image */}
        {post.image && (
          <div className="mb-16 rounded-xl overflow-hidden shadow-lg">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-80 object-cover"
            />
          </div>
        )}

        {/* Article Content */}
        <article className="bg-customWhite rounded-xl p-10 border border-logoGray mb-12">
          <div
            className="prose prose-lg max-w-none
              prose-headings:text-gray-800 prose-headings:font-higherJump
              prose-p:text-gray-600 prose-p:font-titillium prose-p:leading-relaxed
              prose-a:text-hotPink prose-a:no-underline hover:prose-a:text-brightYellow
              prose-strong:text-gray-800
              prose-ul:text-gray-600 prose-ol:text-gray-600
              prose-blockquote:border-l-gray-400 prose-blockquote:text-gray-700
              prose-code:text-limeGreen prose-code:bg-gray-100"
            dangerouslySetInnerHTML={{ __html: post.fullContent }}
          />
        </article>

        <div className="flex justify-between space-x-4 mb-12">
          {/* Back Button */}
          <button
            onClick={handleBackToArticles}
            className="mb-8 inline-flex items-center space-x-2 text-customWhite hover:text-hotPink transition-colors duration-300 font-titillium font-semibold group"
          >
            <svg
              className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            <span>Back to all articles</span>
          </button>
          {/* Admin Actions */}
          {isAdmin && (
            <div className="flex space-x-4">
              <button
                onClick={handleEdit}
                className="btn-edit"
              >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              <span>Edit Post</span>
            </button>
            <button
              onClick={handleDeletePost}
              className="btn-delete"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              <span>Delete Post</span>
            </button>
          </div>
        )}
        </div>

        <div className="w-full md:w-1/2 flex flex-col items-center mx-auto">
          <NewsletterSignup />
        </div>
      </div>
    </div>
  );
};

export default BlogPostDetail;
