import { useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const STATUS_COLORS = {
  completed: { bg: '#dcfce7', border: '#16a34a', text: '#15803d', dot: '#16a34a' },
  partial:   { bg: '#fef9c3', border: '#ca8a04', text: '#a16207', dot: '#ca8a04' },
  missed:    { bg: '#fee2e2', border: '#dc2626', text: '#b91c1c', dot: '#dc2626' },
  rest:      { bg: '#f1f5f9', border: '#cbd5e1', text: '#64748b', dot: '#94a3b8' },
  none:      { bg: '#ffffff', border: '#e2e8f0', text: '#94a3b8', dot: 'transparent' }
};

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

const getLogStatus = (logs, dateStr) => {
  const log = logs?.find(l => l.date === dateStr);
  if (!log) return 'none';
  if (log.workout.status === 'rest' && log.diet.status === 'rest') return 'rest';
  // Pick the "worse" status for combined view
  const priority = { missed: 0, partial: 1, completed: 2, rest: 3 };
  const ws = log.workout.status;
  const ds = log.diet.status;
  if (ws === 'rest') return ds;
  if (ds === 'rest') return ws;
  return priority[ws] <= priority[ds] ? ws : ds;
};

const ProgressCalendar = ({ logs = [], onDayClick, readOnly = false }) => {
  const today = new Date();
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

  const year  = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const nextMonth = () => {
    const next = new Date(year, month + 1, 1);
    if (next <= new Date(today.getFullYear(), today.getMonth(), 1)) setViewDate(next);
  };

  const isCurrentMonth = year === today.getFullYear() && month === today.getMonth();

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  // Stats for this month
  const monthStr = `${year}-${String(month + 1).padStart(2, '0')}`;
  const monthLogs = logs.filter(l => l.date.startsWith(monthStr));
  const completedCount = monthLogs.filter(l => getLogStatus([l], l.date) === 'completed').length;
  const partialCount   = monthLogs.filter(l => getLogStatus([l], l.date) === 'partial').length;
  const missedCount    = monthLogs.filter(l => getLogStatus([l], l.date) === 'missed').length;

  return (
    <div className="progress-calendar">
      {/* Header */}
      <div className="cal-header">
        <button className="cal-nav" onClick={prevMonth}><FaChevronLeft /></button>
        <h3 className="cal-title">{MONTHS[month]} {year}</h3>
        <button className="cal-nav" onClick={nextMonth} disabled={isCurrentMonth}><FaChevronRight /></button>
      </div>

      {/* Month stats */}
      <div className="month-stats">
        <span className="ms-pill completed">{completedCount} Completed</span>
        <span className="ms-pill partial">{partialCount} Partial</span>
        <span className="ms-pill missed">{missedCount} Missed</span>
      </div>

      {/* Day labels */}
      <div className="cal-grid">
        {DAYS.map(d => <div key={d} className="cal-day-label">{d}</div>)}

        {cells.map((day, idx) => {
          if (!day) return <div key={`empty-${idx}`} />;

          const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const cellDate = new Date(year, month, day);
          const isFuture = cellDate > today;
          const isToday  = dateStr === today.toISOString().slice(0, 10);
          const status   = getLogStatus(logs, dateStr);
          const colors   = STATUS_COLORS[status];
          const log      = logs.find(l => l.date === dateStr);

          return (
            <div
              key={dateStr}
              className={`cal-cell ${isFuture ? 'future' : ''} ${isToday ? 'today' : ''} ${!readOnly && !isFuture ? 'clickable' : ''}`}
              style={{ backgroundColor: colors.bg, borderColor: colors.border }}
              onClick={() => !readOnly && !isFuture && onDayClick && onDayClick(dateStr, log)}
              title={status !== 'none' ? `${status.charAt(0).toUpperCase() + status.slice(1)}` : (isFuture ? 'Future' : 'Not logged')}
            >
              <span className="day-num" style={{ color: isToday ? '#0d9488' : colors.text }}>{day}</span>
              {status !== 'none' && <span className="status-dot" style={{ backgroundColor: colors.dot }} />}
              {log?.mood && <span className="mood-icon">{moodEmoji(log.mood)}</span>}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="cal-legend">
        {Object.entries(STATUS_COLORS).filter(([k]) => k !== 'none').map(([status, colors]) => (
          <span key={status} className="legend-item">
            <span className="legend-dot" style={{ backgroundColor: colors.dot }} />
            <span style={{ color: '#64748b', fontSize: '0.8rem' }}>{status.charAt(0).toUpperCase() + status.slice(1)}</span>
          </span>
        ))}
        {!readOnly && <span className="legend-item" style={{ marginLeft: 'auto', color: '#94a3b8', fontSize: '0.78rem' }}>Click a day to log</span>}
      </div>

      <style jsx>{`
        .progress-calendar {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: var(--box-shadow);
        }
        .cal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1rem;
        }
        .cal-title {
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--dark-color);
          margin: 0;
        }
        .cal-nav {
          background: none;
          border: 1px solid var(--gray-300);
          border-radius: 6px;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: var(--gray-600);
          transition: all 0.2s;
        }
        .cal-nav:hover:not(:disabled) { background: var(--gray-100); }
        .cal-nav:disabled { opacity: 0.35; cursor: default; }

        .month-stats {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
          margin-bottom: 1rem;
        }
        .ms-pill {
          padding: 0.2rem 0.75rem;
          border-radius: 999px;
          font-size: 0.78rem;
          font-weight: 600;
        }
        .ms-pill.completed { background: #dcfce7; color: #15803d; }
        .ms-pill.partial   { background: #fef9c3; color: #a16207; }
        .ms-pill.missed    { background: #fee2e2; color: #b91c1c; }

        .cal-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 4px;
        }
        .cal-day-label {
          text-align: center;
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--gray-500);
          padding: 0.25rem 0;
        }
        .cal-cell {
          aspect-ratio: 1;
          border-radius: 8px;
          border: 1.5px solid;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;
          min-height: 44px;
          transition: transform 0.15s, box-shadow 0.15s;
        }
        .cal-cell.clickable { cursor: pointer; }
        .cal-cell.clickable:hover { transform: scale(1.07); box-shadow: 0 4px 12px rgba(0,0,0,0.12); }
        .cal-cell.future { opacity: 0.3; cursor: default; }
        .cal-cell.today { outline: 2.5px solid #0d9488; outline-offset: 1px; }
        .day-num {
          font-size: 0.85rem;
          font-weight: 600;
          line-height: 1;
        }
        .status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          margin-top: 2px;
        }
        .mood-icon {
          font-size: 0.7rem;
          position: absolute;
          top: 2px;
          right: 3px;
        }
        .cal-legend {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
          margin-top: 1rem;
          padding-top: 0.75rem;
          border-top: 1px solid var(--gray-200);
        }
        .legend-item {
          display: flex;
          align-items: center;
          gap: 0.35rem;
        }
        .legend-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          flex-shrink: 0;
        }
      `}</style>
    </div>
  );
};

const moodEmoji = (mood) => {
  const map = { great: '😄', good: '🙂', okay: '😐', tired: '😴', sick: '🤒' };
  return map[mood] || '';
};

export default ProgressCalendar;
