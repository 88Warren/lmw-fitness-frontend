import useAuth from '../../hooks/useAuth';

const BlogList = ({ actualBlogPosts, loading, error, handleReadMore, handleEditClick, handleDelete, handleCreateNewBlogClick }) => {
  const { isAdmin } = useAuth(); // Get isAdmin status

  // For the "Latest Articles" section, we'll feature the first post
  const featuredPost = actualBlogPosts.length > 0 ? actualBlogPosts[0] : null;
  const otherPosts = actualBlogPosts.slice(1);

  // Dummy categories for now, as backend doesn't provide them
  const categories = [
    'Fitness Tips', 'Nutrition', 'Workouts', 'Mindset', 'Recovery', 'Health', 'Motivation'
  ];

    return (
    <>
      <div className="flex justify-center items-center mt-10">
        <h1 className="text-4xl md:text-6xl text-white font-higherJump leading-tight">
          <span className="l">L</span><span className="m">M</span><span className="w">W</span> <span className="fitness">fitness</span> B<span className="l">l</span>og
        </h1>
      </div>
      <div className="flex justify-center mb-6">
        {isAdmin && ( 
          <button
            onClick={handleCreateNewBlogClick}
            className="btn-primary"
          >
            Create New Blog Post
          </button>
        )}
      </div>
      <p className="text-xl text-white text-center mb-12 max-w-2xl mx-auto">
        Unlock your potential and "Live More With" our insights on holistic fitness, mindful movement, and sustainable well-being.
      </p>

      {actualBlogPosts.length === 0 && !loading && !error && (
        <p className="text-center text-white text-lg">No blog posts found. Be the first to create one!</p>
      )}

      {/* Main Blog Content Area: Latest Articles + Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Latest Articles Section (2/3 width on large screens) */}
        <div className="lg:col-span-2">
          <h2 className="h2-primary text-white mb-6">Latest Articles</h2> {/* Using custom h2-primary */}
          <div className="space-y-8">
            {/* Featured Article */}
            {featuredPost && (
              <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden transform hover:scale-105 transition-all duration-300 border border-limeGreen"> {/* Darker card, limeGreen border */}
                <img src={featuredPost.image || 'https://placehold.co/1200x600/333/EEE?text=Featured+Image'} alt={featuredPost.title} className="w-full h-80 object-cover" />
                <div className="p-8">
                  <h3 className="text-3xl font-bold text-brightYellow mb-3 font-higherJump leading-snug">
                    {featuredPost.title}
                  </h3>
                  <p className="text-sm text-hotPink mb-4">
                    By {featuredPost.author} on {featuredPost.date}
                  </p>
                  <p className="text-logoGray text-lg mb-5">
                    {featuredPost.excerpt}
                  </p>
                  <button
                    onClick={() => handleReadMore(featuredPost)}
                    className="btn-primary" // Custom button styling
                  >
                    Read More
                  </button>
                  {isAdmin && ( // Only show edit/delete if admin
                    <div className="mt-4 flex space-x-2">
                      <button
                        onClick={() => handleEditClick(featuredPost)}
                        className="btn-secondary bg-blue-600 hover:bg-blue-700" // Using btn-secondary
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(featuredPost.ID)}
                        className="btn-secondary bg-red-600 hover:bg-red-700" // Using btn-secondary
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Other Articles (smaller cards) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {otherPosts.map((post) => (
                <div
                  key={post.ID}
                  className="bg-gray-800 rounded-lg shadow-xl overflow-hidden transform hover:scale-105 transition-all duration-300 border border-logoGray" // Darker card, logoGray border
                >
                  <img src={post.image || 'https://placehold.co/600x400/333/EEE?text=No+Image'} alt={post.title} className="w-full h-48 object-cover" />
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-brightYellow mb-3 font-higherJump leading-snug">
                      {post.title}
                    </h3>
                    <p className="text-sm text-hotPink mb-4">
                      By {post.author} on {post.date}
                    </p>
                    <p className="text-logoGray text-base mb-5">
                      {post.excerpt}
                    </p>
                    <button
                      onClick={() => handleReadMore(post)}
                      className="btn-primary text-customGray" // Custom button styling
                    >
                      Read More
                    </button>
                    {isAdmin && ( // Only show edit/delete if admin
                      <div className="mt-4 flex space-x-2">
                        <button
                          onClick={() => handleEditClick(post)}
                          className="btn-secondary bg-blue-600 hover:bg-blue-700"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(post.ID)}
                          className="btn-secondary bg-red-600 hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Categories Section (1/3 width on large screens) */}
        <div className="lg:col-span-1">
          <h2 className="h2-primary text-white mb-6">Categories</h2> {/* Using custom h2-primary */}
          <div className="bg-gray-800 rounded-lg shadow-xl p-6 border border-hotPink"> {/* Darker card, hotPink border */}
            <ul className="space-y-3">
              {categories.map((category, index) => (
                <li key={index}>
                  <a href="#" className="flex items-center text-brightYellow hover:text-limeGreen transition-colors duration-300 font-titillium text-lg">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                    {category}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default BlogList;