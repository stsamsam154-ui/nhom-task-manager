import { memo } from 'react';
import { useDroppable } from '@dnd-kit/core';
import TaskCard from './TaskCard';

function Column({ col, tasks, isNearDeadline, onDelete, onStatusChange, onSelect, onToggleImportant, isDark, isDragging }) {
  const { setNodeRef, isOver } = useDroppable({ id: col.id });
  const theme = isDark ? col.dark : col.light;

  return (
    <div
      ref={setNodeRef}
      style={{
        position: 'relative',
        background: isOver
          ? (isDark ? 'rgba(30,41,59,0.92)' : '#eef2ff')
          : (isDark ? 'rgba(15,23,42,0.86)' : '#f8fafc'),
        borderRadius: '12px',
        padding: '14px',
        paddingTop: '14px',
        minHeight: '400px',
        transition: isDragging
          ? 'border-color 120ms ease, background-color 120ms ease'
          : 'background-color 220ms ease, border-color 220ms ease, box-shadow 220ms ease',
        border: `1px solid ${isOver ? theme.accent : (isDark ? 'rgba(148,163,184,0.18)' : '#dbe4ef')}`,
        boxShadow: isOver
          ? (isDragging ? `0 0 0 1px ${theme.accent}35` : `0 8px 20px rgba(15,23,42,0.08)`)
          : (isDragging ? 'none' : '0 1px 2px rgba(15,23,42,0.05)'),
        overflow: 'hidden',
        contain: 'layout paint',
      }}>

      {/* Column Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', paddingBottom: '8px', borderBottom: `1px solid ${isDark ? 'rgba(148,163,184,0.15)' : '#e2e8f0'}`, position: 'relative', zIndex: 10 }}>
        <span style={{ fontWeight: '800', fontSize: '14px', color: isDark ? '#e2e8f0' : '#1e293b' }}>{col.label}</span>
        <span style={{
          background: isDark ? 'rgba(51,65,85,0.72)' : '#e2e8f0',
          color: isDark ? '#e2e8f0' : '#475569',
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
