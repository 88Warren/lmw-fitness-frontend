const BlogForm = ({
  isEditMode,
  newBlogData,
  handleInputChange,
  handleFormSubmit,
  handleBackToList,
}) => {
  return (
    <div
      className="bg-gray-800 p-6 md:p-8 rounded-lg shadow-xl border border-hotPink animate-fadeIn text-white"
      data-oid="hmv21r5"
    >
      {" "}
      {/* Darker background, hotPink border */}
      <h1
        className="text-4xl md:text-5xl font-bold text-brightYellow mb-6 font-higherJump leading-tight text-center"
        data-oid="4-9tt-g"
      >
        {isEditMode ? "Edit Blog Post" : "Create New Blog Post"}
      </h1>
      <form
        onSubmit={handleFormSubmit}
        className="space-y-4"
        data-oid="emenqmw"
      >
        <div data-oid="0je5hzc">
          <label
            htmlFor="title"
            className="block text-lg font-bold text-logoGray mb-2 font-titillium"
            data-oid="0c0d0ro"
          >
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={newBlogData.title}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-limeGreen bg-gray-700 text-white font-titillium"
            placeholder="Enter blog title"
            required
            data-oid="za:wv6v"
          />
        </div>
        <div data-oid=".rdfnvf">
          <label
            htmlFor="date"
            className="block text-lg font-bold text-logoGray mb-2 font-titillium"
            data-oid="w:ajbr4"
          >
            Date
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={newBlogData.date}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-limeGreen bg-gray-700 text-white font-titillium"
            required
            data-oid="v86fli0"
          />
        </div>
        <div data-oid="6q:b:b9">
          <label
            htmlFor="image"
            className="block text-lg font-bold text-logoGray mb-2 font-titillium"
            data-oid="les94m9"
          >
            Image URL
          </label>
          <input
            type="url"
            id="image"
            name="image"
            value={newBlogData.image}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-limeGreen bg-gray-700 text-white font-titillium"
            placeholder="e.g., https://placehold.co/600x400"
            data-oid="z.i14wj"
          />
        </div>
        <div data-oid="l4b7j:l">
          <label
            htmlFor="excerpt"
            className="block text-lg font-bold text-logoGray mb-2 font-titillium"
            data-oid="9u8scpe"
          >
            Excerpt
          </label>
          <textarea
            id="excerpt"
            name="excerpt"
            rows="3"
            value={newBlogData.excerpt}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-limeGreen bg-gray-700 text-white font-titillium"
            placeholder="A short summary of the blog post"
            required
            data-oid="2tdo_5:"
          ></textarea>
        </div>
        <div
          className="flex items-center space-x-3 bg-gray-700 p-3 rounded-lg border border-gray-600"
          data-oid="vx7no1s"
        >
          <input
            type="checkbox"
            id="isFeatured"
            name="isFeatured"
            checked={newBlogData.isFeatured || false}
            onChange={handleInputChange}
            className="h-5 w-5 text-limeGreen rounded border-gray-600 focus:ring-limeGreen"
            data-oid="_8gt6_f"
          />

          <label
            htmlFor="isFeatured"
            className="text-lg font-bold text-logoGray font-titillium"
            data-oid="bxo:zz4"
          >
            Feature this post?
          </label>
        </div>
        <div data-oid="6kdo449">
          <label
            htmlFor="fullContent"
            className="block text-lg font-bold text-logoGray mb-2 font-titillium"
            data-oid="-h7t0bq"
          >
            Full Content (HTML allowed)
          </label>
          <textarea
            id="fullContent"
            name="fullContent"
            rows="10"
            value={newBlogData.fullContent}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-limeGreen bg-gray-700 text-white font-titillium"
            placeholder="Write your full blog content here (HTML tags like <p>, <h3>, <ul> are supported)"
            required
            data-oid="k:iy12:"
          ></textarea>
        </div>
        <div className="flex justify-end space-x-4 mt-6" data-oid=":907khi">
          <button
            type="button"
            onClick={handleBackToList}
            className="btn-primary bg-gray-600 hover:bg-gray-700 text-white" // Custom button styling
            data-oid="d-w_i96"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-primary" // Custom button styling
            data-oid="cdt-pqj"
          >
            {isEditMode ? "Update Blog Post" : "Create Blog Post"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BlogForm;
