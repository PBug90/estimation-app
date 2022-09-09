import React from 'react';

interface CardProps {
  value: number;
  revealed: boolean;
  isInput: boolean;
  isHighlighted?: boolean;
}

export const Card = ({
  value,
  revealed,
  isInput = false,
  isHighlighted,
}: CardProps) => {
  let shownValue: number | string = value;
  if (value === -1) {
    shownValue = '🛇';
  }
  return (
    <div
      className={
        'card font-mono md:w-36 sm:w-20 w-16 border-white border-2 sm:border-4 md:border-8 ' +
        (revealed === false ? 'flipped ' : ' ') +
        (isInput === true ? 'input ' : ' ') +
        (isHighlighted === true ? 'highlighted ' : ' ')
      }
      style={{ aspectRatio: '3/4' }}
    >
      <div className="card__face card__face--front bg-gray-300 font-black">
        <div className="smalltop">{shownValue}</div>
        <div className="value">{shownValue}</div>
        <div className="smallbot">{shownValue}</div>
      </div>
      <div className="card__face card__face--back flex justify-center items-center bg-gray-400">
        <div className="h-10 w-10 text-3xl text-center">
          <span>&#127922;</span>
        </div>
      </div>
    </div>
  );
};
