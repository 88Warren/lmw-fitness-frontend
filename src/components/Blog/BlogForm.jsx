import React from 'react';

const BlogForm = ({ isEditMode, newBlogData, handleInputChange, handleFormSubmit, handleBackToList }) => {
  return (
    <div className="bg-white p-6 md:p-8 rounded-lg shadow-xl border-t-4 border-[#ffcf00] animate-fadeIn">
      <h1 className="text-4xl md:text-5xl font-bold text-[#747474] mb-6 font-higherJump leading-tight text-center">
        {isEditMode ? 'Edit Blog Post' : 'Create New Blog Post'}
      </h1>
      <form onSubmit={handleFormSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-lg font-bold text-[#747474] mb-2">Title</label>
          <input type="text" id="title" name="title" value={newBlogData.title} onChange={handleInputChange} className="w-full p-3 border border-[#cecece] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#21fc0d]" placeholder="Enter blog title" required />
        </div>
        <div>
          <label htmlFor="author" className="block text-lg font-bold text-[#747474] mb-2">Author</label>
          <input type="text" id="author" name="author" value={newBlogData.author} onChange={handleInputChange} className="w-full p-3 border border-[#cecece] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#21fc0d]" placeholder="Enter author name" required />
        </div>
        <div>
          <label htmlFor="date" className="block text-lg font-bold text-[#747474] mb-2">Date</label>
          <input type="date" id="date" name="date" value={newBlogData.date} onChange={handleInputChange} className="w-full p-3 border border-[#cecece] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#21fc0d]" required />
        </div>
        <div>
          <label htmlFor="image" className="block text-lg font-bold text-[#747474] mb-2">Image URL</label>
          <input type="url" id="image" name="image" value={newBlogData.image} onChange={handleInputChange} className="w-full p-3 border border-[#cecece] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#21fc0d]" placeholder="e.g., https://placehold.co/600x400" />
        </div>
        <div>
          <label htmlFor="excerpt" className="block text-lg font-bold text-[#747474] mb-2">Excerpt</label>
          <textarea id="excerpt" name="excerpt" rows="3" value={newBlogData.excerpt} onChange={handleInputChange} className="w-full p-3 border border-[#cecece] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#21fc0d]" placeholder="A short summary of the blog post" required></textarea>
        </div>
        <div>
          <label htmlFor="fullContent" className="block text-lg font-bold text-[#747474] mb-2">Full Content (HTML allowed)</label>
          <textarea id="fullContent" name="fullContent" rows="10" value={newBlogData.fullContent} onChange={handleInputChange} className="w-full p-3 border border-[#cecece] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#21fc0d]" placeholder="Write your full blog content here (HTML tags like <p>, <h3>, <ul> are supported)" required></textarea>
        </div>
        <div className="flex justify-end space-x-4 mt-6">
          <button
            type="button"
            onClick={handleBackToList}
            className="px-6 py-3 text-[#747474] font-bold rounded-full border border-[#747474] hover:bg-[#cecece] transition-colors duration-300 shadow-md"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-3 text-white font-bold rounded-full bg-gradient-to-r from-[#21fc0d] via-[#ffcf00] to-[#ff11ff] hover:from-[#ff11ff] hover:to-[#21fc0d] transition-all duration-300 shadow-md"
          >
            {isEditMode ? 'Update Blog Post' : 'Create Blog Post'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BlogForm;
