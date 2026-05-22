import { useState, useEffect } from 'react';
import { FaTimes, FaDumbbell, FaUtensils, FaSmile, FaStickyNote, FaSave } from 'react-icons/fa';

const MOOD_OPTIONS = [
  { value: 'great', emoji: '😄', label: 'Great' },
  { value: 'good',  emoji: '🙂', label: 'Good' },
  { value: 'okay',  emoji: '😐', label: 'Okay' },
  { value: 'tired', emoji: '😴', label: 'Tired' },
  { value: 'sick',  emoji: '🤒', label: 'Sick' }
];

const DAY_MAP = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

const computeWorkoutStatus = (exercises) => {
  if (!exercises || exercises.length === 0) return 'rest';
  const done = exercises.filter(e => e.done).length;
  if (done === 0) return 'missed';
  if (done === exercises.length) return 'completed';
  return 'partial';
};

const computeDietStatus = (meals) => {
  const values = Object.values(meals);
  const done = values.filter(Boolean).length;
  if (done === 0) return 'missed';
  if (done === values.length) return 'completed';
  return 'partial';
};

const DailyLogModal = ({ date, existingLog, workoutDayPlan, dietDayPlan, onSave, onClose }) => {
  const dayOfWeek = DAY_MAP[new Date(date + 'T12:00:00').getDay()];

  const initExercises = () => {
    if (existingLog?.workout?.exercises?.length) return existingLog.workout.exercises;
    if (workoutDayPlan?.exercises?.length) {
      return workoutDayPlan.exercises.map(ex => ({ ...ex, done: false }));
    }
    return [];
  };

  const [exercises, setExercises]   = useState(initExercises);
  const [workoutNotes, setWorkoutNotes] = useState(existingLog?.workout?.notes || '');
  const [meals, setMeals]           = useState(existingLog?.diet?.meals || { breakfast: false, lunch: false, dinner: false, snacks: false });
  const [dietNotes, setDietNotes]   = useState(existingLog?.diet?.notes || '');
  const [mood, setMood]             = useState(existingLog?.mood || '');
  const [saving, setSaving]         = useState(false);
  const [isRestDay, setIsRestDay]   = useState(
    existingLog?.workout?.status === 'rest' && existingLog?.diet?.status === 'rest'
  );

  const toggleExercise = (idx) => {
    setExercises(prev => prev.map((ex, i) => i === idx ? { ...ex, done: !ex.done } : ex));
  };

  const toggleMeal = (key) => {
    setMeals(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async () => {
    setSaving(true);
    const workoutStatus = isRestDay ? 'rest' : computeWorkoutStatus(exercises);
    const dietStatus    = isRestDay ? 'rest' : computeDietStatus(meals);

    const payload = {
      date,
      dayOfWeek,
      workout: { status: workoutStatus, exercises: isRestDay ? [] : exercises, notes: workoutNotes },
      diet:    { status: dietStatus, meals: isRestDay ? { breakfast: false, lunch: false, dinner: false, snacks: false } : meals, notes: dietNotes },
      mood
    };

    await onSave(payload);
    setSaving(false);
    onClose();
  };

  const workoutStatus = isRestDay ? 'rest' : computeWorkoutStatus(exercises);
  const dietStatus    = isRestDay ? 'rest' : computeDietStatus(meals);

  const statusBadge = (s) => {
    const map = { completed: { bg: '#dcfce7', color: '#15803d' }, partial: { bg: '#fef9c3', color: '#a16207' }, missed: { bg: '#fee2e2', color: '#b91c1c' }, rest: { bg: '#f1f5f9', color: '#64748b' } };
    const style = map[s] || map.rest;
    return <span style={{ ...style, padding: '0.15rem 0.6rem', borderRadius: '999px', fontSize: '0.78rem', fontWeight: 600 }}>{s.charAt(0).toUpperCase() + s.slice(1)}</span>;
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="log-modal">
        {/* Header */}
        <div className="modal-header">
          <div>
            <h2>Daily Log</h2>
            <p>{new Date(date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          <button className="close-btn" onClick={onClose}><FaTimes /></button>
        </div>

        <div className="modal-body">
          {/* Rest day toggle */}
          <div className="rest-toggle">
            <label className="toggle-label">
              <input type="checkbox" checked={isRestDay} onChange={e => setIsRestDay(e.target.checked)} />
              <span>Mark as Rest Day</span>
            </label>
          </div>

          {!isRestDay && (
            <>
              {/* Workout Section */}
              <div className="log-section">
                <div className="section-head">
                  <FaDumbbell className="section-icon workout" />
                  <h3>Workout</h3>
                  {statusBadge(workoutStatus)}
                </div>

                {exercises.length > 0 ? (
                  <div className="exercises-list">
                    {exercises.map((ex, idx) => (
                      <label key={idx} className={`exercise-item ${ex.done ? 'done' : ''}`}>
                        <input type="checkbox" checked={ex.done} onChange={() => toggleExercise(idx)} />
                        <div className="ex-info">
                          <span className="ex-name">{ex.name}</span>
                          {(ex.sets || ex.reps) && (
                            <span className="ex-meta">{ex.sets && `${ex.sets} sets`}{ex.sets && ex.reps && ' × '}{ex.reps && `${ex.reps} reps`}</span>
                          )}
                        </div>
                        {ex.done && <span className="done-check">✓</span>}
                      </label>
                    ))}
                  </div>
                ) : (
                  <div className="empty-plan">
                    <p>No exercises in the plan for {dayOfWeek}.</p>
                    <div className="status-buttons">
                      {['completed','partial','missed'].map(s => (
                        <button key={s} className={`status-btn ${workoutStatus === s ? 'active-'+s : ''}`}
                          onClick={() => {
                            // Inject a dummy exercise to force the status
                            setExercises([{ name: 'Manual entry', sets: '', reps: '', done: s !== 'missed' }]);
                            if (s === 'partial') setExercises([{ name: 'Manual entry', sets: '', reps: '', done: true }, { name: 'Manual entry 2', sets: '', reps: '', done: false }]);
                          }}>
                          {s.charAt(0).toUpperCase() + s.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                <textarea
                  className="notes-input"
                  placeholder="Workout notes (optional)..."
                  value={workoutNotes}
                  onChange={e => setWorkoutNotes(e.target.value)}
                  rows={2}
                />
              </div>

              {/* Diet Section */}
              <div className="log-section">
                <div className="section-head">
                  <FaUtensils className="section-icon diet" />
                  <h3>Diet</h3>
                  {statusBadge(dietStatus)}
                </div>
                <div className="meals-grid">
                  {[
                    { key: 'breakfast', emoji: '🍳', label: 'Breakfast', detail: dietDayPlan?.breakfast },
                    { key: 'lunch',     emoji: '🍱', label: 'Lunch',     detail: dietDayPlan?.lunch },
                    { key: 'dinner',    emoji: '🍽️', label: 'Dinner',    detail: dietDayPlan?.dinner },
                    { key: 'snacks',    emoji: '🥜', label: 'Snacks',    detail: dietDayPlan?.snacks }
                  ].map(({ key, emoji, label, detail }) => (
                    <label key={key} className={`meal-item ${meals[key] ? 'done' : ''}`}>
                      <input type="checkbox" checked={meals[key]} onChange={() => toggleMeal(key)} />
                      <span className="meal-emoji">{emoji}</span>
                      <div className="meal-info">
                        <span className="meal-label">{label}</span>
                        {detail && <span className="meal-detail">{detail}</span>}
                      </div>
                      {meals[key] && <span className="done-check">✓</span>}
                    </label>
                  ))}
                </div>
                <textarea
                  className="notes-input"
                  placeholder="Diet notes (optional)..."
                  value={dietNotes}
                  onChange={e => setDietNotes(e.target.value)}
                  rows={2}
                />
              </div>
            </>
          )}

          {/* Mood */}
          <div className="log-section">
            <div className="section-head">
              <FaSmile className="section-icon mood" />
              <h3>How are you feeling?</h3>
            </div>
            <div className="mood-row">
              {MOOD_OPTIONS.map(m => (
                <button
                  key={m.value}
                  className={`mood-btn ${mood === m.value ? 'active' : ''}`}
                  onClick={() => setMood(mood === m.value ? '' : m.value)}
                >
                  <span>{m.emoji}</span>
                  <span>{m.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
          <button className="btn-save" onClick={handleSave} disabled={saving}>
            <FaSave /> {saving ? 'Saving…' : 'Save Log'}
          </button>
        </div>
      </div>

      <style jsx>{`
        .modal-overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,0.55);
          display: flex; align-items: center; justify-content: center;
          z-index: 1000; padding: 1rem;
        }
        .log-modal {
          background: white; border-radius: 16px;
          width: 100%; max-width: 540px;
          max-height: 90vh; display: flex; flex-direction: column;
          box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        }
        .modal-header {
          display: flex; justify-content: space-between; align-items: flex-start;
          padding: 1.5rem 1.5rem 1rem;
          border-bottom: 1px solid var(--gray-200);
          background: linear-gradient(135deg, #0d9488, #0f766e);
          border-radius: 16px 16px 0 0; color: white;
        }
        .modal-header h2 { margin: 0; font-size: 1.3rem; }
        .modal-header p  { margin: 0.2rem 0 0; font-size: 0.85rem; opacity: 0.85; }
        .close-btn {
          background: rgba(255,255,255,0.2); border: none; color: white;
          width: 32px; height: 32px; border-radius: 50%;
          cursor: pointer; display: flex; align-items: center; justify-content: center;
          font-size: 1rem; flex-shrink: 0;
        }
        .close-btn:hover { background: rgba(255,255,255,0.3); }
        .modal-body { overflow-y: auto; padding: 1.25rem 1.5rem; flex: 1; }
        .rest-toggle { margin-bottom: 1rem; }
        .toggle-label {
          display: flex; align-items: center; gap: 0.5rem;
          cursor: pointer; font-weight: 500; color: var(--gray-700);
        }
        .toggle-label input { width: 16px; height: 16px; cursor: pointer; }
        .log-section {
          background: var(--gray-100); border-radius: 12px;
          padding: 1.1rem; margin-bottom: 1rem;
        }
        .section-head {
          display: flex; align-items: center; gap: 0.6rem;
          margin-bottom: 0.75rem;
        }
        .section-head h3 { margin: 0; font-size: 1rem; flex: 1; }
        .section-icon { font-size: 1rem; }
        .section-icon.workout { color: #1e40af; }
        .section-icon.diet    { color: #0d9488; }
        .section-icon.mood    { color: #f97316; }
        .exercises-list { display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 0.75rem; }
        .exercise-item {
          display: flex; align-items: center; gap: 0.6rem;
          background: white; padding: 0.6rem 0.75rem; border-radius: 8px;
          cursor: pointer; border: 1.5px solid var(--gray-200); transition: all 0.2s;
        }
        .exercise-item.done { border-color: #16a34a; background: #f0fdf4; }
        .exercise-item input { width: 16px; height: 16px; flex-shrink: 0; cursor: pointer; }
        .ex-info { flex: 1; }
        .ex-name { font-weight: 600; font-size: 0.9rem; display: block; }
        .ex-meta { font-size: 0.78rem; color: var(--gray-500); }
        .done-check { color: #16a34a; font-weight: 700; font-size: 1rem; }
        .meals-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; margin-bottom: 0.75rem; }
        .meal-item {
          display: flex; align-items: center; gap: 0.5rem;
          background: white; padding: 0.6rem 0.75rem; border-radius: 8px;
          cursor: pointer; border: 1.5px solid var(--gray-200); transition: all 0.2s;
        }
        .meal-item.done { border-color: #16a34a; background: #f0fdf4; }
        .meal-item input { width: 15px; height: 15px; flex-shrink: 0; cursor: pointer; }
        .meal-emoji { font-size: 1.2rem; }
        .meal-info { flex: 1; overflow: hidden; }
        .meal-label { font-weight: 600; font-size: 0.88rem; display: block; }
        .meal-detail { font-size: 0.75rem; color: var(--gray-500); display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .notes-input {
          width: 100%; border: 1px solid var(--gray-300); border-radius: 8px;
          padding: 0.5rem 0.75rem; font-size: 0.88rem; resize: vertical;
          font-family: inherit; background: white;
        }
        .notes-input:focus { outline: none; border-color: #0d9488; }
        .mood-row { display: flex; gap: 0.5rem; flex-wrap: wrap; }
        .mood-btn {
          display: flex; flex-direction: column; align-items: center; gap: 0.2rem;
          background: white; border: 1.5px solid var(--gray-200); border-radius: 10px;
          padding: 0.5rem 0.75rem; cursor: pointer; transition: all 0.2s; font-size: 0.8rem;
          font-family: inherit;
        }
        .mood-btn span:first-child { font-size: 1.4rem; }
        .mood-btn:hover  { border-color: #0d9488; background: #f0fdfa; }
        .mood-btn.active { border-color: #0d9488; background: #ccfbf1; }
        .empty-plan { margin-bottom: 0.75rem; }
        .empty-plan p { color: var(--gray-500); font-size: 0.88rem; margin-bottom: 0.5rem; }
        .status-buttons { display: flex; gap: 0.5rem; }
        .status-btn {
          padding: 0.3rem 0.75rem; border-radius: 6px; border: 1.5px solid var(--gray-300);
          cursor: pointer; font-size: 0.82rem; font-weight: 500; background: white;
          font-family: inherit; transition: all 0.2s;
        }
        .status-btn.active-completed { background: #dcfce7; border-color: #16a34a; color: #15803d; }
        .status-btn.active-partial   { background: #fef9c3; border-color: #ca8a04; color: #a16207; }
        .status-btn.active-missed    { background: #fee2e2; border-color: #dc2626; color: #b91c1c; }
        .modal-footer {
          padding: 1rem 1.5rem; border-top: 1px solid var(--gray-200);
          display: flex; justify-content: flex-end; gap: 0.75rem;
        }
        .btn-cancel {
          padding: 0.6rem 1.25rem; border-radius: 8px; border: 1.5px solid var(--gray-300);
          background: white; cursor: pointer; font-size: 0.9rem; font-family: inherit;
        }
        .btn-save {
          display: flex; align-items: center; gap: 0.5rem;
          padding: 0.6rem 1.5rem; border-radius: 8px; border: none;
          background: #0d9488; color: white; cursor: pointer; font-size: 0.9rem;
          font-weight: 600; font-family: inherit; transition: background 0.2s;
        }
        .btn-save:hover:not(:disabled)  { background: #0f766e; }
        .btn-save:disabled { opacity: 0.6; cursor: not-allowed; }
      `}</style>
    </div>
  );
};

export default DailyLogModal;
