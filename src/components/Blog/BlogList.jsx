import React, { useState, useEffect } from "react"; // Removed useRef, useCallback
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

  // const carouselPosts = actualBlogPosts.slice(0, 3);
  // const gridBlogPosts = actualBlogPosts.slice(3);

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
      // Changed from carouselPosts
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % featuredPosts.length); // Changed from carouselPosts
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [featuredPosts.length]);

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-customDarkBackground"
        data-oid="d4r-ef-"
      >
        <p
          className="text-xl font-titillium text-customWhite"
          data-oid="txa.bu8"
        >
          Loading blog posts...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-customDarkBackground"
        data-oid="whlp6i:"
      >
        <p className="text-xl font-titillium text-hotPink" data-oid="5:dnyn:">
          Error: {error.message}
        </p>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-customDarkBackground text-customWhite py-10 px-4"
      data-oid="kh3o-ry"
    >
      {/* Title and Intro */}
      <div
        className="flex flex-col items-center justify-center mt-10 mb-8 text-center"
        data-oid="qeoy1v0"
      >
        <h1
          className="text-4xl md:text-6xl text-white font-higherJump leading-tight mb-4"
          data-oid="v5kou3:"
        >
          <span className="l" data-oid="02-gcl1">
            L
          </span>
          <span className="m" data-oid="3298cpw">
            M
          </span>
          <span className="w" data-oid="mr5gg.9">
            W
          </span>{" "}
          <span className="fitness" data-oid="84lfiex">
            fitness
          </span>{" "}
          B
          <span className="l" data-oid="g538wz4">
            l
          </span>
          og
        </h1>
      </div>
      <p
        className="font-titillium text-xl text-white text-center mb-12 max-w-2xl mx-auto"
        data-oid="r.exi::"
      >
        Unlock your potential and "Live More With" our insights on holistic
        fitness, mindful movement, and sustainable well-being.
      </p>

      {isAdmin && (
        <div className="flex justify-center mb-8" data-oid=":l.aqjd">
          <button
            onClick={handleCreateNewBlogClick}
            className="btn-primary bg-limeGreen text-customDarkBackground hover:bg-brightYellow hover:text-customGray transition-all duration-300 px-8 py-3 rounded-md font-bold text-lg"
            data-oid="i6-0ttd"
          >
            Create New Blog Post
          </button>
        </div>
      )}

      {actualBlogPosts.length === 0 && (
        <p
          className="text-center text-customWhite text-lg mt-10"
          data-oid="km0mlwi"
        >
          No blog posts found. Be the first to create one!
        </p>
      )}

      {/* Main Blog Content Area: Latest Articles + Categories */}
      <div
        className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12 max-w-7xl mx-auto"
        data-oid="m2uul_d"
      >
        {/* Left Section: Carousel and Random Grid */}
        <div className="lg:col-span-2" data-oid="c.1246_">
          <h2
            className="h2-primary text-customWhite my-8 font-higherJump text-3xl tracking-widest"
            data-oid="-pbnc56"
          >
            Featured Reads
          </h2>
          <div
            className="relative w-full h-96 bg-gray-900 rounded-lg overflow-hidden shadow-xl border border-brightYellow mb-12 group"
            data-oid="fpj_a3c"
          >
            {featuredPosts.length > 0 ? (
              featuredPosts.map((post, index) => (
                <div
                  key={post.ID}
                  className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${index === currentSlide ? "opacity-100" : "opacity-0"}`}
                  style={{
                    backgroundImage: `url(${post.image || `${BACKEND_URL}/images/LMW_fitness_Hero_Image3.jpg`})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                  data-oid="8d0kzmr"
                >
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-8"
                    data-oid="mtts78x"
                  >
                    <h3
                      className="text-2xl text-customWhite mb-3 font-higherJump leading-tight tracking-wider"
                      data-oid="c75c8-_"
                    >
                      {post.title}
                    </h3>
                    <p
                      className="text-m text-customWhite line-clamp-2 font-titillium"
                      data-oid="yjjnoqt"
                    >
                      {post.excerpt}
                    </p>
                    <button
                      onClick={() => handleReadMore(post)}
                      className="btn-full-colour max-w-1/4"
                      data-oid="u4a7z6m"
                    >
                      Read More
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div
                className="flex items-center justify-center h-full text-lg text-logoGray"
                data-oid="e.b0_l4"
              >
                No featured posts available.
              </div>
            )}
            {/* Carousel navigation dots */}
            <div
              className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-20"
              data-oid=":p82t0c"
            >
              {featuredPosts.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-colors duration-300 ${index === currentSlide ? "bg-white" : "bg-gray-400"}`}
                  aria-label={`Go to slide ${index + 1}`}
                  data-oid="5pvdm98"
                ></button>
              ))}
            </div>
          </div>

          <h2
            className="h2-primary text-customWhite mb-6 font-higherJump text-2xl tracking-wider"
            data-oid="q-4p.h6"
          >
            <span className="m" data-oid="4g851sj">
              M
            </span>
            ore Artic
            <span className="l" data-oid="9r7q.4s">
              l
            </span>
            es
          </h2>
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr"
            data-oid="tp9.9sv"
          >
            {gridBlogPosts.map((post, index) => {
              const sizeClasses =
                index % 5 === 0
                  ? "md:col-span-2 md:row-span-2"
                  : index % 3 === 0
                    ? "md:col-span-2"
                    : "";

              return (
                <div
                  key={post.ID}
                  className={`bg-gray-800 rounded-lg shadow-xl overflow-hidden transform hover:scale-105 transition-all duration-300 border border-logoGray ${sizeClasses}`}
                  data-oid="tna48p5"
                >
                  <img
                    src={
                      post.image ||
                      `${BACKEND_URL}/images/LMW_fitness_Hero_Image3.jpg`
                    }
                    alt={post.title}
                    className="w-full h-48 object-cover"
                    data-oid="4ydu1cv"
                  />
                  <div className="p-6" data-oid=":m:y47d">
                    <h3
                      className="text-xl font-bold text-brightYellow mb-3 font-higherJump leading-snug line-clamp-2"
                      data-oid="a.jin76"
                    >
                      {post.title}
                    </h3>
                    <p className="text-sm text-hotPink mb-4" data-oid="s67ax2z">
                      {post.date}
                    </p>
                    <p
                      className="text-logoGray text-base mb-5 line-clamp-3"
                      data-oid="3h0ntay"
                    >
                      {post.excerpt}
                    </p>
                    <button
                      onClick={() => handleReadMore(post)}
                      className="btn-primary w-fit bg-hotPink text-customWhite hover:bg-brightYellow hover:text-customGray transition-all duration-300 px-4 py-2 rounded-md font-bold"
                      data-oid="ud9b9my"
                    >
                      Read More
                    </button>
                    {isAdmin && (
                      <div className="mt-4 flex space-x-2" data-oid="a4gyaxm">
                        <button
                          onClick={() => handleEditClick(post)}
                          className="btn-secondary bg-blue-600 text-customWhite hover:bg-blue-700 transition-colors duration-300 px-4 py-2 rounded-md text-sm"
                          data-oid="d4a5euh"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(post.ID)}
                          className="btn-secondary bg-red-600 text-customWhite hover:bg-red-700 transition-colors duration-300 px-4 py-2 rounded-md text-sm"
                          data-oid="z_ojhmv"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Section: Categories + Newsletter */}
        <div className="lg:col-span-1" data-oid="_s05:ge">
          {/* Categories Section */}
          <h2
            className="h2-primary text-customWhite text-center mt-8 mb-10 font-higherJump text-3xl tracking-widest"
            data-oid="54jw36g"
          >
            Categories
          </h2>
          <div
            className="grid grid-cols-3 gap-4 justify-items-center"
            data-oid="mkob6.i"
          >
            {categories.map((category, index) => (
              <div
                key={index}
                className="relative group flex flex-col items-center"
                data-oid="zbww37h"
              >
                <button
                  className="w-20 h-20 rounded-full flex items-center justify-center mb-2 transform transition-all duration-300 hover:scale-110 overflow-hidden border-4 border-brightYellow focus:outline-none"
                  aria-label={`View ${category.name} articles`}
                  // Removed onMouseEnter, onMouseLeave, onClick handlers
                  data-oid="wnslx5x"
                >
                  <video
                    // Removed ref={el => setVideoRef(el, index)}
                    src={category.videoSrc}
                    muted
                    playsInline
                    loop // Added loop back
                    autoPlay // Added autoPlay back
                    className="w-full h-full object-cover rounded-full"
                    preload="auto"
                    // Removed onLoadedData, onCanPlayThrough, onError, onPlay, onPause, onEnded
                    data-oid="p18donl"
                  />
                  {/* Removed all debug indicators and play/pause overlays */}
                </button>
                <span
                  className="text-xs text-customWhite text-center font-titillium leading-tight px-1"
                  data-oid="b7_5d-w"
                >
                  {category.name}
                </span>
                {/* Removed debug info and tooltip span */}
              </div>
            ))}
          </div>

          {/* Newsletter Sign-up */}
          <h2
            className="h2-primary text-center text-customWhite my-12 font-higherJump text-2xl tracking-wider"
            data-oid="-6nxkw2"
          >
            Stay Updated!
          </h2>
          <div
            className="bg-gray-800 rounded-lg shadow-xl p-6 border border-limeGreen"
            data-oid="cgkrkw1"
          >
            <p
              className="text-logoGray mb-4 text-center font-titillium"
              data-oid="kr7ymyk"
            >
              Subscribe to our newsletter for the latest fitness tips and
              exclusive content.
            </p>
            <form
              onSubmit={handleNewsletterSubmit}
              className="flex flex-col space-y-4"
              data-oid="jj317k0"
            >
              <input
                type="email"
                placeholder="Your email address"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-md bg-gray-700 text-white placeholder-gray-500
                           focus:outline-none focus:ring-2 focus:ring-brightYellow focus:border-transparent font-titillium"
                data-oid="6y5swbc"
              />

              <button
                type="submit"
                className="w-full py-3 bg-brightYellow text-customGray font-bold rounded-md
                           hover:bg-hotPink hover:text-customWhite transition-all duration-300 transform hover:scale-105"
                data-oid="5tvw54a"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogList;
