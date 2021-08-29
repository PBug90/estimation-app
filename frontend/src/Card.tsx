import React from 'react';

type CardProps = {
  name?: string;
  estimation: number;
  highlighted: boolean;
  visible: boolean;
  isLowest?: boolean;
  isHighest?: boolean;
  onSelection?: (value: number) => undefined;
};

function Card({
  name,
  estimation,
  onSelection,
  highlighted,
  isLowest,
  isHighest,
  visible,
}: CardProps) {
  return (
    <div
      onClick={(event) => {
        event.preventDefault();
        if (onSelection) {
          onSelection(estimation);
        }
      }}
      className={
        'card ' +
        (visible === false ? ' flipped ' : '') +
        (isLowest === true ? ' lowest ' : '') +
        (isHighest === true ? ' highest ' : '') +
        (highlighted ? ' highlighted ' : '')
      }
    >
      <div className="card__face card__face--front">
        <div className="smalltop">{estimation}</div>
        <div className="value">{estimation}</div>
        <div className="smallbot">{estimation}</div>
      </div>
      <div className="card__face card__face--back"></div>
    </div>
  );
}

export default Card;
