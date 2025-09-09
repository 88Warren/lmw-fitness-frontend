import useBlogData from "../../hooks/useBlogData";
import BlogList from "./BlogList";
import BlogForm from "./BlogForm";
import BlogPostDetail from "./BlogPostDetail";
import LoadingAndErrorDisplay from "../Shared/Errors/LoadingAndErrorDisplay";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";

const BlogPage = () => {
  const { postId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const {
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
    navigate("/blog/create");
  };

  const navigateToEditForm = (postToEdit) => {
    handleEditClick(postToEdit);
    navigate("/blog/edit");
  };

  let currentViewContent;

  if (location.pathname === "/blog/create") {
    currentViewContent = (
      <BlogForm
        isEditMode={false}
        newBlogData={newBlogData}
        handleInputChange={handleInputChange}
        handleFormSubmit={handleFormSubmit}
        handleBackToList={handleBackToList}
      />
    );
  } else if (location.pathname === "/blog/edit") {
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
    <div className="flex flex-col items-center justify-center min-h-screen pt-30 pb-14 bg-gradient-to-b from-customGray/30 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <LoadingAndErrorDisplay
          loading={loading}
          error={error}
          message={message}
        />
        {currentViewContent}
      </div>
      <ToastContainer />
    </div>
  );
};

export default BlogPage;
