import { GameEvent } from '../types';

interface Props {
  events: GameEvent[];
  maxItems?: number;
}

function actionDot(action: string): string {
  if (action === 'complete') return '🟢';
  if (action === 'turnover') return '🔴';
  if (action === 'score') return '⚪';
  return '⚫';
}

function actionLabel(action: string): string {
  if (action === 'complete') return 'Complete';
  if (action === 'turnover') return 'Turnover';
  if (action === 'score') return 'Score';
  return action;
}

export function EventLog({ events, maxItems }: Props) {
  const reversed = [...events].reverse();
  const displayed = maxItems ? reversed.slice(0, maxItems) : reversed;

  if (displayed.length === 0) {
    return <div className="event-log-empty">No events yet</div>;
  }

  return (
    <div className="event-log">
      {displayed.map(e => (
        <div key={e.id} className="event-row">
          <span className="event-dot">{actionDot(e.action)}</span>
          <span className="event-team">{e.team === 'us' ? 'Us' : 'Them'}</span>
          <span className="event-action">{actionLabel(e.action)}</span>
          <span className="event-hold">{e.holdTime.toFixed(1)}s</span>
        </div>
      ))}
    </div>
  );
}
