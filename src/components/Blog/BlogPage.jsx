import useBlogData from '../../hooks/useBlogData';
import BlogList from '../Blog/BlogList';
import BlogPostDetail from '../Blog/BlogPostDetails';
import BlogForm from '../Blog/BlogForm';
import { BACKEND_URL } from '../../utils/config';

const BlogPage = () => {
  const {
    viewMode, selectedPost, editingPost, actualBlogPosts, 
    newBlogData, loading, error, message,
    handleReadMore, handleBackToList, handleCreateNewBlogClick,
    handleInputChange, handleFormSubmit, handleEditClick, handleDelete,
  } = useBlogData();

  return (
    <div className="min-h-screen pt-20 pb-10 font-titillium text-white"
          style={{ 
                backgroundImage: `url(${BACKEND_URL}/images/grunge-metal.jpg)`, // Use a grunge background image
                backgroundSize: 'cover',        
                backgroundPosition: 'center top', 
                backgroundRepeat: 'no-repeat',
      }}>
    
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        {loading && (
          <div className="text-center text-brightYellow text-xl mb-4">Loading...</div>
        )}
        {error && (
          <div className="bg-red-500 text-white p-4 rounded-lg mb-4 text-center">{error}</div>
        )}
        {message && (
          <div className="bg-limeGreen text-white p-4 rounded-lg mb-4 text-center">{message}</div>
        )}

        {viewMode === 'detail' && selectedPost ? (
          <BlogPostDetail
            selectedPost={selectedPost}
            handleBackToList={handleBackToList}
            handleEditClick={handleEditClick}
            handleDelete={handleDelete}
          />
        ) : viewMode === 'create' ? (
          <BlogForm
            isEditMode={false}
            newBlogData={newBlogData}
            handleInputChange={handleInputChange}
            handleFormSubmit={handleFormSubmit}
            handleBackToList={handleBackToList}
          />
        ) : viewMode === 'edit' && editingPost ? (
          <BlogForm
            isEditMode={true}
            newBlogData={newBlogData}
            handleInputChange={handleInputChange}
            handleFormSubmit={handleFormSubmit}
            handleBackToList={handleBackToList}
          />
        ) : (
          <BlogList
            actualBlogPosts={actualBlogPosts}
            loading={loading}
            error={error}
            handleReadMore={handleReadMore}
            handleEditClick={handleEditClick}
            handleDelete={handleDelete}
            handleCreateNewBlogClick={handleCreateNewBlogClick}
          />
        )}
      </div>
    </div>
  );
};

export default BlogPage;
