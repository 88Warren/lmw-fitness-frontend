import { BACKEND_URL } from "../../../utils/config";
import { Link } from "react-router-dom";

const AllArticlesGrid = ({
  gridBlogPosts,
  handleEditClick,
  handleDelete,
  isAdmin,
}) => {
  if (gridBlogPosts.length === 0) return null;

  return (
    <section>
      <div className="flex items-center justify-between mb-16">
        <div className="h-px bg-gradient-to-r from-transparent to-customWhite flex-1 mr-6"></div>
        <h2 className="text-3xl font-higherJump text-customWhite text-center tracking-wide">
          <span className="l">L</span>atest Artic<span className="l">l</span>es
        </h2>
        <div className="h-px bg-gradient-to-r from-customWhite to-transparent flex-1 ml-6"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {gridBlogPosts.map((post) => (
          <article
            key={post.ID}
            className="group bg-customGray backdrop-blur-sm rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-logoGray hover:border-brightYellow relative"
          >
            {/* Main clickable area - entire card */}
            <Link
              to={`/blog/${post.ID}`} 
              className="block w-full h-full text-left focus:outline-none focus:ring-2 focus:ring-brightYellow rounded-xl"
              aria-label={`Read article: ${post.title}`}
            >
              <div className="relative overflow-hidden">
                <img
                  src={
                    post.image ||
                    `${BACKEND_URL}/images/LMW_fitness_Hero_Image3.jpg`
                  }
                  alt={post.title}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-titillium text-customWhite font-bold mb-3 line-clamp-2 transition-colors duration-300">
                  {post.title}
                </h3>
                <p className="text-logoGray font-titillium text-xs mb-4 line-clamp-3 leading-relaxed">
                  {post.excerpt}
                </p>

                <div className="flex items-center justify-between">
                  <div className="text-customWhite group-hover:text-xl group-hover:text-brightYellow font-titillium font-semibold transition-colors duration-300 inline-flex items-center space-x-1 mt-6">
                    <span>Read More</span>
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
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>

            {/* Admin controls */}
            {isAdmin && (
              <div className="absolute bottom-4 right-4 flex space-x-2 z-10">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditClick(post);
                  }}
                  className="btn-edit-small"
                  title="Edit post"
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
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(post.ID);
                  }}
                  className="btn-delete-small"
                  title="Delete post"
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
          </article>
        ))}
      </div>
    </section>
  );
};

export default AllArticlesGrid;
