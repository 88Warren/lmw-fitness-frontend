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
      data-oid="7k0-i39"
    >
      {" "}
      {/* Darker background, hotPink border */}
      <h1
        className="text-4xl md:text-5xl font-bold text-brightYellow mb-6 font-higherJump leading-tight text-center"
        data-oid="83z.bug"
      >
        {isEditMode ? "Edit Blog Post" : "Create New Blog Post"}
      </h1>
      <form
        onSubmit={handleFormSubmit}
        className="space-y-4"
        data-oid="2qqek6-"
      >
        <div data-oid="6o7exgm">
          <label
            htmlFor="title"
            className="block text-lg font-bold text-logoGray mb-2 font-titillium"
            data-oid="-rwceri"
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
            data-oid="qpuhgcp"
          />
        </div>
        <div data-oid="8-lv6.v">
          <label
            htmlFor="date"
            className="block text-lg font-bold text-logoGray mb-2 font-titillium"
            data-oid="ng-wv2s"
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
            data-oid="v.klwpc"
          />
        </div>
        <div data-oid="_.26o1h">
          <label
            htmlFor="image"
            className="block text-lg font-bold text-logoGray mb-2 font-titillium"
            data-oid="zjfziun"
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
            data-oid="fj.lz1f"
          />
        </div>
        <div data-oid="hkeobim">
          <label
            htmlFor="excerpt"
            className="block text-lg font-bold text-logoGray mb-2 font-titillium"
            data-oid="3jk4aom"
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
            data-oid="t94511h"
          ></textarea>
        </div>
        <div
          className="flex items-center space-x-3 bg-gray-700 p-3 rounded-lg border border-gray-600"
          data-oid="jl4du0t"
        >
          <input
            type="checkbox"
            id="isFeatured"
            name="isFeatured"
            checked={newBlogData.isFeatured || false}
            onChange={handleInputChange}
            className="h-5 w-5 text-limeGreen rounded border-gray-600 focus:ring-limeGreen"
            data-oid="_5e0s7s"
          />

          <label
            htmlFor="isFeatured"
            className="text-lg font-bold text-logoGray font-titillium"
            data-oid="nw39id8"
          >
            Feature this post?
          </label>
        </div>
        <div data-oid="37fa5:2">
          <label
            htmlFor="fullContent"
            className="block text-lg font-bold text-logoGray mb-2 font-titillium"
            data-oid="akst1_7"
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
            data-oid="nlmyv51"
          ></textarea>
        </div>
        <div className="flex justify-end space-x-4 mt-6" data-oid="5nwfwvh">
          <button
            type="button"
            onClick={handleBackToList}
            className="btn-primary bg-gray-600 hover:bg-gray-700 text-white" // Custom button styling
            data-oid="v8mzfnb"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-primary" // Custom button styling
            data-oid="l88-cd8"
          >
            {isEditMode ? "Update Blog Post" : "Create Blog Post"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BlogForm;
