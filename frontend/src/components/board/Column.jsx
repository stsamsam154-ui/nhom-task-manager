import { memo, useRef } from 'react';
import { useDroppable } from '@dnd-kit/core';
import TaskCard from './TaskCard';
import ParticleBurst from './ParticleBurst';
import springLight from '../../assets/season-spring-light.jpg';
import springDark from '../../assets/season-spring-dark.jpg';
import summerLight from '../../assets/season-summer-light.jpg';
import summerDark from '../../assets/season-summer-dark.jpg';
import autumnLight from '../../assets/season-autumn-light.jpg';
import autumnDark from '../../assets/season-autumn-dark.jpg';
import winterLight from '../../assets/season-winter-light.jpg';
import winterDark from '../../assets/season-winter-dark.jpg';

const COLUMN_BACKGROUNDS = {
  todo: {
    light: { image: springLight, position: 'center top' },
    dark: { image: springDark, position: 'center top' },
  },
  inprogress: {
    light: { image: summerLight, position: 'center center' },
    dark: { image: summerDark, position: 'center top' },
  },
  review: {
    light: { image: autumnLight, position: 'center top' },
    dark: { image: autumnDark, position: 'center center' },
  },
  done: {
    light: { image: winterLight, position: 'center center' },
    dark: { image: winterDark, position: 'center bottom' },
  },
};

function Column({ col, tasks, isNearDeadline, onDelete, onStatusChange, onSelect, onToggleImportant, isDark, isDropTarget, dropEffectKey, isDragging }) {
  const { setNodeRef, isOver } = useDroppable({ id: col.id });
  const theme = isDark ? col.dark : col.light;
  const containerRef = useRef(null);
  const background = COLUMN_BACKGROUNDS[col.id]?.[isDark ? 'dark' : 'light'];
  const imageOverlay = isDark
    ? 'linear-gradient(180deg, rgba(8,13,24,0.68), rgba(8,13,24,0.86))'
    : 'linear-gradient(180deg, rgba(255,255,255,0.82), rgba(255,255,255,0.92))';
  const hoverOverlay = isOver
    ? `linear-gradient(180deg, ${theme.accent}38, ${theme.accent}18)`
    : 'linear-gradient(180deg, rgba(255,255,255,0), rgba(255,255,255,0))';
  const shouldShowImage = background && !isDragging;

  return (
    <div
      ref={(node) => {
        setNodeRef(node);
        containerRef.current = node;
      }}
      style={{
        position: 'relative',
        backgroundColor: isOver ? `${theme.accent}40` : `${theme.bg}cc`,
        backgroundImage: shouldShowImage
          ? `${hoverOverlay}, ${imageOverlay}, url(${background.image})`
          : undefined,
        backgroundSize: 'cover',
        backgroundPosition: background?.position || 'center',
        backdropFilter: isDragging ? 'none' : 'blur(12px)',
        borderRadius: '20px',
        padding: '16px',
        paddingTop: '16px',
        minHeight: '400px',
        transition: isDragging
          ? 'border-color 120ms ease, background-color 120ms ease'
          : 'background-color 220ms ease, border-color 220ms ease, box-shadow 220ms ease',
        border: `2px solid ${isOver ? theme.accent : `${theme.accent}40`}`,
        boxShadow: isOver
          ? (isDragging ? `0 0 0 1px ${theme.accent}40` : `0 6px 20px ${theme.accent}45, 0 0 0 1px ${theme.accent}35`)
          : (isDragging ? 'none' : `0 8px 24px ${theme.accent}18`),
        overflow: 'hidden',
        contain: 'layout paint',
      }}>

      {/* Particle Layer */}
      {isDropTarget && (
        <ParticleBurst
          key={dropEffectKey}
          season={col.id}
          isDark={isDark}
          containerRef={containerRef}
        />
      )}

      {/* Column Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', position: 'relative', zIndex: 10 }}>
        <span style={{ fontWeight: '800', fontSize: '14px', color: theme.text }}>{col.label}</span>
        <span style={{
          background: `${theme.accent}30`,
          color: theme.text,
          borderRadius: '99px',
          padding: '2px 10px',
          fontSize: '12px',
          fontWeight: '700',
          border: `1px solid ${theme.accent}50`,
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
