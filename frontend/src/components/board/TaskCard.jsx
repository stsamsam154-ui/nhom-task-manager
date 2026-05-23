import { memo } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { COLUMNS, getTaskTag } from '../../config/seasonConfig';

function TaskCard({ task, isNearDeadline, onDelete, onStatusChange, onSelect, onToggleImportant, isDark, col, isBoardDragging }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: task.id });
  const theme = isDark ? col.dark : col.light;
  const tag = getTaskTag(task.tag);

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
          ? (isDark ? 'rgba(69,58,23,0.92)' : '#fffbeb')
          : (isDark ? 'rgba(30,41,59,0.92)' : '#ffffff'),
        border: `1px solid ${task.isImportant ? '#facc15' : (isDark ? 'rgba(148,163,184,0.16)' : '#e2e8f0')}`,
        borderRadius: '10px',
        padding: '11px',
        marginBottom: '8px',
        cursor: 'grab',
        opacity: isDragging ? 0.3 : 1,
        transform: isDragging ? 'translateZ(0) scale(1.02)' : undefined,
        boxShadow: isDragging
          ? '0 10px 24px rgba(0,0,0,0.16)'
          : (isBoardDragging ? 'none' : '0 1px 2px rgba(15,23,42,0.08)'),
        transition: isBoardDragging ? 'none' : 'box-shadow 160ms ease, transform 160ms ease',
        willChange: isDragging ? 'transform, opacity' : undefined,
        contain: 'layout paint',
      }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
        <p style={{ fontWeight: '800', fontSize: '13px', color: isDark ? '#f8fafc' : '#111827', margin: 0, flex: 1, lineHeight: 1.4 }}>{task.title}</p>
        <span style={{ fontSize: '14px', marginLeft: '6px' }}>{task.isImportant ? '⭐' : ''}</span>
      </div>

      {task.description && (
        <p style={{ fontSize: '12px', color: isDark ? '#94a3b8' : '#64748b', marginBottom: '8px', lineHeight: '1.4' }}>{task.description}</p>
      )}

      {tag && (
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          background: tag.bg,
          color: tag.text,
          padding: '3px 8px',
          borderRadius: '99px',
          fontSize: '11px',
          marginBottom: '8px',
          marginRight: '6px',
          fontWeight: '800',
        }}>
          {tag.label}
        </div>
      )}

      {task.deadline && (
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '4px',
          background: isNearDeadline(task.deadline) ? '#fee2e2' : (isDark ? 'rgba(51,65,85,0.72)' : '#f1f5f9'),
          color: isNearDeadline(task.deadline) ? '#ef4444' : theme.text,
          padding: '3px 8px', borderRadius: '99px', fontSize: '11px', marginBottom: '8px', fontWeight: '700'
        }}>
          {new Date(task.deadline).toLocaleDateString('vi-VN')}
          {isNearDeadline(task.deadline) && ' ⚠️'}
        </div>
      )}

      <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }} onPointerDown={e => e.stopPropagation()}>
        <button
          onClick={() => onToggleImportant(task.id)}
          style={{ padding: '5px 8px', background: task.isImportant ? '#fef3c7' : (isDark ? 'rgba(51,65,85,0.7)' : '#f1f5f9'), color: task.isImportant ? '#d97706' : '#64748b', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' }}>
          {task.isImportant ? '⭐' : '☆'}
        </button>
        <button
          onClick={() => onSelect(task)}
          style={{ flex: 1, padding: '5px', background: isDark ? 'rgba(30,58,95,0.6)' : '#eef2ff', color: '#4f46e5', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '11px', fontWeight: '800' }}>
          💬
        </button>
        <select
          value={task.status}
          onChange={e => onStatusChange(task.id, e.target.value)}
          style={{ flex: 1, padding: '5px', fontSize: '11px', borderRadius: '8px', border: `1px solid ${isDark ? 'rgba(148,163,184,0.16)' : '#e2e8f0'}`, background: isDark ? 'rgba(15,23,42,0.5)' : '#ffffff', color: isDark ? '#f1f5f9' : '#475569', fontFamily: 'Nunito, sans-serif' }}>
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
