import React from 'react';

const BrandText = ({ text, className = "" }) => {
  if (typeof text !== 'string') return text;
  
  const parts = text.split(/(JustPeek)/g);
  
  return (
    <span className={className}>
      {parts.map((part, i) =>
        part === 'JustPeek' ? (
          <span key={i}>
            <span className="text-white font-bold">Just</span>
            <span className="text-red-500 font-bold">Peek</span>
          </span>
        ) : (
          <React.Fragment key={i}>{part}</React.Fragment>
        )
      )}
    </span>
  );
};

export default BrandText;
