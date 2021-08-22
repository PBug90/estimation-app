import React, { useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";
import { useParams, Redirect, useLocation } from "react-router-dom";
import Card from "./Card";
import RoomTable from "./RoomTable";

const fibo = [1, 2, 3, 5, 8, 13, 21, 34, 55, 89];

interface RoomProps {
  username: string;
}

function Room({ username }: RoomProps) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [estimations, setEstimations] = useState<Record<string, number>>({});
  const [test, setTest] = useState<number>(0);
  const [isRevealed, setIsRevealed] = useState<boolean>(false);
  const { roomId } = useParams<{ roomId: string }>();

  useEffect(() => {
    const newSocket = io(`http://${window.location.hostname}:3000`);
    setSocket(newSocket);
    newSocket.on("connect", () => {
      newSocket.emit("join", { name: username, room: roomId });
    });

    newSocket.on("estimate", (payload: { name: string; value: number }) => {
      setEstimations((oldEstimations) => ({
        ...oldEstimations,
        [payload.name]: payload.value,
      }));
    });

    newSocket.on("reveal", () => {
      setIsRevealed(true);
      setTest(-1);
    });

    newSocket.on("leave", (name: string) => {
      setEstimations((oldEstimations) => {
        delete oldEstimations[name];
        return {
          ...oldEstimations,
        };
      });
    });

    newSocket.on("join", (name: string) => {
      setEstimations((oldEstimations) => {
        return {
          ...oldEstimations,
          [name]: -1,
        };
      });
    });

    newSocket.on("reset", () => {
      setEstimations((prev) => {
        const obj: Record<string, number> = {};
        for (const key in prev) {
          console.log(key);
          obj[key] = -1;
        }
        return obj;
      });
      setIsRevealed(false);
    });

    newSocket.on("roomstate", (value: Record<string, number>) => {
      setEstimations(value);
    });

    return () => {
      newSocket.close();
    };
  }, [setSocket]);

  const handleSelection = (value: number) => {
    if (isRevealed === true) return;
    setTest(value);
    socket?.emit("estimate", value);
    return undefined;
  };

  const revealCommand = () => {
    socket?.emit("reveal");
    return undefined;
  };

  const resetCommand = () => {
    console.log(estimations);
    socket?.emit("reset");
    return undefined;
  };

  return (
    <div>
      {JSON.stringify(estimations)}
      <button onClick={() => revealCommand()}>Reveal</button>
      <button onClick={() => resetCommand()}>Reset</button>
      <RoomTable roomState={estimations} revealed={isRevealed} />

      <div className="deck">
        {fibo.map((number) => (
          <Card
            estimation={number}
            highlighted={test === number}
            visible={true}
            onSelection={handleSelection}
          />
        ))}
      </div>
    </div>
  );
}

export default Room;
