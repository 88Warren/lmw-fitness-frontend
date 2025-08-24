import React from 'react';

const DynamicHeading = ({ text, className }) => {
  const specialLetters = ['l', 'm', 'w'];

  const processedText = text.split('').map((char, index) => {
    if (specialLetters.includes(char.toLowerCase())) {
      let colorClass = '';
      if (char.toLowerCase() === 'l') {
        colorClass = 'text-limeGreen'; 
      } else if (char.toLowerCase() === 'm') {
        colorClass = 'text-brightYellow'; 
      } else if (char.toLowerCase() === 'w') {
        colorClass = 'text-hotPink'; 
      }

      return (
        <span key={index} className={colorClass}>
          {char}
        </span>
      );
    }
    return <span key={index}>{char}</span>;
  });

  return (
    <h2 className={className}>
      {processedText}
    </h2>
  );
};

export default DynamicHeading;