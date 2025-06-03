import useAuth from "../../hooks/useAuth";

const BlogPostDetail = ({
  selectedPost,
  handleBackToList,
  handleEditClick,
  handleDelete,
}) => {
  const { isAdmin } = useAuth();

  if (!selectedPost) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto" data-oid="tstb:q3">
      {/* Back Button */}
      <button
        onClick={handleBackToList}
        className="mb-8 inline-flex items-center space-x-2 text-brightYellow hover:text-hotPink transition-colors duration-300 font-titillium font-semibold group"
        data-oid="tnpdw3q"
      >
        <svg
          className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          data-oid="wg0vb.e"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
            data-oid="u-dg6-f"
          />
        </svg>
        <span data-oid="poy9530">Back to all articles</span>
      </button>

      {/* Article Header */}
      <header className="mb-8" data-oid="cp1rjba">
        <div
          className="flex items-center justify-between mb-4"
          data-oid="2oez37j"
        >
          <time className="text-hotPink font-titillium" data-oid="ou..ttj">
            {new Date(selectedPost.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
          {selectedPost.isFeatured && (
            <span
              className="px-3 py-1 bg-limeGreen text-customDarkBackground text-sm font-bold rounded-full"
              data-oid="9y9ns.a"
            >
              Featured Article
            </span>
          )}
        </div>

        <h1
          className="text-4xl md:text-6xl font-higherJump text-brightYellow leading-tight mb-6"
          data-oid="zcv7p4f"
        >
          {selectedPost.title}
        </h1>

        {selectedPost.excerpt && (
          <p
            className="text-xl text-logoGray font-titillium leading-relaxed"
            data-oid="o8rde81"
          >
            {selectedPost.excerpt}
          </p>
        )}
      </header>

      {/* Featured Image */}
      {selectedPost.image && (
        <div
          className="mb-8 rounded-2xl overflow-hidden shadow-2xl"
          data-oid="e65heqd"
        >
          <img
            src={selectedPost.image}
            alt={selectedPost.title}
            className="w-full h-auto object-cover"
            data-oid="u1c44f4"
          />
        </div>
      )}

      {/* Article Content */}
      <article
        className="bg-customGray/30 backdrop-blur-sm rounded-2xl p-8 border border-logoGray/20 mb-8"
        data-oid="0hw9ejs"
      >
        <div
          className="prose prose-lg prose-invert max-w-none
                     prose-headings:text-brightYellow prose-headings:font-higherJump
                     prose-p:text-logoGray prose-p:font-titillium prose-p:leading-relaxed
                     prose-a:text-hotPink prose-a:no-underline hover:prose-a:text-brightYellow
                     prose-strong:text-customWhite
                     prose-ul:text-logoGray prose-ol:text-logoGray
                     prose-blockquote:border-l-brightYellow prose-blockquote:text-customWhite
                     prose-code:text-limeGreen prose-code:bg-customDarkBackground/50"
          dangerouslySetInnerHTML={{ __html: selectedPost.fullContent }}
          data-oid="hs4oujp"
        />
      </article>

      {/* Admin Actions */}
      {isAdmin && (
        <div className="flex justify-end space-x-4 mb-8" data-oid="lvsjm_o">
          <button
            onClick={() => handleEditClick(selectedPost)}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-300 font-titillium font-semibold"
            data-oid="fe9t.yt"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              data-oid=".rvzfxr"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                data-oid="4vxlb7c"
              />
            </svg>
            <span data-oid="jjr-dj3">Edit Post</span>
          </button>
          <button
            onClick={() => handleDelete(selectedPost.ID)}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-300 font-titillium font-semibold"
            data-oid="7oe_91n"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              data-oid="8mn.1st"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                data-oid="xz5v2rq"
              />
            </svg>
            <span data-oid="fi5-.mb">Delete Post</span>
          </button>
        </div>
      )}

      {/* Related Articles or Call to Action could go here */}
      <div
        className="bg-gradient-to-r from-brightYellow/10 to-hotPink/10 rounded-2xl p-8 text-center border border-brightYellow/20"
        data-oid="egywv1r"
      >
        <h3
          className="text-2xl font-higherJump text-brightYellow mb-4"
          data-oid="zyc5x73"
        >
          Enjoyed this article?
        </h3>
        <p className="text-logoGray font-titillium mb-6" data-oid="juhz3iw">
          Subscribe to our newsletter for more fitness insights and exclusive
          content.
        </p>
        <button
          onClick={handleBackToList}
          className="btn-full-colour"
          data-oid="hlkcv21"
        >
          Explore More Articles
        </button>
      </div>
    </div>
  );
};

export default BlogPostDetail;
