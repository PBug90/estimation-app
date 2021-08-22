import React from "react";
import Card from "./Card";

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
    <div>
      {average && <h3>Average: {average}</h3>}
      {Object.entries(roomState).map(([name, value], index) => (
        <Card
          estimation={value}
          highlighted={value > -1 && revealed === false}
          visible={revealed}
        />
      ))}
    </div>
  );
}
