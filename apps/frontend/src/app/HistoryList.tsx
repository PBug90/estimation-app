import { Estimation } from '@estimation-app/types';
import { calculateEstimationAverage } from './VoteTable';

interface HistoryModalProps {
  history: Estimation[];
}

export default function HistoryList({ history }: HistoryModalProps) {
  return (
    <div className="max-h-96 overflow-y-auto">
      {history.map((estimation) => (
        <div className=" mt-8 ">
          <h1 className="text-lg">{estimation.description}</h1>
          <div className="flex flex-row justify-between">
            <ul>
              {Object.entries(estimation.estimations).map(([key, value]) => (
                <li>
                  {key}:{value}
                </li>
              ))}
            </ul>
            <div>
              <h1 className="text-pink-400 text-xl">
                &#8709;{' '}
                {calculateEstimationAverage(estimation.estimations).toFixed(1)}
              </h1>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
