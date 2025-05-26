import React from 'react';

const BlogList = ({ actualBlogPosts, loading, error, handleReadMore, handleEditClick, handleDelete, handleCreateNewBlogClick }) => {
  return (
    <>
      <div className="flex justify-center mb-10">
        <button
          onClick={handleCreateNewBlogClick}
          className="px-8 py-4 text-white font-bold rounded-full bg-gradient-to-r from-[#ffcf00] via-[#ff11ff] to-[#21fc0d] hover:from-[#21fc0d] hover:to-[#ffcf00] transition-all duration-300 shadow-lg text-xl font-higherJump"
        >
          + Create New Blog Post
        </button>
      </div>
      <h1 className="text-5xl md:text-6xl font-bold text-white text-center mb-10 font-higherJump leading-tight">
        LMW Fitness Blog
      </h1>
      <p className="text-xl text-white text-center mb-12 max-w-2xl mx-auto">
        Unlock your potential and "Live More With" our insights on holistic fitness, mindful movement, and sustainable well-being.
      </p>

      {actualBlogPosts.length === 0 && !loading && !error && (
        <p className="text-center text-white text-lg">No blog posts found. Be the first to create one!</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {actualBlogPosts.map((post) => (
          <div
            key={post.ID}
            className="bg-white rounded-lg shadow-xl overflow-hidden transform hover:scale-105 transition-all duration-300 border-t-4 border-[#21fc0d]"
          >
            <img src={post.image || 'https://placehold.co/600x400/cecece/747474?text=No+Image'} alt={post.title} className="w-full h-48 object-cover" />
            <div className="p-6">
              <h2 className="text-2xl font-bold text-[#747474] mb-3 font-higherJump leading-snug">
                {post.title}
              </h2>
              <p className="text-sm text-[#ff11ff] mb-4">
                By {post.author} on {post.date}
              </p>
              <p className="text-[#747474] text-base mb-5">
                {post.excerpt}
              </p>
              <button
                onClick={() => handleReadMore(post)}
                className="inline-block px-6 py-3 text-white font-bold rounded-full bg-gradient-to-r from-[#21fc0d] via-[#ffcf00] to-[#ff11ff] hover:from-[#ff11ff] hover:to-[#21fc0d] transition-all duration-300 shadow-md"
              >
                Read More
              </button>
              <div className="mt-4 flex space-x-2">
                <button
                  onClick={() => handleEditClick(post)}
                  className="px-4 py-2 text-white font-bold rounded-full bg-blue-500 text-sm hover:bg-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(post.ID)}
                  className="px-4 py-2 text-white font-bold rounded-full bg-red-500 text-sm hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default BlogList;
