import useBlogData from '../../hooks/useBlogData';
import BlogList from '../Blog/BlogList';
import BlogPostDetail from '../Blog/BlogPostDetails';
import BlogForm from '../Blog/BlogForm';

const BlogPage = () => {
  const {
    viewMode, selectedPost, editingPost, actualBlogPosts, newBlogData,
    loading, error, message,
    handleReadMore, handleBackToList, handleCreateNewBlogClick,
    handleInputChange, handleFormSubmit, handleEditClick, handleDelete,
  } = useBlogData();

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
