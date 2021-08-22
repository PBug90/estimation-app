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
  const [selectedCardValue, setSelectedCardValue] = useState<number>(0);
  const [isRevealed, setIsRevealed] = useState<boolean>(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const { roomId } = useParams<{ roomId: string }>();

  useEffect(() => {
    setSocket(io());

    return () => {
      socket?.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      setSelectedCardValue(-1);
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
      setSelectedCardValue(0);
    });

    socket.on("roomstate", (value: Record<string, number>) => {
      setEstimations(value);
    });
  }, [socket, username, roomId]);

  const handleSelection = (value: number) => {
    if (isRevealed === true) return;
    setSelectedCardValue(value);
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
    <div className="min-h-screen flex flex-col justify-items-stretch bg-gray-50 ">
      <div className="flex bg-gray-900 flex-col">
        <div className="flex flex-row justify-start p-5">
          <button
            className="py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            onClick={() => revealCommand()}
          >
            Reveal
          </button>

          <button
            className="ml-1 py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            onClick={() => resetCommand()}
          >
            Reset
          </button>
        </div>
        <div className="flex flex-row justify-around my-20">
          <RoomTable roomState={estimations} revealed={isRevealed} />
        </div>
      </div>

      <div className="flex flex-row bg-gray-500 justify-evenly p-10">
        {fibo.map((number) => (
          <div className="ml-5">
            <Card
              estimation={number}
              highlighted={selectedCardValue === number}
              visible={true}
              onSelection={handleSelection}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Room;
