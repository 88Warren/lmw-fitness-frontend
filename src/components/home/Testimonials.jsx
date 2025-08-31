import { HashLink } from "react-router-hash-link";
import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import DynamicHeading from "../Shared/DynamicHeading";

const Testimonials = () => {
  const testimonials = [
    {
      text: "I've tried all sorts of training plans over the years, but with Laura's plan, I can see massive changes in my body shape and my mental state, feeling more positive and knowing that for once I've found a plan that is working. Laura is energetic, fun & committed and has lots of experience with diets and exercise. I highly recommend her to anyone wanting to improve their fitness & lose weight. Thank you Laura, for all your help. This is one plan I will be sticking to!",
      author: "Michelle",
      program: "30-Day Fat Loss Program"
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
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
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
          el.className = el.className.replace('line-clamp-5', '');
          
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
    <section id="Testimonials" className="py-20 px-6 bg-customGray">
      <div className="max-w-5xl mx-auto text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <DynamicHeading
            text="What my clients say..."
            className="text-4xl md:text-5xl font-higherJump text-white mb-12 leading-loose"
          />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="relative"
        >
          <div className="relative w-full h-[450px] md:h-[300px] rounded-2xl overflow-hidden">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 100 }}
                animate={{ 
                  opacity: index === currentSlide ? 1 : 0,
                  x: index === currentSlide ? 0 : 100,
                  display: index === currentSlide ? 'block' : 'none'
                }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 bg-customWhite backdrop-blur-sm p-8 md:p-12 rounded-2xl shadow-2xl"
              >
                <div className="flex flex-col justify-between h-full relative">
                  <span className="absolute -top-4 -left-4 text-6xl md:text-7xl text-limeGreen opacity-50">&ldquo;</span>
                  <div 
                    className={`relative z-10 transition-all duration-300 ${
                      expanded
                        ? "md:max-h-none md:overflow-visible max-h-48 overflow-y-auto overflow-x-hidden pr-2"
                        : "md:max-h-none md:overflow-visible max-h-32 overflow-hidden"
                    }`}
                  >
                    <p
                      ref={(el) => {
                        textRefs.current[index] = el;
                      }}
                     className={`text-md md:text-lg text-customGray leading-relaxed ${
                        expanded ? "" : "md:line-clamp-none line-clamp-5"
                      }`}
                      >
                      {testimonial.text}
                    </p>
                    <span className="absolute -bottom-4 -right-4 text-6xl md:text-7xl text-hotPink opacity-50">&rdquo;</span>
                  </div>

                  {index === currentSlide && isOverflowing && isMobile && (
                    <button
                      onClick={() => setExpanded((prev) => !prev)}
                      className="mt-4 text-brightYellow underline text-sm"
                    >
                      {expanded ? "Show Less" : "Read More"}
                    </button>
                  )}
                  
                  <div className="text-right mt-8">
                    <p className="text-sm md:text-lg text-customGray font-higherJump">
                      <span className="m pr-1">{testimonial.author[0]}</span>
                      {testimonial.author.slice(1)}
                    </p>
                    <p className="text-sm text-customWhite mt-2">{testimonial.program}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Navigation Dots */}
          <div className="absolute bottom-4 right-8 flex space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? "bg-limeGreen scale-125"
                    : "bg-white hover:border-2 border-brightYellow"
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>

          {/* Navigation Arrows */}
          {/* <button
            onClick={() => setCurrentSlide((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-customGray/80 hover:bg-white transition-colors duration-300"
            aria-label="Previous testimonial"
          >
            <svg className="w-4 h-4 text-white hover:text-customGray transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => setCurrentSlide((prev) => (prev + 1) % testimonials.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-customGray/80 hover:bg-white transition-colors duration-300"
            aria-label="Next testimonial"
          >
            <svg className="w-4 h-4 text-white hover:text-customGray" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </button> */}
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <HashLink 
            to="/#Pricing"
            className="btn-primary w-full sm:w-auto"
          >
            Start Your Journey Today
          </HashLink>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;