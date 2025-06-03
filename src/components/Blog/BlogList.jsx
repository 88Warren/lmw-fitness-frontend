import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { BACKEND_URL } from "../../utils/config";

import fitnessTipsVideo from "../../assets/icons/fitness-tips.mp4";
import nutritionVideo from "../../assets/icons/nutrition.mp4";
import workoutsVideo from "../../assets/icons/workout.mp4";
import mindsetVideo from "../../assets/icons/mindset.mp4";
import recoveryVideo from "../../assets/icons/recovery.mp4";
import motivationVideo from "../../assets/icons/motivation.mp4";

const BlogList = ({
  actualBlogPosts,
  loading,
  error,
  handleReadMore,
  handleEditClick,
  handleDelete,
  handleCreateNewBlogClick,
}) => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  const featuredPosts = actualBlogPosts
    .filter((post) => post.isFeatured)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 3);
  const allSortedPosts = [...actualBlogPosts].sort(
    (a, b) => new Date(b.date) - new Date(a.date),
  );
  const gridBlogPosts = allSortedPosts;

  // Categories with video sources
  const categories = [
    { name: "Fitness Tips", videoSrc: fitnessTipsVideo },
    { name: "Nutrition", videoSrc: nutritionVideo },
    { name: "Workouts", videoSrc: workoutsVideo },
    { name: "Mindset", videoSrc: mindsetVideo },
    { name: "Recovery", videoSrc: recoveryVideo },
    { name: "Motivation", videoSrc: motivationVideo },
  ];

  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    console.log("Newsletter Signup Email:", newsletterEmail);
    alert("Thank you for subscribing!");
    setNewsletterEmail("");
  };

  useEffect(() => {
    if (featuredPosts.length > 1) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % featuredPosts.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [featuredPosts.length]);

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        data-oid="nuv4u9d"
      >
        <div
          className="flex flex-col items-center space-y-4"
          data-oid="p.hyxje"
        >
          <div
            className="animate-spin rounded-full h-12 w-12 border-b-2 border-brightYellow"
            data-oid="m8iexkd"
          ></div>
          <p
            className="text-xl font-titillium text-customWhite"
            data-oid="00xxesu"
          >
            Loading blog posts...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        data-oid="zjp4j1z"
      >
        <div className="text-center" data-oid="rp6dl1g">
          <p
            className="text-xl font-titillium text-hotPink mb-4"
            data-oid="xtm9-i0"
          >
            Error: {error.message}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="btn-full-colour"
            data-oid="3fv1anb"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-customDarkBackground via-customGray to-customDarkBackground text-customWhite"
      data-oid="sj6c04m"
    >
      {/* Hero Section */}
      <div className="relative overflow-hidden" data-oid="7s52eaw">
        <div
          className="absolute inset-0 bg-gradient-to-r from-brightYellow/10 to-hotPink/10"
          data-oid="5l137.w"
        ></div>
        <div
          className="relative max-w-7xl mx-auto px-4 py-16 sm:py-24 text-center"
          data-oid="wq.fj84"
        >
          <h1
            className="text-5xl md:text-7xl font-higherJump leading-tight mb-6 bg-gradient-to-r from-brightYellow via-hotPink to-limeGreen bg-clip-text text-transparent"
            data-oid="elsatnq"
          >
            <span className="block" data-oid="1eudlxg">
              LMW fitness
            </span>
            <span
              className="block text-4xl md:text-5xl mt-2"
              data-oid="pl5i5ok"
            >
              Blog
            </span>
          </h1>
          <p
            className="font-titillium text-xl text-logoGray max-w-3xl mx-auto leading-relaxed"
            data-oid="mgw1cz_"
          >
            Unlock your potential and "Live More With" our insights on holistic
            fitness, mindful movement, and sustainable well-being.
          </p>

          {isAdmin && (
            <div className="mt-8" data-oid="f89b4_n">
              <button
                onClick={handleCreateNewBlogClick}
                className="btn-full-colour inline-flex items-center space-x-2"
                data-oid="5cjzqa1"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  data-oid="bngkvzo"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 4v16m8-8H4"
                    data-oid="2g5-01s"
                  ></path>
                </svg>
                <span data-oid="e._ptb9">Create New Post</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {actualBlogPosts.length === 0 && (
        <div className="text-center py-16" data-oid="z9v5z_5">
          <div className="max-w-md mx-auto" data-oid="npc4ez4">
            <svg
              className="w-16 h-16 text-logoGray mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              data-oid="x:4vlav"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                data-oid="8u.wwnt"
              ></path>
            </svg>
            <h3
              className="text-xl font-higherJump text-customWhite mb-2"
              data-oid="664kyh-"
            >
              No Posts Yet
            </h3>
            <p className="text-logoGray font-titillium" data-oid="i.2v278">
              Be the first to create a blog post and share your fitness journey!
            </p>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12" data-oid="054h-9a">
        <div
          className="grid grid-cols-1 lg:grid-cols-4 gap-8"
          data-oid="bp63fv:"
        >
          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-12" data-oid="_bnvmi2">
            {/* Featured Posts Carousel */}
            {featuredPosts.length > 0 && (
              <section data-oid="8k7e9rs">
                <div
                  className="flex items-center justify-between mb-8"
                  data-oid="99ku5u1"
                >
                  <h2
                    className="text-3xl font-higherJump text-brightYellow tracking-wide"
                    data-oid="7_kl_4n"
                  >
                    Featured Posts
                  </h2>
                  <div
                    className="h-px bg-gradient-to-r from-brightYellow to-transparent flex-1 ml-6"
                    data-oid="x66jr7z"
                  ></div>
                </div>

                <div
                  className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl group"
                  data-oid="0h8j4.6"
                >
                  {featuredPosts.map((post, index) => (
                    <div
                      key={post.ID}
                      className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                        index === currentSlide
                          ? "opacity-100 scale-100"
                          : "opacity-0 scale-105"
                      }`}
                      data-oid="n5vj2c_"
                    >
                      <img
                        src={
                          post.image ||
                          `${BACKEND_URL}/images/LMW_fitness_Hero_Image3.jpg`
                        }
                        alt={post.title}
                        className="w-full h-full object-cover"
                        data-oid="tvxluwe"
                      />

                      <div
                        className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"
                        data-oid="o1ouynj"
                      >
                        <div
                          className="absolute bottom-0 left-0 right-0 p-8"
                          data-oid="g4evl5l"
                        >
                          <div className="max-w-2xl" data-oid="js2h48h">
                            <span
                              className="inline-block px-3 py-1 bg-brightYellow text-customDarkBackground text-sm font-bold rounded-full mb-4"
                              data-oid="1ym0f28"
                            >
                              Featured
                            </span>
                            <h3
                              className="text-3xl md:text-4xl font-higherJump text-white mb-4 leading-tight"
                              data-oid="5mekilf"
                            >
                              {post.title}
                            </h3>
                            <p
                              className="text-lg text-gray-200 mb-6 line-clamp-2 font-titillium"
                              data-oid="a59z12p"
                            >
                              {post.excerpt}
                            </p>
                            <button
                              onClick={() => handleReadMore(post)}
                              className="btn-full-colour inline-flex items-center space-x-2"
                              data-oid="8w-anai"
                            >
                              <span data-oid="y.sje-a">Read Article</span>
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                data-oid="6ttn7ug"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M9 5l7 7-7 7"
                                  data-oid="_14m94o"
                                ></path>
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Navigation Dots */}
                  <div
                    className="absolute bottom-4 right-8 flex space-x-2"
                    data-oid="sryyvfd"
                  >
                    {featuredPosts.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                          index === currentSlide
                            ? "bg-brightYellow scale-125"
                            : "bg-white/50 hover:bg-white/75"
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                        data-oid="nyv:cat"
                      />
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* All Articles Grid */}
            <section data-oid="6nsw-ls">
              <div
                className="flex items-center justify-between mb-8"
                data-oid="4:9:2:3"
              >
                <h2
                  className="text-3xl font-higherJump text-brightYellow tracking-wide"
                  data-oid="9dtolv."
                >
                  Latest Articles
                </h2>
                <div
                  className="h-px bg-gradient-to-r from-brightYellow to-transparent flex-1 ml-6"
                  data-oid=".2b21gj"
                ></div>
              </div>

              <div
                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
                data-oid="q7-by3j"
              >
                {gridBlogPosts.map((post) => (
                  <article
                    key={post.ID}
                    className="group bg-customGray/50 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-logoGray/20 hover:border-brightYellow/50"
                    data-oid="4_t3wkh"
                  >
                    <div
                      className="relative overflow-hidden"
                      data-oid="uzc1qaf"
                    >
                      <img
                        src={
                          post.image ||
                          `${BACKEND_URL}/images/LMW_fitness_Hero_Image3.jpg`
                        }
                        alt={post.title}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                        data-oid="dkow33z"
                      />

                      <div
                        className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        data-oid="a35wd98"
                      ></div>
                    </div>

                    <div className="p-6" data-oid="jfce__q">
                      <div
                        className="flex items-center justify-between mb-3"
                        data-oid="wkt:jud"
                      >
                        <time
                          className="text-sm text-hotPink font-titillium"
                          data-oid="lv8l-h_"
                        >
                          {new Date(post.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </time>
                        {post.isFeatured && (
                          <span
                            className="px-2 py-1 bg-limeGreen text-customDarkBackground text-xs font-bold rounded-full"
                            data-oid="i07s44r"
                          >
                            Featured
                          </span>
                        )}
                      </div>

                      <h3
                        className="text-xl font-higherJump text-customWhite mb-3 line-clamp-2 group-hover:text-brightYellow transition-colors duration-300"
                        data-oid="nq_q6zb"
                      >
                        {post.title}
                      </h3>

                      <p
                        className="text-logoGray font-titillium mb-4 line-clamp-3 leading-relaxed"
                        data-oid="v1_z4y_"
                      >
                        {post.excerpt}
                      </p>

                      <div
                        className="flex items-center justify-between"
                        data-oid=".d8rlf9"
                      >
                        <button
                          onClick={() => handleReadMore(post)}
                          className="text-brightYellow hover:text-hotPink font-titillium font-semibold transition-colors duration-300 inline-flex items-center space-x-1"
                          data-oid="dtxthyl"
                        >
                          <span data-oid="jpaekyy">Read More</span>
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            data-oid="z0:q6_l"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M9 5l7 7-7 7"
                              data-oid="9xpiv6:"
                            ></path>
                          </svg>
                        </button>

                        {isAdmin && (
                          <div className="flex space-x-2" data-oid="3wd25xr">
                            <button
                              onClick={() => handleEditClick(post)}
                              className="p-2 text-blue-400 hover:text-blue-300 transition-colors duration-300"
                              title="Edit post"
                              data-oid="2m5s-rr"
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                data-oid="zh:yoj_"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                  data-oid=":hlq995"
                                ></path>
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDelete(post.ID)}
                              className="p-2 text-red-400 hover:text-red-300 transition-colors duration-300"
                              title="Delete post"
                              data-oid="4vm4b-o"
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                data-oid="6h4ajkg"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                  data-oid="kl2rteo"
                                ></path>
                              </svg>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-8" data-oid="xj98qe-">
            {/* Categories Section */}
            <div
              className="bg-customGray/30 backdrop-blur-sm rounded-xl p-6 border border-logoGray/20"
              data-oid="9ppgjw7"
            >
              <h3
                className="text-xl font-higherJump text-brightYellow mb-6 text-center"
                data-oid="ex-4r63"
              >
                Explore Categories
              </h3>
              <div className="grid grid-cols-2 gap-4" data-oid="3-6bevu">
                {categories.map((category, index) => (
                  <button
                    key={index}
                    className="group flex flex-col items-center p-4 rounded-lg bg-customDarkBackground/50 hover:bg-customDarkBackground/80 transition-all duration-300 border border-logoGray/20 hover:border-brightYellow/50"
                    aria-label={`View ${category.name} articles`}
                    data-oid="d316vzo"
                  >
                    <div
                      className="w-16 h-16 rounded-full overflow-hidden border-2 border-brightYellow/50 group-hover:border-brightYellow transition-colors duration-300 mb-3"
                      data-oid="8mtoy:9"
                    >
                      <video
                        src={category.videoSrc}
                        muted
                        playsInline
                        loop
                        autoPlay
                        className="w-full h-full object-cover"
                        preload="auto"
                        data-oid="5uo58vk"
                      />
                    </div>
                    <span
                      className="text-xs text-customWhite font-titillium text-center leading-tight group-hover:text-brightYellow transition-colors duration-300"
                      data-oid="0ac1c4:"
                    >
                      {category.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Newsletter Section */}
            <div
              className="bg-gradient-to-br from-brightYellow/10 to-hotPink/10 backdrop-blur-sm rounded-xl p-6 border border-brightYellow/20"
              data-oid=":4b6q13"
            >
              <div className="text-center mb-6" data-oid="3ah10ta">
                <h3
                  className="text-xl font-higherJump text-brightYellow mb-2"
                  data-oid="1fl1ekb"
                >
                  Stay Updated
                </h3>
                <p
                  className="text-sm text-logoGray font-titillium"
                  data-oid="zgokmjb"
                >
                  Get the latest fitness tips and exclusive content delivered to
                  your inbox.
                </p>
              </div>

              <form
                onSubmit={handleNewsletterSubmit}
                className="space-y-4"
                data-oid="17836ny"
              >
                <div className="relative" data-oid="e17w-yl">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-customDarkBackground/50 text-white placeholder-logoGray border border-logoGray/30 focus:outline-none focus:ring-2 focus:ring-brightYellow focus:border-transparent font-titillium transition-all duration-300"
                    data-oid=".2o_wcm"
                  />

                  <div
                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                    data-oid="ogi-dhe"
                  >
                    <svg
                      className="w-5 h-5 text-logoGray"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      data-oid="vj5e.n8"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        data-oid="d-ha3mw"
                      ></path>
                    </svg>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-brightYellow to-hotPink text-customDarkBackground font-bold rounded-lg hover:from-hotPink hover:to-brightYellow transition-all duration-300 transform hover:scale-105 font-titillium"
                  data-oid="4z0whyv"
                >
                  Subscribe Now
                </button>
              </form>
            </div>

            {/* Quick Stats or Popular Posts could go here */}
            <div
              className="bg-customGray/30 backdrop-blur-sm rounded-xl p-6 border border-logoGray/20"
              data-oid="oml-coe"
            >
              <h3
                className="text-lg font-higherJump text-brightYellow mb-4 text-center"
                data-oid="f7lvhyh"
              >
                Blog Stats
              </h3>
              <div className="space-y-3" data-oid=":62jnhj">
                <div
                  className="flex justify-between items-center"
                  data-oid="3qbxbl8"
                >
                  <span
                    className="text-logoGray font-titillium text-sm"
                    data-oid="1eco_nz"
                  >
                    Total Posts
                  </span>
                  <span
                    className="text-customWhite font-bold"
                    data-oid="ghadiwm"
                  >
                    {actualBlogPosts.length}
                  </span>
                </div>
                <div
                  className="flex justify-between items-center"
                  data-oid="mco5p6a"
                >
                  <span
                    className="text-logoGray font-titillium text-sm"
                    data-oid="i:pbafx"
                  >
                    Featured
                  </span>
                  <span
                    className="text-customWhite font-bold"
                    data-oid="q9m:nop"
                  >
                    {featuredPosts.length}
                  </span>
                </div>
                <div
                  className="flex justify-between items-center"
                  data-oid="9ssb9p1"
                >
                  <span
                    className="text-logoGray font-titillium text-sm"
                    data-oid="9qmk_28"
                  >
                    Categories
                  </span>
                  <span
                    className="text-customWhite font-bold"
                    data-oid="91ws:vl"
                  >
                    {categories.length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogList;
