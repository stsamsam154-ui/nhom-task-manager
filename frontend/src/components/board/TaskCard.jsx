import { memo } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { COLUMNS } from '../../config/seasonConfig';

function TaskCard({ task, isNearDeadline, onDelete, onStatusChange, onSelect, onToggleImportant, isDark, col, isBoardDragging }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: task.id });
  const theme = isDark ? col.dark : col.light;

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className="task-card"
      style={{
        position: 'relative',
        zIndex: 10,
        background: task.isImportant
          ? (isDark ? 'rgba(45,42,26,0.9)' : 'rgba(255,251,235,0.9)')
          : (isDark ? 'rgba(30,35,45,0.82)' : 'rgba(255,255,255,0.75)'),
        backdropFilter: isBoardDragging ? 'none' : 'blur(12px)',
        border: `1px solid ${task.isImportant ? '#fde68a' : (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.9)')}`,
        borderRadius: '20px',
        padding: '12px',
        marginBottom: '8px',
        cursor: 'grab',
        opacity: isDragging ? 0.3 : 1,
        transform: isDragging ? 'translateZ(0) scale(1.02)' : undefined,
        boxShadow: isDragging
          ? '0 10px 24px rgba(0,0,0,0.16)'
          : (isBoardDragging ? 'none' : '0 4px 14px rgba(0,0,0,0.08)'),
        transition: isBoardDragging ? 'none' : 'box-shadow 160ms ease, transform 160ms ease',
        willChange: isDragging ? 'transform, opacity' : undefined,
        contain: 'layout paint',
      }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
        <p style={{ fontWeight: '700', fontSize: '13px', color: isDark ? '#f1f5f9' : '#1e293b', margin: 0, flex: 1, lineHeight: 1.4 }}>{task.title}</p>
        <span style={{ fontSize: '16px', marginLeft: '6px' }}>{task.isImportant ? '⭐' : ''}</span>
      </div>

      {task.description && (
        <p style={{ fontSize: '12px', color: isDark ? '#94a3b8' : '#64748b', marginBottom: '8px', lineHeight: '1.4' }}>{task.description}</p>
      )}

      {task.deadline && (
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '4px',
          background: isNearDeadline(task.deadline) ? '#fee2e2' : (isDark ? 'rgba(51,65,85,0.6)' : 'rgba(241,245,249,0.8)'),
          color: isNearDeadline(task.deadline) ? '#ef4444' : theme.text,
          padding: '3px 8px', borderRadius: '99px', fontSize: '11px', marginBottom: '8px', fontWeight: '600'
        }}>
          {new Date(task.deadline).toLocaleDateString('vi-VN')}
          {isNearDeadline(task.deadline) && ' ⚠️'}
        </div>
      )}

      <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }} onPointerDown={e => e.stopPropagation()}>
        <button
          onClick={() => onToggleImportant(task.id)}
          style={{ padding: '5px 8px', background: task.isImportant ? 'rgba(254,249,195,0.8)' : (isDark ? 'rgba(51,65,85,0.6)' : 'rgba(241,245,249,0.8)'), color: task.isImportant ? '#f59e0b' : '#94a3b8', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' }}>
          {task.isImportant ? '⭐' : '☆'}
        </button>
        <button
          onClick={() => onSelect(task)}
          style={{ flex: 1, padding: '5px', background: isDark ? 'rgba(30,58,95,0.6)' : 'rgba(238,242,255,0.8)', color: '#6366f1', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '11px', fontWeight: '700' }}>
          💬
        </button>
        <select
          value={task.status}
          onChange={e => onStatusChange(task.id, e.target.value)}
          style={{ flex: 1, padding: '5px', fontSize: '11px', borderRadius: '8px', border: 'none', background: isDark ? 'rgba(15,23,42,0.5)' : 'rgba(255,255,255,0.8)', color: isDark ? '#f1f5f9' : '#475569', fontFamily: 'Nunito, sans-serif' }}>
          {COLUMNS.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
        </select>
        <button
          onClick={() => onDelete(task.id)}
          style={{ padding: '5px 8px', background: 'rgba(254,226,226,0.8)', color: '#ef4444', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '11px' }}>
          🗑️
        </button>
      </div>
    </div>
  );
}

export default memo(TaskCard);
