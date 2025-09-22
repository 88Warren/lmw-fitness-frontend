import { useNavigate } from "react-router-dom";
import fitnessTipsVideo from "../../../assets/icons/fitness-tips_reencoded.mp4";
import nutritionVideo from "../../../assets/icons/nutrition_reencoded.mp4";
import workoutsVideo from "../../../assets/icons/workout_reencoded.mp4";
import mindsetVideo from "../../../assets/icons/mindset_reencoded.mp4";
import recoveryVideo from "../../../assets/icons/recovery_reencoded.mp4";
import motivationVideo from "../../../assets/icons/motivation_reencoded.mp4";
import miscellaneousVideo from "../../../assets/icons/applause_reencoded.mp4";

const CategoriesSidebar = () => {
  const navigate = useNavigate();

  const categories = [
    { name: "Fitness Tips", videoSrc: fitnessTipsVideo },
    { name: "Nutrition", videoSrc: nutritionVideo },
    { name: "Workouts", videoSrc: workoutsVideo },
    { name: "Mindset", videoSrc: mindsetVideo },
    { name: "Recovery", videoSrc: recoveryVideo },
    { name: "Motivation", videoSrc: motivationVideo },
    { name: "Miscellaneous", videoSrc: miscellaneousVideo },
  ];

  const handleCategoryClick = (categoryName) => {
    navigate(`/blog?category=${categoryName.replace(/\s+/g, '')}`); 
  };

  return (
    <div className="bg-customGray backdrop-blur-sm rounded-xl p-4 border border-logoGray">
      <h3 className="text-lg font-higherJump text-customWhite mb-4 text-center leading-loose tracking-wide">
        Exp<span className="l">l</span>ore Categories
      </h3>
      
      {/* All Articles Button */}
      <button
        onClick={() => navigate('/blog?category=all')}
        className="w-full mb-2 text-customWhite  hover:text-logoGray font-titillium font-semibold"
      >
        View All Articles
      </button>
      
      <div className="grid grid-cols-2 gap-2">
        {categories.map((category, index) => (
          <button
            key={index}
            onClick={() => handleCategoryClick(category.name)}
            className="group flex flex-col items-center p-2 rounded-lg transition-all duration-300"
            aria-label={`View ${category.name} articles`}
          >
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-transparent group-hover:border-brightYellow transition-all duration-300 mb-3">
              <video
                src={category.videoSrc}
                muted
                playsInline
                loop
                autoPlay
                className="w-full h-full object-cover"
                preload="auto"
              />
            </div>
            <span className="text-xs text-customWhite font-titillium text-center leading-tight group-hover:text-brightYellow transition-colors duration-300">
              {category.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoriesSidebar;
