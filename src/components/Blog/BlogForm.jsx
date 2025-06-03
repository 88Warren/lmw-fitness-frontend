const BlogForm = ({
  isEditMode,
  newBlogData,
  handleInputChange,
  handleFormSubmit,
  handleBackToList,
}) => {
  return (
    <div className="max-w-4xl mx-auto" data-oid="cic8edp">
      {/* Header */}
      <div className="text-center mb-8" data-oid="n6dptge">
        <h1
          className="text-4xl md:text-5xl font-higherJump text-brightYellow leading-tight mb-4"
          data-oid="jlc.:fk"
        >
          {isEditMode ? "Edit Article" : "Create New Article"}
        </h1>
        <p className="text-logoGray font-titillium text-lg" data-oid="mesvam4">
          {isEditMode
            ? "Update your blog post"
            : "Share your fitness insights with the community"}
        </p>
      </div>

      {/* Form */}
      <div
        className="bg-customGray/30 backdrop-blur-sm rounded-2xl p-8 border border-logoGray/20"
        data-oid="cgbkwjb"
      >
        <form
          onSubmit={handleFormSubmit}
          className="space-y-6"
          data-oid="p87fu6e"
        >
          {/* Title */}
          <div data-oid="cdsb765">
            <label
              htmlFor="title"
              className="block text-lg font-semibold text-customWhite mb-3 font-titillium"
              data-oid="0qege7r"
            >
              Article Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={newBlogData.title}
              onChange={handleInputChange}
              className="w-full p-4 border border-logoGray/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-brightYellow focus:border-transparent bg-customDarkBackground/50 text-white font-titillium placeholder-logoGray transition-all duration-300"
              placeholder="Enter an engaging title for your article"
              required
              data-oid="c1kmsxd"
            />
          </div>

          {/* Date and Featured Toggle Row */}
          <div
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            data-oid="91oikh_"
          >
            <div data-oid="jq8sv3h">
              <label
                htmlFor="date"
                className="block text-lg font-semibold text-customWhite mb-3 font-titillium"
                data-oid="xnkbpfm"
              >
                Publication Date *
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={newBlogData.date}
                onChange={handleInputChange}
                className="w-full p-4 border border-logoGray/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-brightYellow focus:border-transparent bg-customDarkBackground/50 text-white font-titillium transition-all duration-300"
                required
                data-oid="w_8sfnc"
              />
            </div>

            <div className="flex items-end" data-oid="tfft:6f">
              <div
                className="flex items-center space-x-3 bg-customDarkBackground/50 p-4 rounded-lg border border-logoGray/30 w-full"
                data-oid="p0k965y"
              >
                <input
                  type="checkbox"
                  id="isFeatured"
                  name="isFeatured"
                  checked={newBlogData.isFeatured || false}
                  onChange={handleInputChange}
                  className="h-5 w-5 text-brightYellow rounded border-logoGray/30 focus:ring-brightYellow bg-customDarkBackground"
                  data-oid=":ody8pf"
                />

                <label
                  htmlFor="isFeatured"
                  className="text-lg font-semibold text-customWhite font-titillium cursor-pointer"
                  data-oid="5xas5lk"
                >
                  Feature this article
                </label>
              </div>
            </div>
          </div>

          {/* Image URL */}
          <div data-oid="kn209:h">
            <label
              htmlFor="image"
              className="block text-lg font-semibold text-customWhite mb-3 font-titillium"
              data-oid="anovvoj"
            >
              Featured Image URL
            </label>
            <input
              type="url"
              id="image"
              name="image"
              value={newBlogData.image}
              onChange={handleInputChange}
              className="w-full p-4 border border-logoGray/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-brightYellow focus:border-transparent bg-customDarkBackground/50 text-white font-titillium placeholder-logoGray transition-all duration-300"
              placeholder="https://example.com/your-image.jpg"
              data-oid="wv4j86e"
            />

            <p
              className="text-sm text-logoGray mt-2 font-titillium"
              data-oid="3w0r:sc"
            >
              Add a compelling image to make your article stand out
            </p>
          </div>

          {/* Excerpt */}
          <div data-oid="z:2nzgn">
            <label
              htmlFor="excerpt"
              className="block text-lg font-semibold text-customWhite mb-3 font-titillium"
              data-oid="8u3jh_7"
            >
              Article Excerpt *
            </label>
            <textarea
              id="excerpt"
              name="excerpt"
              rows="4"
              value={newBlogData.excerpt}
              onChange={handleInputChange}
              className="w-full p-4 border border-logoGray/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-brightYellow focus:border-transparent bg-customDarkBackground/50 text-white font-titillium placeholder-logoGray resize-none transition-all duration-300"
              placeholder="Write a compelling summary that will entice readers to click and read more..."
              required
              data-oid="78g4n8p"
            />

            <p
              className="text-sm text-logoGray mt-2 font-titillium"
              data-oid="jnkc0j7"
            >
              This will appear in the article preview cards (recommended:
              150-200 characters)
            </p>
          </div>

          {/* Full Content */}
          <div data-oid="qjj27s6">
            <label
              htmlFor="fullContent"
              className="block text-lg font-semibold text-customWhite mb-3 font-titillium"
              data-oid="oh95u71"
            >
              Article Content *
            </label>
            <textarea
              id="fullContent"
              name="fullContent"
              rows="15"
              value={newBlogData.fullContent}
              onChange={handleInputChange}
              className="w-full p-4 border border-logoGray/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-brightYellow focus:border-transparent bg-customDarkBackground/50 text-white font-titillium placeholder-logoGray resize-none transition-all duration-300"
              placeholder="Write your full article content here. You can use HTML tags like <p>, <h2>, <h3>, <strong>, <em>, <ul>, <ol>, <li>, <blockquote>, etc."
              required
              data-oid="lbz2cc1"
            />

            <p
              className="text-sm text-logoGray mt-2 font-titillium"
              data-oid="q4:b9f8"
            >
              HTML formatting is supported. Use headings, paragraphs, lists, and
              other HTML elements to structure your content.
            </p>
          </div>

          {/* Action Buttons */}
          <div
            className="flex flex-col sm:flex-row justify-end space-y-4 sm:space-y-0 sm:space-x-4 pt-6 border-t border-logoGray/20"
            data-oid="dez3hpl"
          >
            <button
              type="button"
              onClick={handleBackToList}
              className="px-8 py-3 bg-customDarkBackground/50 hover:bg-customDarkBackground/80 text-logoGray hover:text-customWhite border border-logoGray/30 hover:border-logoGray/50 rounded-lg transition-all duration-300 font-titillium font-semibold"
              data-oid="zsgv3o-"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-full-colour inline-flex items-center justify-center space-x-2"
              data-oid=".tv9l-a"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                data-oid="-nf4p-y"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                  data-oid="gk3qq:-"
                />
              </svg>
              <span data-oid=".v5bcbr">
                {isEditMode ? "Update Article" : "Publish Article"}
              </span>
            </button>
          </div>
        </form>
      </div>

      {/* Help Section */}
      <div
        className="mt-8 bg-gradient-to-r from-brightYellow/10 to-hotPink/10 rounded-xl p-6 border border-brightYellow/20"
        data-oid="0acdz:g"
      >
        <h3
          className="text-lg font-higherJump text-brightYellow mb-3"
          data-oid=".ec4b3j"
        >
          Writing Tips
        </h3>
        <ul
          className="text-sm text-logoGray font-titillium space-y-2"
          data-oid="js-b2y4"
        >
          <li data-oid="0xxw_zd">
            • Use clear, engaging headlines that grab attention
          </li>
          <li data-oid="tr9033a">
            • Write a compelling excerpt that summarizes your main points
          </li>
          <li data-oid="8uco0fl">
            • Structure your content with headings and subheadings
          </li>
          <li data-oid="i-0wi8t">
            • Include actionable tips and practical advice
          </li>
          <li data-oid="_kgn8gx">
            • Add a high-quality featured image to increase engagement
          </li>
        </ul>
      </div>
    </div>
  );
};

export default BlogForm;
