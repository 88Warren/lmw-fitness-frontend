import useAuth from "../../hooks/useAuth";

const BlogPostDetail = ({
  selectedPost,
  handleBackToList,
  handleEditClick,
  handleDelete,
}) => {
  const { isAdmin } = useAuth(); // Get isAdmin status

  if (!selectedPost) {
    return null; // Should not happen if rendered conditionally
  }

  return (
    <div
      className="bg-gray-800 p-6 md:p-8 rounded-lg shadow-xl border border-limeGreen animate-fadeIn text-white"
      data-oid=".odr9fh"
    >
      {" "}
      {/* Darker background, limeGreen border */}
      <button
        onClick={handleBackToList}
        className="mb-6 flex items-center text-limeGreen hover:text-brightYellow transition-colors duration-300 font-bold font-titillium"
        data-oid="jx2a.yo"
      >
        <svg
          className="w-5 h-5 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          data-oid="9sjtsx5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
            data-oid="e7pk-mf"
          ></path>
        </svg>
        Back to all blogs
      </button>
      <h1
        className="text-4xl md:text-5xl font-bold text-brightYellow mb-4 font-higherJump leading-tight"
        data-oid="44tfbxa"
      >
        {selectedPost.title}
      </h1>
      <p
        className="text-sm text-hotPink mb-6 font-titillium"
        data-oid=":6po2ar"
      >
        {selectedPost.date}
      </p>
      <img
        src={
          selectedPost.image ||
          "https://placehold.co/1200x600/333/EEE?text=No+Image"
        }
        alt={selectedPost.title}
        className="w-full h-auto rounded-lg mb-6 shadow-md"
        data-oid="awc94mp"
      />
      <div
        className="prose prose-lg max-w-none text-logoGray"
        dangerouslySetInnerHTML={{ __html: selectedPost.fullContent }}
        data-oid="xn_r2yr"
      ></div>{" "}
      {/* Use logoGray for content text */}
      {isAdmin && ( // Only show edit/delete if admin
        <div className="mt-8 flex justify-end space-x-4" data-oid="batg-sv">
          <button
            onClick={() => handleEditClick(selectedPost)}
            className="btn-primary bg-blue-600 hover:bg-blue-700" // Using btn-primary
            data-oid="jjiu6e_"
          >
            Edit Post
          </button>
          <button
            onClick={() => handleDelete(selectedPost.ID)}
            className="btn-primary bg-red-600 hover:bg-red-700" // Using btn-primary
            data-oid="ox2nzyp"
          >
            Delete Post
          </button>
        </div>
      )}
    </div>
  );
};

export default BlogPostDetail;
