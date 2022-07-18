import React, { useEffect, useRef, useState } from 'react';
import { Estimation, RoomState, UserRole } from '@estimation-app/types';
import io, { Socket } from 'socket.io-client';
import { useParams } from 'react-router-dom';
import VoteTable from './VoteTable';
import UserVoteInput from './UserVoteInput';
import HistoryModal from './HistoryModal';
import { Header } from './Header';
import ChangeDescriptionModal from './ChangeDescriptionModal';
import { Button } from './Button';
const fibo = [1, 2, 3, 5, 8, 13, 21, 34, 55, 89];

interface RoomProps {
  username: string;
}

function Room({ username }: RoomProps) {
  const [currentEstimation, setCurrentEstimation] = useState<{
    description: string;
    estimations: Record<string, number>;
  }>({ description: '', estimations: {} });
  const [estimationHistory, setEstimationHistory] = useState<Estimation[]>([]);
  const [observers, setObservers] = useState(new Set<string>());
  const [selectedCardValue, setSelectedCardValue] = useState<number>(0);
  const [isRevealed, setIsRevealed] = useState<boolean>(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState<boolean>(false);
  const [isDescriptionEditModalOpen, setIsDescriptionEditModalOpen] =
    useState<boolean>(false);
  const [oldEstimation, setOldEstimation] = useState<Estimation['estimations']>(
    {}
  );
  const [useOldEstimation, setUseOldEstimation] = useState<boolean>(false);
  const role = sessionStorage.getItem('role') || UserRole.DEVELOPER;
  const { roomId } = useParams<{ roomId: string }>();
  const socket = useRef<Socket | null>(null);

  useEffect(() => {
    socket.current = io();
    return () => {
      socket.current?.close();
    };
  }, []);

  useEffect(() => {
    if (!socket.current) return;
    const storedSocket = socket.current;
    storedSocket.on('connect', () => {
      storedSocket.emit('join', { name: username, room: roomId, role });
    });

    storedSocket.on('estimate', (payload: { name: string; value: number }) => {
      setCurrentEstimation((oldEstimation) => ({
        estimations: {
          ...oldEstimation.estimations,
          [payload.name]: payload.value,
        },
        description: oldEstimation.description,
      }));
    });

    storedSocket.on('reveal', (revealedState) => {
      setOldEstimation(revealedState);
      setCurrentEstimation((old) => {
        return {
          estimations: revealedState,
          description: old.description,
        };
      });
      setIsRevealed(true);
      setSelectedCardValue(-1);
    });

    storedSocket.on('leave', (name: string, role: UserRole) => {
      if (role === UserRole.DEVELOPER) {
        setCurrentEstimation((old) => {
          const n = { ...old.estimations };
          delete n[name];
          return { description: old.description, estimations: n };
        });
      } else {
        observers.delete(name);
        setObservers(new Set([...observers]));
      }
    });

    storedSocket.on('join', (name: string, role: UserRole) => {
      if (role === UserRole.DEVELOPER) {
        setCurrentEstimation((old) => {
          return {
            estimations: { ...old.estimations, [name]: -1 },
            description: old.description,
          };
        });
      } else {
        setObservers(new Set([...observers, name]));
      }
    });

    storedSocket.on('description', (newDescription: string) => {
      setCurrentEstimation((old) => {
        return {
          estimations: { ...old.estimations },
          description: newDescription,
        };
      });
    });

    storedSocket.on('reset', () => {
      setSelectedCardValue(-1);
      setUseOldEstimation(true);
      setIsRevealed(false);
      setCurrentEstimation((prev) => {
        const obj: Record<string, number> = {};
        for (const key in prev.estimations) {
          obj[key] = -1;
        }
        return {
          description: prev.description,
          estimations: obj,
        };
      });

      setTimeout(() => setUseOldEstimation(false), 500);
    });

    storedSocket.on('roomstate', (value: RoomState) => {
      setCurrentEstimation(value.currentEstimation);
      setObservers(new Set(value.observers));
      setEstimationHistory(value.estimationHistory);
      setSelectedCardValue(-1);
      setIsRevealed(value.revealed);
    });
  }, [socket, username, roomId]);

  const handleSelection = (value: number) => {
    if (isRevealed === true) return;
    setSelectedCardValue(value);
    socket?.current?.emit('estimate', value);
    return undefined;
  };

  const revealCommand = () => {
    socket?.current?.emit('reveal');
  };

  const resetCommand = () => {
    if (isRevealed) {
      socket?.current?.emit('reset');
    }
  };

  const saveAndResetCommand = () => {
    socket?.current?.emit('saveAndReset');
  };

  const setDescription = (description: string) => {
    socket?.current?.emit('description', description);
  };

  return (
    <>
      <Header>
        {' '}
        <div className="flex flex-row justify-center">
          <Button
            onClick={() => revealCommand()}
            disabled={isRevealed === true}
            title={'Reveal votes'}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
          </Button>

          <Button
            onClick={() => resetCommand()}
            disabled={isRevealed === false}
            title={'Reset votes'}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </Button>

          <Button
            onClick={() => saveAndResetCommand()}
            disabled={isRevealed === false}
            title={'Save votes and start a new vote'}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
              />
            </svg>
          </Button>
          <Button
            onClick={() => setIsHistoryModalOpen(true)}
            title={'Show vote history'}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
          </Button>
          <Button onClick={() => setIsDescriptionEditModalOpen(true)}>
            Edit description
          </Button>
        </div>
      </Header>
      <div className="flex flex-row flex-grow">
        <HistoryModal
          history={estimationHistory}
          onClose={() => setIsHistoryModalOpen(false)}
          open={isHistoryModalOpen}
        />
        <ChangeDescriptionModal
          description={currentEstimation.description}
          onClose={() => setIsDescriptionEditModalOpen(false)}
          open={isDescriptionEditModalOpen}
          onSave={(description) => {
            setDescription(description);
            setIsDescriptionEditModalOpen(false);
          }}
        />
        <div className="flex flex-col flex-grow bg-gray-900 ">
          <div className="flex justify-around my-20">
            {Object.keys(currentEstimation.estimations).length > 0 && (
              <VoteTable
                estimation={
                  useOldEstimation
                    ? oldEstimation
                    : currentEstimation.estimations
                }
                description={currentEstimation.description}
                revealed={isRevealed}
                highlightingDisabled={useOldEstimation}
              />
            )}
            {Object.keys(currentEstimation.estimations).length === 0 && (
              <>
                {' '}
                <div className="text-4xl">👀</div>
                <h1 className="justify-center font-bold text-gray-100 flex-none justify-center font-mono text-4xl">
                  Looks like nobody is here. Share the link to invite developers
                  to this room!
                </h1>
              </>
            )}
          </div>

          {role === UserRole.DEVELOPER && (
            <div
              className="flex flex-row justify-evenly p-10 absolute inset-x-0 bottom-0"
              style={{ borderTop: '2px solid #fafbfc' }}
            >
              <UserVoteInput
                availableVotes={fibo}
                onVoteSelected={handleSelection}
                selectedVote={selectedCardValue}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Room;
