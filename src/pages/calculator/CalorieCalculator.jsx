import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronDown } from '@untitledui/icons';
import { showToast } from '../../utils/toastUtil';
import useAnalytics from '../../hooks/useAnalytics';

const CalorieCalculator = () => {
  const [formData, setFormData] = useState({
    age: '',
    weight: '',
    height: '',
    gender: 'female',
    activityLevel: 'sedentary',
    goal: 'maintain',
  });
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const { trackCalculatorUse } = useAnalytics();
  const [isGenderDropdownOpen, setIsGenderDropdownOpen] = useState(false);
  const [isActivityDropdownOpen, setIsActivityDropdownOpen] = useState(false);

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

  const goalMeta = {
    lose: { icon: '📉', colour: 'text-hotPink', desc: 'A 500 kcal daily deficit to support steady fat loss.' },
    maintain: { icon: '⚖️', colour: 'text-brightYellow', desc: 'Calories to maintain your current weight.' },
    gain: { icon: '📈', colour: 'text-limeGreen', desc: 'A 500 kcal daily surplus to support muscle gain.' },
  };

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const calculateCalories = () => {
    const { age, weight, height, gender, activityLevel, goal } = formData;
    const ageNum = parseFloat(age);
    const weightNum = parseFloat(weight);
    const heightNum = parseFloat(height);

    if (!ageNum || !weightNum || !heightNum || isNaN(ageNum) || isNaN(weightNum) || isNaN(heightNum)) {
      showToast('error', 'Please enter valid numbers for all fields.');
      return;
    }
    if (ageNum < 14 || ageNum > 100) { showToast('error', 'Age must be between 14 and 100.'); return; }
    if (weightNum < 20 || weightNum > 300) { showToast('error', 'Weight must be between 20kg and 300kg.'); return; }
    if (heightNum < 50 || heightNum > 250) { showToast('error', 'Height must be between 50cm and 250cm.'); return; }

    let bmr;
    if (gender === 'male') {
      bmr = 66.5 + (13.75 * weightNum) + (5 * heightNum) - (6.75 * ageNum);
    } else {
      bmr = 655.1 + (9.563 * weightNum) + (1.85 * heightNum) - (4.676 * ageNum);
    }

    const activityFactors = { sedentary: 1.2, light: 1.375, moderately: 1.55, very: 1.725, extra: 1.9 };
    let totalCalories = bmr * activityFactors[activityLevel];
    if (goal === 'lose') totalCalories -= 500;
    if (goal === 'gain') totalCalories += 500;

    const finalResult = Math.round(totalCalories);
    setResult(finalResult);
    trackCalculatorUse('calorie_calculator', finalResult);
  };

  // Reusable dropdown component
  const Dropdown = ({ label, value, displayValue, isOpen, onToggle, children }) => (
    <div>
      <label className="block mb-2 text-sm font-titillium font-semibold text-customGray">{label}</label>
      <div className="relative">
        <button
          type="button"
          onClick={onToggle}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-customGray font-titillium text-sm text-left flex items-center justify-between hover:border-brightYellow focus:outline-none focus:ring-2 focus:ring-brightYellow transition-colors duration-200"
        >
          <span>{displayValue}</span>
          <ChevronDown
            size={16}
            className={`text-customGray/40 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg py-1 max-h-60 overflow-y-auto"
          >
            {children}
          </motion.div>
        )}
      </div>
    </div>
  );

  const inputClass = "w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-customGray font-titillium text-sm placeholder-customGray/30 hover:border-brightYellow focus:outline-none focus:ring-2 focus:ring-brightYellow transition-colors duration-200 no-spinners";
  const labelClass = "block mb-2 text-sm font-titillium font-semibold text-customGray";
  const dropdownItemClass = "w-full text-left px-4 py-2.5 text-sm font-titillium text-customGray hover:bg-yellow-50 hover:text-customGray transition-colors duration-150 cursor-pointer";

  return (
    <div className="min-h-screen bg-white pt-32 pb-16 px-4">
      <div className="max-w-lg mx-auto space-y-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <button
            onClick={() => navigate('/profile')}
            className="inline-flex items-center gap-2 text-sm font-titillium font-semibold text-customGray/50 hover:text-customGray transition-colors duration-200 mb-6"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Profile
          </button>

          <div className="text-center">
            <span className="inline-flex items-center gap-2 mb-4 px-5 py-2 rounded-full bg-brightYellow text-black text-sm font-titillium font-bold tracking-widest uppercase shadow-lg shadow-brightYellow/40">
              <span>🥗</span> Calorie Calculator
            </span>
            <h1 className="text-2xl md:text-3xl font-bold text-customGray font-titillium">
              Estimate Your Daily Calories
            </h1>
            <p className="text-sm text-customGray/50 font-titillium mt-2">
              Based on the Mifflin-St Jeor equation
            </p>
          </div>
        </motion.div>

        {/* Form card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8 space-y-5"
        >
          {/* Gender */}
          <Dropdown
            label="Gender"
            isOpen={isGenderDropdownOpen}
            onToggle={() => setIsGenderDropdownOpen(p => !p)}
            displayValue={<span className="capitalize">{formData.gender}</span>}
          >
            {genderOptions.map(opt => (
              <button key={opt} type="button" onClick={() => { handleChange('gender', opt); setIsGenderDropdownOpen(false); }} className={dropdownItemClass}>
                <span className="capitalize">{opt}</span>
              </button>
            ))}
          </Dropdown>

          {/* Age / Weight / Height — 3-column grid on md+ */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>Age <span className="text-customGray/40 font-normal">yrs</span></label>
              <input type="number" name="age" value={formData.age} onChange={e => handleChange('age', e.target.value)} placeholder="30" min="14" max="100" step="1" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Weight <span className="text-customGray/40 font-normal">kg</span></label>
              <input type="number" name="weight" value={formData.weight} onChange={e => handleChange('weight', e.target.value)} placeholder="60" min="20" max="300" step="0.1" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Height <span className="text-customGray/40 font-normal">cm</span></label>
              <input type="number" name="height" value={formData.height} onChange={e => handleChange('height', e.target.value)} placeholder="165" min="50" max="250" step="1" className={inputClass} />
            </div>
          </div>

          {/* Activity Level */}
          <Dropdown
            label="Activity Level"
            isOpen={isActivityDropdownOpen}
            onToggle={() => setIsActivityDropdownOpen(p => !p)}
            displayValue={activityOptions.find(o => o.value === formData.activityLevel)?.label}
          >
            {activityOptions.map(opt => (
              <button key={opt.value} type="button" onClick={() => { handleChange('activityLevel', opt.value); setIsActivityDropdownOpen(false); }} className={dropdownItemClass}>
                {opt.label}
              </button>
            ))}
          </Dropdown>

          {/* Goal */}
          <div>
            <label className={labelClass}>Goal</label>
            <div className="grid grid-cols-3 gap-2">
              {goalOptions.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleChange('goal', opt.value)}
                  className={`py-3 px-2 rounded-xl border-2 text-sm font-titillium font-semibold transition-all duration-200 text-center ${
                    formData.goal === opt.value
                      ? 'border-brightYellow bg-yellow-50 text-customGray'
                      : 'border-gray-100 bg-white text-customGray/60 hover:border-gray-200'
                  }`}
                >
                  <div className="text-lg mb-1">{goalMeta[opt.value].icon}</div>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Calculate button */}
          <button
            onClick={calculateCalories}
            className="w-full py-3.5 bg-brightYellow text-black font-titillium font-bold rounded-xl hover:bg-brightYellow/80 transition-colors duration-200 text-base"
          >
            Calculate Calories
          </button>
        </motion.div>

        {/* Result */}
        {result && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-2xl border-2 border-brightYellow shadow-sm p-6 text-center"
          >
            <p className="text-xs font-titillium font-bold text-brightYellow uppercase tracking-widest mb-3">
              Your estimated daily intake
            </p>
            <p className="text-5xl font-bold text-customGray font-titillium">
              {result.toLocaleString()}
            </p>
            <p className="text-base text-customGray/50 font-titillium mt-1">calories / day</p>

            <div className="mt-5 pt-5 border-t border-gray-100">
              <p className={`text-sm font-titillium font-semibold ${goalMeta[formData.goal].colour} mb-1`}>
                {goalMeta[formData.goal].icon} {goalOptions.find(o => o.value === formData.goal)?.label}
              </p>
              <p className="text-xs text-customGray/50 font-titillium">
                {goalMeta[formData.goal].desc}
              </p>
            </div>
          </motion.div>
        )}

        {/* Disclaimer */}
        <p className="text-xs text-customGray/40 font-titillium text-center pb-4">
          This is an estimate only. Individual needs vary — consult a healthcare professional for personalised advice.
        </p>

      </div>
    </div>
  );
};

export default CalorieCalculator;
