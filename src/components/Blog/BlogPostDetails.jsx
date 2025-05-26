import React from 'react';

const BlogPostDetail = ({ selectedPost, handleBackToList, handleEditClick, handleDelete }) => {
  if (!selectedPost) {
    return null; // Should not happen if rendered conditionally
  }

  return (
    <div className="bg-white p-6 md:p-8 rounded-lg shadow-xl border-t-4 border-[#ffcf00] animate-fadeIn">
      <button
        onClick={handleBackToList}
        className="mb-6 flex items-center text-[#21fc0d] hover:text-[#ff11ff] transition-colors duration-300 font-bold"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
        </svg>
        Back to all blogs
      </button>
      <h1 className="text-4xl md:text-5xl font-bold text-[#747474] mb-4 font-higherJump leading-tight">{selectedPost.title}</h1>
      <p className="text-sm text-[#ff11ff] mb-6">
        By {selectedPost.author} on {selectedPost.date}
      </p>
      <img src={selectedPost.image || 'https://placehold.co/600x400/cecece/747474?text=No+Image'} alt={selectedPost.title} className="w-full h-auto rounded-lg mb-6 shadow-md" />
      <div className="prose prose-lg max-w-none text-[#747474]" dangerouslySetInnerHTML={{ __html: selectedPost.fullContent }}></div>

      <div className="mt-8 flex justify-end space-x-4">
        <button
          onClick={() => handleEditClick(selectedPost)}
          className="px-6 py-3 text-white font-bold rounded-full bg-blue-500 hover:bg-blue-600 transition-colors duration-300 shadow-md"
        >
          Edit Post
        </button>
        <button
          onClick={() => handleDelete(selectedPost.ID)}
          className="px-6 py-3 text-white font-bold rounded-full bg-red-500 hover:bg-red-600 transition-colors duration-300 shadow-md"
        >
          Delete Post
        </button>
      </div>
    </div>
  );
};

export default BlogPostDetail;
