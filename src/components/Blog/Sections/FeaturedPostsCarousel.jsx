import { useState, useEffect } from "react";
import { BACKEND_URL } from "../../../utils/config";

const FeaturedPostsCarousel = ({ featuredPosts, handleReadMore }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (featuredPosts.length > 1) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % featuredPosts.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [featuredPosts.length]);

  if (featuredPosts.length === 0) return null;

  return (
    <section>
      <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl group">
        {featuredPosts.map((post, index) => (
          <div
            key={post.ID}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              index === currentSlide
                ? "opacity-100 scale-100"
                : "opacity-0 scale-105"
            }`}
          >
            <img
              src={
                post.image ||
                `${BACKEND_URL}/images/LMW_fitness_Hero_Image3.jpg`
              }
              alt={post.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <div className="max-w-2xl">
                  <h3 className="text-2xl md:text-3xl font-titillium text-white mb-4 leading-tight font-bold">
                    {post.title}
                  </h3>
                  <p className="text-lg text-gray-200 mb-6 line-clamp-2 font-titillium">
                    {post.excerpt}
                  </p>
                  <button
                    onClick={() => handleReadMore(post)}
                    className="btn-full-colour inline-flex items-center space-x-2"
                  >
                    <span>Read Article</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Navigation Dots */}
        <div className="absolute bottom-4 right-8 flex space-x-2">
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
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedPostsCarousel;
