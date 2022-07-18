import { useState } from 'react';
import { Card } from './Card';

interface VoteResultsProps {
  onVoteSelected: (value: number) => void;
  selectedVote: number;
  availableVotes: number[];
}

export default ({
  onVoteSelected,
  selectedVote,
  availableVotes,
}: VoteResultsProps) => {
  return (
    <div className="flex flex-row">
      {availableVotes.map((vote) => (
        <div className="ml-1" onClick={() => onVoteSelected(vote)}>
          <Card
            value={vote}
            revealed={true}
            isInput={true}
            isHighlighted={selectedVote === vote}
          />
        </div>
      ))}
    </div>
  );
};
