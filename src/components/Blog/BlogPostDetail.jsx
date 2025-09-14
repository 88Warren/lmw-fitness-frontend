import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { BACKEND_URL } from "../../utils/config";
import LoadingAndErrorDisplay from "../Shared/Errors/LoadingAndErrorDisplay";
import NewsletterSignup from "./Sections/NewsletterSignup";
import DynamicHeading from "../Shared/DynamicHeading";
import { showToast } from "../../utils/toastUtil";
import PropTypes from "prop-types";

const BlogPostDetail = ({ handleEditClick, handleDelete }) => {
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
        console.error("Error fetching blog post:", err);
        setError("Failed to load blog post. Please try again.");
        showToast("error", `${err.message || "Failed to load blog post."}`);
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
      displayMessage = "Blog post not found.";
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
    navigate("/blog");
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
    <>
      <div className="bg-customGray p-4 md:p-8 rounded-lg text-center max-w-md md:max-w-3xl lg:max-w-5xl w-full border-brightYellow border-2 mx-auto">
        {/* Back Button */}
        <div className="flex justify-between items-center mb-8">
          {/* Admin Actions */}
          {isAdmin && (
            <div className="flex space-x-4">
              <button onClick={handleEdit} className="btn-edit-small mt-0">
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
              </button>
              <button
                onClick={handleDeletePost}
                className="btn-skip-small mt-0"
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
              </button>
            </div>
          )}
        </div>

        {/* Article Header */}
        <header className="mb-8 text-center rounded-lg p-6">
          <DynamicHeading
            text={post.title}
            className="font-higherJump text-2xl md:text-4xl font-bold text-customWhite leading-loose tracking-widest mb-10"
          />
          {post.excerpt && (
            <p className="w-5/6 mx-auto text-lg text-logoGray font-titillium text-center whitespace-pre-line break-words leading-loose">
              {post.excerpt}
            </p>
          )}
        </header>

        {/* Featured Image */}
        {post.image && (
          <div className="flex justify-center items-center w-5/6 mx-auto mb-8 rounded-lg overflow-hidden border-2 border-brightYellow">
            <img
              src={post.image}
              alt={post.title}
              className="h-80 object-cover w-full"
            />
          </div>
        )}

        {/* Article Content */}
        <article className="w-5/6 mx-auto bg-customGray text-customWhite text-left py-8">
          <div
            className="blog-article"
            dangerouslySetInnerHTML={{ __html: post.fullContent }}
          />
        </article>

        {/* Bottom Navigation */}
        <div className="flex justify-center mb-8">
          <button onClick={handleBackToArticles} className="btn-primary mt-0">
            Back to All Articles
          </button>
        </div>
      </div>

      {/* Newsletter Signup - Now outside the card */}
      <div className="w-full md:w-1/2 flex flex-col items-center mx-auto mt-8">
        <NewsletterSignup />
      </div>
    </>
  );
};

export default BlogPostDetail;

BlogPostDetail.propTypes = {
  handleEditClick: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
};
