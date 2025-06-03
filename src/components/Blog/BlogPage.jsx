import useBlogData from "../../hooks/useBlogData";
import BlogList from "../Blog/BlogList";
import BlogPostDetail from "../Blog/BlogPostDetails";
import BlogForm from "../Blog/BlogForm";
import { BACKEND_URL } from "../../utils/config";

const BlogPage = () => {
  const {
    viewMode,
    selectedPost,
    editingPost,
    actualBlogPosts,
    newBlogData,
    loading,
    error,
    message,
    handleReadMore,
    handleBackToList,
    handleCreateNewBlogClick,
    handleInputChange,
    handleFormSubmit,
    handleEditClick,
    handleDelete,
  } = useBlogData();

  return (
    <div
      className="min-h-screen pt-20 pb-10 font-titillium text-white bg-gradient-to-br from-customDarkBackground via-customGray to-customDarkBackground"
      data-oid="13dvchn"
    >
      <div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        data-oid="_lx97u2"
      >
        {/* Status Messages */}
        {loading && (
          <div className="text-center mb-8" data-oid="9gan3s6">
            <div
              className="inline-flex items-center space-x-3 bg-customGray/50 backdrop-blur-sm px-6 py-4 rounded-lg border border-brightYellow/20"
              data-oid="r94ko9p"
            >
              <div
                className="animate-spin rounded-full h-6 w-6 border-b-2 border-brightYellow"
                data-oid="toz5.9k"
              ></div>
              <span
                className="text-brightYellow font-titillium"
                data-oid="gg-.:tz"
              >
                Loading...
              </span>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-8" data-oid="f26o::v">
            <div
              className="bg-red-500/20 border border-red-500/50 text-red-200 p-4 rounded-lg text-center backdrop-blur-sm"
              data-oid="ip6:n-9"
            >
              <div
                className="flex items-center justify-center space-x-2"
                data-oid="ryln1gh"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  data-oid="j6q8_xf"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    data-oid="3a:nfs_"
                  />
                </svg>
                <span className="font-titillium" data-oid="cnbc1:o">
                  {error}
                </span>
              </div>
            </div>
          </div>
        )}

        {message && (
          <div className="mb-8" data-oid="d7ymi:5">
            <div
              className="bg-limeGreen/20 border border-limeGreen/50 text-limeGreen p-4 rounded-lg text-center backdrop-blur-sm"
              data-oid="z:e5.u4"
            >
              <div
                className="flex items-center justify-center space-x-2"
                data-oid="9-8medo"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  data-oid="e:etfoo"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                    data-oid="y8_z0du"
                  />
                </svg>
                <span className="font-titillium" data-oid="thyrefg">
                  {message}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Content Rendering */}
        {viewMode === "detail" && selectedPost ? (
          <BlogPostDetail
            selectedPost={selectedPost}
            handleBackToList={handleBackToList}
            handleEditClick={handleEditClick}
            handleDelete={handleDelete}
            data-oid="2-_jc40"
          />
        ) : viewMode === "create" ? (
          <BlogForm
            isEditMode={false}
            newBlogData={newBlogData}
            handleInputChange={handleInputChange}
            handleFormSubmit={handleFormSubmit}
            handleBackToList={handleBackToList}
            data-oid="-os_jht"
          />
        ) : viewMode === "edit" && editingPost ? (
          <BlogForm
            isEditMode={true}
            newBlogData={newBlogData}
            handleInputChange={handleInputChange}
            handleFormSubmit={handleFormSubmit}
            handleBackToList={handleBackToList}
            data-oid="o3.tekq"
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
            data-oid="59fwywt"
          />
        )}
      </div>
    </div>
  );
};

export default BlogPage;
