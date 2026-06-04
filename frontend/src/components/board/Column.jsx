import { memo } from 'react';
import { useDroppable } from '@dnd-kit/core';
import TaskCard from './TaskCard';

function Column({ col, tasks, isNearDeadline, onDelete, onStatusChange, onSelect, onToggleImportant, isDark, isDragging }) {
  const { setNodeRef, isOver } = useDroppable({ id: col.id });
  const theme = isDark ? col.dark : col.light;
  const columnTint = isDark
    ? `linear-gradient(135deg, ${theme.accent}28, rgba(15,23,42,0.18))`
    : `linear-gradient(135deg, ${theme.accent}24, rgba(255,255,255,0.82))`;

  return (
    <div
      ref={setNodeRef}
      style={{
        position: 'relative',
        background: isOver
          ? (isDark ? 'rgba(30,41,59,0.96)' : '#eef2ff')
          : (isDark ? 'rgba(15,23,42,0.9)' : 'rgba(255,255,255,0.9)'),
        borderRadius: '16px',
        padding: '14px',
        paddingTop: '12px',
        minHeight: '400px',
        transition: isDragging
          ? 'border-color 120ms ease, background-color 120ms ease'
          : 'background-color 220ms ease, border-color 220ms ease, box-shadow 220ms ease',
        border: `1px solid ${isOver ? theme.accent : (isDark ? 'rgba(148,163,184,0.18)' : 'rgba(203,213,225,0.9)')}`,
        borderTop: `4px solid ${theme.accent}`,
        boxShadow: isOver
          ? `0 0 0 2px ${theme.accent}55, 0 16px 34px rgba(15,23,42,0.12)`
          : (isDark ? '0 10px 24px rgba(0,0,0,0.14)' : '0 10px 24px rgba(15,23,42,0.06)'),
        overflow: 'hidden',
        contain: 'layout paint',
      }}>

      {/* Column Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '12px',
        padding: '9px 10px',
        borderRadius: '12px',
        background: columnTint,
        border: `1px solid ${theme.accent}30`,
        position: 'relative',
        zIndex: 10,
      }}>
        <span style={{ fontWeight: '800', fontSize: '14px', color: isDark ? '#e2e8f0' : '#1e293b' }}>{col.label}</span>
        <span style={{
          background: isDark ? 'rgba(15,23,42,0.72)' : 'rgba(255,255,255,0.88)',
          color: isDark ? '#e2e8f0' : theme.text,
          border: `1px solid ${theme.accent}28`,
          borderRadius: '99px',
          padding: '2px 10px',
          fontSize: '12px',
          fontWeight: '700',
        }}>{tasks.length}</span>
      </div>

      {/* Tasks */}
      <div style={{ position: 'relative', zIndex: 10 }}>
        {tasks.map(task => (
          <TaskCard
            key={task.id}
            task={task}
            col={col}
            isNearDeadline={isNearDeadline}
            onDelete={onDelete}
            onStatusChange={onStatusChange}
            onSelect={onSelect}
            onToggleImportant={onToggleImportant}
            isDark={isDark}
            isBoardDragging={isDragging}
          />
        ))}
      </div>
    </div>
  );
}

export default memo(Column);
