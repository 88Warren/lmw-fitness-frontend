import useBlogData from "../../hooks/useBlogData"; 
import BlogList from "./BlogList"; 
import BlogForm from "./BlogForm";
import BlogPostDetail from "./BlogPostDetail";
import LoadingAndErrorDisplay from "./Errors/LoadingAndErrorDisplay";
import { useNavigate, useParams } from 'react-router-dom'; 
import { useLocation } from 'react-router-dom';

const BlogPage = () => {
  const { postId } = useParams(); 
  const location = useLocation(); 

  const {
    viewMode,
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
  } = useBlogData();

  const navigateToCreateForm = () => {
    handleCreateNewBlogClick(); 
  };

  const navigateToEditForm = (postToEdit) => {
    handleEditClick(postToEdit);
  };

  let currentViewContent;

   if (location.pathname === '/blog/create') { 
    currentViewContent = (
      <BlogForm
        isEditMode={false}
        newBlogData={newBlogData}
        handleInputChange={handleInputChange}
        handleFormSubmit={handleFormSubmit}
        handleBackToList={handleBackToList}
      />
    );
  } else if (location.pathname === '/blog/edit' && editingPost) { 
    currentViewContent = (
      <BlogForm
        isEditMode={true}
        newBlogData={newBlogData}
        handleInputChange={handleInputChange}
        handleFormSubmit={handleFormSubmit}
        handleBackToList={handleBackToList}
      />
    );
  } else if (postId) { 
    currentViewContent = (
      <BlogPostDetail
        handleEditClick={navigateToEditForm}
        handleDelete={handleDelete}
      />
    );
  } else { 
    currentViewContent = (
      <BlogList
        actualBlogPosts={actualBlogPosts}
        handleEditClick={navigateToEditForm}
        handleDelete={handleDelete}
        handleCreateNewBlogClick={navigateToCreateForm}
      />
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-10 font-titillium text-white bg-gradient-to-br from-white via-black/50 to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <LoadingAndErrorDisplay loading={loading} error={error} message={message} />
        {currentViewContent}
      </div>
    </div>
  );
};

export default BlogPage;