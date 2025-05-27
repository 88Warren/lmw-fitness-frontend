const BlogForm = ({ isEditMode, newBlogData, handleInputChange, handleFormSubmit, handleBackToList }) => {
  return (
    <div className="bg-gray-800 p-6 md:p-8 rounded-lg shadow-xl border border-hotPink animate-fadeIn text-white"> {/* Darker background, hotPink border */}
      <h1 className="text-4xl md:text-5xl font-bold text-brightYellow mb-6 font-higherJump leading-tight text-center">
        {isEditMode ? 'Edit Blog Post' : 'Create New Blog Post'}
      </h1>
      <form onSubmit={handleFormSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-lg font-bold text-logoGray mb-2 font-titillium">Title</label>
          <input type="text" id="title" name="title" value={newBlogData.title} onChange={handleInputChange} className="w-full p-3 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-limeGreen bg-gray-700 text-white font-titillium" placeholder="Enter blog title" required />
        </div>
        <div>
          <label htmlFor="author" className="block text-lg font-bold text-logoGray mb-2 font-titillium">Author</label>
          <input type="text" id="author" name="author" value={newBlogData.author} onChange={handleInputChange} className="w-full p-3 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-limeGreen bg-gray-700 text-white font-titillium" placeholder="Enter author name" required />
        </div>
        <div>
          <label htmlFor="date" className="block text-lg font-bold text-logoGray mb-2 font-titillium">Date</label>
          <input type="date" id="date" name="date" value={newBlogData.date} onChange={handleInputChange} className="w-full p-3 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-limeGreen bg-gray-700 text-white font-titillium" required />
        </div>
        <div>
          <label htmlFor="image" className="block text-lg font-bold text-logoGray mb-2 font-titillium">Image URL</label>
          <input type="url" id="image" name="image" value={newBlogData.image} onChange={handleInputChange} className="w-full p-3 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-limeGreen bg-gray-700 text-white font-titillium" placeholder="e.g., https://placehold.co/600x400" />
        </div>
        <div>
          <label htmlFor="excerpt" className="block text-lg font-bold text-logoGray mb-2 font-titillium">Excerpt</label>
          <textarea id="excerpt" name="excerpt" rows="3" value={newBlogData.excerpt} onChange={handleInputChange} className="w-full p-3 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-limeGreen bg-gray-700 text-white font-titillium" placeholder="A short summary of the blog post" required></textarea>
        </div>
        <div>
          <label htmlFor="fullContent" className="block text-lg font-bold text-logoGray mb-2 font-titillium">Full Content (HTML allowed)</label>
          <textarea id="fullContent" name="fullContent" rows="10" value={newBlogData.fullContent} onChange={handleInputChange} className="w-full p-3 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-limeGreen bg-gray-700 text-white font-titillium" placeholder="Write your full blog content here (HTML tags like <p>, <h3>, <ul> are supported)" required></textarea>
        </div>
        <div className="flex justify-end space-x-4 mt-6">
          <button
            type="button"
            onClick={handleBackToList}
            className="btn-primary bg-gray-600 hover:bg-gray-700 text-white" // Custom button styling
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-primary" // Custom button styling
          >
            {isEditMode ? 'Update Blog Post' : 'Create Blog Post'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BlogForm;