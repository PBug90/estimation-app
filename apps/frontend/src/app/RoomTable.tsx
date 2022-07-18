import React from 'react';
import { Card } from './Card';

interface RoomTableProps {
  roomState: Record<string, number>;
  revealed: boolean;
}

export default function RoomTable(props: RoomTableProps) {
  const { roomState, revealed } = props;
  let average = 0;
  let lowestValue = -1;
  let highestValue = -1;
  if (revealed === true) {
    const relevantEstimations = Object.values(roomState).filter(
      (value) => value > 0
    );
    const sum = relevantEstimations.reduce((prev, current) => {
      if (current > highestValue) {
        highestValue = current;
      }
      if (lowestValue === -1) {
        lowestValue = current;
      } else if (current < lowestValue) {
        lowestValue = current;
      }
      return prev + current;
    }, 0);

    average = sum / relevantEstimations.length;
  }
  return (
    <div className="flex justify-around flex-col">
      <div className="flex flex-row justify-center h-32">
        <div className="flex items-center justify-center font-bold text-gray-700 rounded-full bg-white flex-none w-32 h-32 justify-center font-mono text-4xl">
          <div className="">{revealed ? average.toFixed(1) : 'Vote!'}</div>
        </div>
      </div>
      <div className="flex flex-row justify-center mt-20">
        {Object.entries({ ...roomState }).map(([name, value], index) => (
          <div className="flex flex-col m-10">
            <Card
              value={value}
              isHighlighted={value > -1 && revealed === false}
              revealed={revealed}
              isInput={false}
            />
            <div className="text-center text-gray-300">{name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
