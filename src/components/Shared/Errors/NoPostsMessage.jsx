import useAuth from '../../../hooks/useAuth';

const NoPostsMessage = ({ handleCreateNewBlogClick }) => {
  const { isAdmin } = useAuth(); 

  return (
    <div className="text-center py-16">
      <div className="max-w-md mx-auto">
        <svg
          className="w-16 h-16 text-logoGray mx-auto mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          ></path>
        </svg>
        <h3 className="text-xl font-higherJump text-customWhite mb-2">
          No Posts Yet
        </h3>
        <p className="text-logoGray font-titillium">
          Be the first to create a blog post and share your fitness journey!
        </p>
        {isAdmin && (
            <div className="mt-8">
                <button
                onClick={handleCreateNewBlogClick}
                className="btn-full-colour inline-flex items-center space-x-2"
                >
                <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 4v16m8-8H4"
                    ></path>
                </svg>
                <span>Create First Post</span>
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default NoPostsMessage;