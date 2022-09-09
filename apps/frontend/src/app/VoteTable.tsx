import { Estimation } from '@estimation-app/types';
import { Card } from './Card';

import { CSSTransitionGroup } from 'react-transition-group';

interface VoteResultsProps {
  estimation: Estimation['estimations'];
  description: Estimation['description'];
  revealed: boolean;
  highlightingDisabled: boolean;
}

export const calculateEstimationAverage = (
  estimation: Estimation['estimations']
): number => {
  const relevantVotes = Object.values(estimation).filter((value) => value > 0);
  const sum = relevantVotes.reduce((prev, current) => {
    return prev + current;
  }, 0);
  return sum / relevantVotes.length;
};

export default ({
  estimation,
  revealed,
  highlightingDisabled,
  description,
}: VoteResultsProps) => {
  const estimationList = Object.entries(estimation).map(([name, value]) => ({
    name,
    value,
  }));
  let average = 0;

  if (revealed === true) {
    average = calculateEstimationAverage(estimation);
  }

  return (
    <div className="w-5/6">
      <div className="flex justify-center md:mt-5">
        <div className="flex flex-col items-center justify-center font-bold text-gray-100 flex-none justify-center font-mono md:text-4xl text-xl">
          {description}
          <div className="md:mt-10 md:mb-10">
            {revealed ? (
              <h1 className="text-pink-400 md:text-4xl text-xl">
                {Number.isNaN(average) === false ? (
                  <>&#8709;{average.toFixed(1)}</>
                ) : (
                  'No valid vote found.'
                )}
              </h1>
            ) : (
              'Vote!'
            )}
          </div>
        </div>
      </div>
      <CSSTransitionGroup
        transitionLeave={true}
        transitionName={{
          enter: 'animate__animated',
          enterActive: 'animate__bounceIn',
          leave: 'animate__animated',
          leaveActive: 'animate__fadeOut',
        }}
        component="div"
        className="flex flex-row justify-center mt-10 space-x-4"
      >
        {estimationList.map((value) => {
          return (
            <div className="flex flex-col items-center">
              <Card
                key={value.name}
                value={value.value}
                revealed={revealed}
                isInput={false}
                isHighlighted={
                  highlightingDisabled === true
                    ? false
                    : value.value !== -1 && revealed === false
                }
              />
              <h3 className="text-white">{value.name}</h3>
            </div>
          );
        })}
      </CSSTransitionGroup>
    </div>
  );
};
