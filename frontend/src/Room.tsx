import React, { useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";
import { useParams } from "react-router-dom";
import Card from "./Card";
import RoomTable from "./RoomTable";

const fibo = [1, 2, 3, 5, 8, 13, 21, 34, 55, 89];

interface RoomProps {
  username: string;
}

function Room({ username }: RoomProps) {
  const [estimations, setEstimations] = useState<Record<string, number>>({});
  const [test, setTest] = useState<number>(0);
  const [isRevealed, setIsRevealed] = useState<boolean>(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const { roomId } = useParams<{ roomId: string }>();

  useEffect(() => {
    setSocket(io(`http://${window.location.hostname}:3000`));

    return () => {
      socket?.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // subscribe to the socket event
  useEffect(() => {
    if (!socket) return;

    socket.on("connect", () => {
      socket.emit("join", { name: username, room: roomId });
    });

    socket.on("estimate", (payload: { name: string; value: number }) => {
      setEstimations((oldEstimations) => ({
        ...oldEstimations,
        [payload.name]: payload.value,
      }));
    });

    socket.on("reveal", () => {
      setIsRevealed(true);
      setTest(-1);
    });

    socket.on("leave", (name: string) => {
      setEstimations((oldEstimations) => {
        delete oldEstimations[name];
        return {
          ...oldEstimations,
        };
      });
    });

    socket.on("join", (name: string) => {
      setEstimations((oldEstimations) => {
        return {
          ...oldEstimations,
          [name]: -1,
        };
      });
    });

    socket.on("reset", () => {
      setEstimations((prev) => {
        const obj: Record<string, number> = {};
        for (const key in prev) {
          obj[key] = -1;
        }
        return obj;
      });
      setIsRevealed(false);
    });

    socket.on("roomstate", (value: Record<string, number>) => {
      setEstimations(value);
    });
  }, [socket, username, roomId]);

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
    socket?.emit("reset");
    return undefined;
  };

  return (
    <div>
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
