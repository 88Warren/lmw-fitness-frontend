import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import DynamicHeading from '../../components/Shared/DynamicHeading';
import { ChevronDown } from '@untitledui/icons';
import { showToast } from '../../utils/toastUtil'; 

const CalorieCalculator = () => {
  const [formData, setFormData] = useState({
    age: '',
    weight: '', 
    height: '', 
    gender: 'female',
    activityLevel: 'sedentary',
    goal: 'maintain'
  });
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [isGenderDropdownOpen, setIsGenderDropdownOpen] = useState(false);
  const [isActivityDropdownOpen, setIsActivityDropdownOpen] = useState(false);
  const [isGoalDropdownOpen, setIsGoalDropdownOpen] = useState(false);

  const genderOptions = ['female', 'male'];
  const activityOptions = [
      { value: 'sedentary', label: 'Sedentary (little or no exercise)' },
      { value: 'light', label: 'Light activity (1-3 days/week)' },
      { value: 'moderately', label: 'Moderately active (3-5 days/week)' },
      { value: 'very', label: 'Very active (6-7 days/week)' },
      { value: 'extra', label: 'Extra active (very hard daily exercise)' },
  ];
  const goalOptions = [
    { value: 'lose', label: 'Lose Weight' },
    { value: 'maintain', label: 'Maintain Weight' },
    { value: 'gain', label: 'Gain Weight' },
  ];

  const handleChange = (name, value) => {
      setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const calculateCalories = () => {
    const { age, weight, height, gender, activityLevel, goal } = formData;
    const ageNum = parseFloat(age);
    const weightNum = parseFloat(weight);
    const heightNum = parseFloat(height);

    if (!ageNum || !weightNum || !heightNum || isNaN(ageNum) || isNaN(weightNum) || isNaN(heightNum)) {
      showToast("error", "Please enter valid numbers for all fields.");
      return;
    }

    if (ageNum < 14 || ageNum > 100) {
      showToast("error", "Age must be between 14 and 100.");
      return;
    }
    if (weightNum < 20 || weightNum > 300) {
      showToast("error", "Weight must be between 20kg and 300kg.");
      return;
    }
    if (heightNum < 50 || heightNum > 250) {
      showToast("error", "Height must be between 50cm and 250cm.");
      return;
    }

    let bmr;
    if (gender === 'male') {
      bmr = 66.5 + (13.75 * weightNum) + (5 * heightNum) - (6.75 * ageNum);
    } else { 
      bmr = 655.1 + (9.563 * weightNum) + (1.85 * heightNum) - (4.676 * ageNum);
    }

    const activityFactors = {
      sedentary: 1.2,
      light: 1.375,
      moderately: 1.55,
      very: 1.725,
      extra: 1.9,
    };

    let totalCalories = bmr * activityFactors[activityLevel];

    if (goal === 'lose') totalCalories -= 500;
    if (goal === 'gain') totalCalories += 500;

    setResult(Math.round(totalCalories));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className="flex flex-col items-center justify-center min-h-screen mb-20 pt-20 bg-gradient-to-b from-customGray/30 to-white"
    >
      <div className="bg-customGray p-8 rounded-lg text-center max-w-sm md:max-w-lg w-full border-brightYellow border-2">
        <DynamicHeading 
          text="Calorie Calculator" 
          className="font-higherJump text-3xl md:text-4xl font-bold text-customWhite mb-8 leading-loose tracking-widest" 
        />
        <button
          onClick={() => navigate(`/profile`)}
          className="btn-primary text-black mt-2 mb-6 hover:scale-105 transition-transform"
        >
          Back to Profile
        </button>
        <div className="space-y-4 text-left text-customWhite">
          {/* Form fields */}
          <div>
            <label className="block mb-2 font-bold text-brightYellow">Gender</label>
            <div className="relative">
                <button
                    type="button"
                    className="w-full px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brightYellow text-left relative flex items-center justify-between bg-gray-700 text-logoGray"
                    onClick={() => setIsGenderDropdownOpen(prev => !prev)}
                >
                    <span className="capitalize">{formData.gender}</span>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <ChevronDown size={18} className="text-logoGray" />
                    </div>
                </button>
                {isGenderDropdownOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        className="absolute z-10 w-full mt-1 bg-white border border-brightYellow rounded-md shadow-lg py-1 max-h-60 overflow-y-auto"
                    >
                        {genderOptions.map((option) => (
                        <button
                            key={option}
                            type="button"
                            onClick={() => {
                            handleChange('gender', option);
                            setIsGenderDropdownOpen(false);
                            }}
                            className="w-full text-left px-3 py-2 cursor-pointer capitalize text-black hover:bg-brightYellow hover:text-customGray transition-colors"
                        >
                            {option}
                        </button>
                        ))}
                    </motion.div>
                )}
            </div>
        </div>
        <div>
            <label className="block mb-2 font-bold text-brightYellow">Age <span className="text-logoGray text-xs">(years)</span></label>
            <input
                type="number"
                name="age"
                value={formData.age}
                onChange={(e) => handleChange("age", e.target.value)}
                placeholder="30"
                min="14"
                max="100"
                step="1"
                className="w-full p-2 rounded bg-gray-700 text-customWhite focus:outline-none focus:ring-2 focus:ring-brightYellow no-spinners"
            />
        </div>
        <div>
            <label className="block mb-2 font-bold text-brightYellow">Weight <span className="text-logoGray text-xs">(kg)</span></label>
            <input
                type="number"
                name="weight"
                value={formData.weight}
                onChange={(e) => handleChange("weight", e.target.value)}
                placeholder="60"
                min="20"
                max="300"
                step="0.1"
                className="w-full p-2 rounded bg-gray-700 text-customWhite focus:outline-none focus:ring-2 focus:ring-brightYellow no-spinners"
            />
        </div>
        <div>
            <label className="block mb-2 font-bold text-brightYellow">Height <span className="text-logoGray text-xs">(cm)</span></label>
            <input
                type="number"
                name="height"
                value={formData.height}
                onChange={(e) => handleChange("height", e.target.value)}
                placeholder="165"
                min="50"
                max="250"
                step="1"
                className="w-full p-2 rounded bg-gray-700 text-customWhite focus:outline-none focus:ring-2 focus:ring-brightYellow no-spinners"
            />
        </div>
        <div>
        <label className="block mb-2 font-bold text-brightYellow">Activity Level</label>
        <div className="relative">
            <button
                type="button"
                className="w-full px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brightYellow text-left relative flex items-center justify-between bg-gray-700 text-logoGray"
                onClick={() => setIsActivityDropdownOpen(prev => !prev)}
            >
            <span>
                {activityOptions.find(opt => opt.value === formData.activityLevel)?.label}
            </span>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <ChevronDown size={18} className="text-gray-400" />
                </div>
            </button>
            {isActivityDropdownOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="absolute z-10 w-full mt-1 bg-white border border-brightYellow rounded-md shadow-lg py-1 max-h-60 overflow-y-auto"
                >
                    {activityOptions.map((option) => (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => {
                            handleChange('activityLevel', option.value);
                            setIsActivityDropdownOpen(false);
                            }}
                            className="w-full text-left px-3 py-2 cursor-pointer text-black hover:bg-brightYellow hover:text-customGray transition-colors"
                        >
                            {option.label}
                        </button>
                    ))}
                </motion.div>
            )}
          </div>
        </div>
        {/* Goal Dropdown */}
          <div>
            <label className="block mb-2 font-bold text-brightYellow">Goal</label>
            <div className="relative">
              <button
                type="button"
                className="w-full px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brightYellow text-left relative flex items-center justify-between bg-gray-700 text-logoGray"
                onClick={() => setIsGoalDropdownOpen(prev => !prev)}
              >
                <span>{goalOptions.find(opt => opt.value === formData.goal)?.label}</span>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <ChevronDown size={18} className="text-gray-400" />
                </div>
              </button>
              {isGoalDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute z-10 w-full mt-1 bg-white border border-brightYellow rounded-md shadow-lg py-1"
                >
                  {goalOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        handleChange('goal', option.value);
                        setIsGoalDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 cursor-pointer text-black hover:bg-brightYellow hover:text-customGray transition-colors"
                    >
                      {option.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </div>
          </div>
    
          
          <button
            onClick={calculateCalories}
            className="w-full btn-full-colour mt-6"
          >
            Calculate Calories
          </button>

          {/* Result display */}
          {result && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="mt-6 p-4 border-2 border-brightYellow rounded-lg text-center"
            >
              <p className="text-xl font-bold text-brightYellow">Your estimated daily calorie intake:</p>
              <p className="text-4xl font-titillium font-bold text-customWhite mt-2">{result} Calories</p>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default CalorieCalculator;