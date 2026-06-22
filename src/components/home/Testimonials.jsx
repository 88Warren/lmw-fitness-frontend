import { HashLink } from "react-router-hash-link";
import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";

const Testimonials = () => {
  const testimonials = [
    {
      text: "I've tried all sorts of training plans over the years, but with Laura's plan, I can see massive changes in my body shape and my mental state, feeling more positive and knowing that for once I've found a plan that is working. Laura is energetic, fun & committed and has lots of experience with diets and exercise. I highly recommend her to anyone wanting to improve their fitness & lose weight. Thank you Laura, for all your help. This is one plan I will be sticking to!",
      author: "Michelle",
      program: "30-Day Fat Loss Program",
    },
    // {
    //   text: "Laura's personalized approach to fitness has completely transformed my workout routine. Her attention to detail and understanding of my goals has made all the difference. The results I've seen in just a few weeks are incredible!",
    //   author: "Sarah",
    //   program: "Personal Training"
    // },
    // {
    //   text: "Working with Laura has been life-changing. Her expertise in nutrition and exercise has helped me achieve goals I never thought possible. The support and motivation she provides is unmatched!",
    //   author: "James",
    //   program: "Nutrition & Fitness Plan"
    // }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const textRefs = useRef({});

  useEffect(() => {
    if (!expanded) {
      const interval = setInterval(() => {
        setExpanded(false);
        setCurrentSlide((prev) => (prev + 1) % testimonials.length);
      }, 7000);
      return () => clearInterval(interval);
    }
  }, [testimonials.length, expanded]);

  useEffect(() => {
    setExpanded(false);
  }, [currentSlide]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const checkOverflow = () => {
      if (!isMobile) {
        setIsOverflowing(false);
        return;
      }

      const el = textRefs.current[currentSlide];
      if (el) {
        const originalClass = el.className;
        el.className = el.className.replace("line-clamp-5", "");

        const containerHeight = 128;
        const isCurrentlyOverflowing = el.scrollHeight > containerHeight;

        setIsOverflowing(isCurrentlyOverflowing);

        el.className = originalClass;
      } else {
        setIsOverflowing(false);
      }
    };

    const timeoutId = setTimeout(checkOverflow, 50);
    window.addEventListener("resize", checkOverflow);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", checkOverflow);
    };
  }, [currentSlide, expanded, testimonials.length, isMobile]);

  return (
    <section id="Testimonials" className="py-24 px-6 bg-white">
      <div className="max-w-7xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 mb-6 px-5 py-2 rounded-full bg-limeGreen text-black text-sm font-titillium font-bold tracking-widest uppercase shadow-lg shadow-limeGreen/40">
            <span>⭐</span> Client Results
          </span>
          {/* <h2 className="text-4xl md:text-5xl font-titillium text-customGray leading-tight">
            What my clients say...
          </h2> */}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="relative"
        >
          <div className="relative w-full rounded-2xl">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 100 }}
                animate={{
                  opacity: index === currentSlide ? 1 : 0,
                  x: index === currentSlide ? 0 : 100,
                }}
                transition={{ duration: 0.5 }}
                className={`${
                  index === currentSlide ? "block" : "hidden"
                } bg-gray-50 p-8 md:p-12 rounded-2xl border border-gray-100 shadow-sm`}
              >
                <div className="flex flex-col relative">
                  <span className="absolute -top-4 left-0 md:-left-4 text-4xl md:text-6xl lg:text-7xl text-limeGreen opacity-40">
                    &ldquo;
                  </span>

                  <div
                    className={`relative z-10 transition-all duration-300 ${
                      expanded
                        ? "md:max-h-none md:overflow-visible max-h-none overflow-visible"
                        : "md:max-h-none md:overflow-visible max-h-32 overflow-hidden"
                    }`}
                  >
                    <p
                      ref={(el) => {
                        textRefs.current[index] = el;
                      }}
                      className={`text-base md:text-lg text-customGray/80 leading-relaxed font-titillium ${
                        expanded ? "" : "md:line-clamp-none line-clamp-5"
                      }`}
                    >
                      {testimonial.text}
                    </p>
                    <span className="absolute -bottom-4 right-0 md:-right-4 text-4xl md:text-6xl lg:text-7xl text-hotPink opacity-40">
                      &rdquo;
                    </span>
                  </div>

                  {index === currentSlide && isOverflowing && isMobile && (
                    <div className="mt-3 mb-4">
                      <button
                        onClick={() => setExpanded((prev) => !prev)}
                        className="text-brightYellow text-sm font-medium hover:text-limeGreen transition-colors duration-200 bg-transparent border-none p-0 m-0 font-titillium"
                      >
                        {expanded ? "Show Less" : "Read More"}
                      </button>
                    </div>
                  )}

                  <div className="text-right mt-6 pt-6 border-t border-gray-200">
                    <p className="text-sm md:text-base text-customGray font-titillium">
                      <span className="m pr-1">{testimonial.author[0]}</span>
                      {testimonial.author.slice(1)}
                    </p>
                    <p className="text-sm text-customGray/50 mt-1 font-titillium">
                      {testimonial.program}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Navigation Dots */}
          <div className="flex justify-center mt-6 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? "bg-limeGreen scale-125"
                    : "bg-gray-300 hover:bg-brightYellow"
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <HashLink to="/#Pricing" className="btn-primary w-full sm:w-auto">
            Start Your Journey Today
          </HashLink>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;
