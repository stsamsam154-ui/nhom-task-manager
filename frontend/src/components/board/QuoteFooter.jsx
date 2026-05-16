import { useState } from 'react';
import { QUOTES } from '../../config/seasonConfig';

export default function QuoteFooter({ isDark }) {
  const [quote] = useState(() => {
    const stored = localStorage.getItem('daily_quote');
    const today = new Date().toDateString();
    if (stored) {
      const { date, text } = JSON.parse(stored);
      if (date === today) return text;
    }
    const text = QUOTES[Math.floor(Math.random() * QUOTES.length)];
    localStorage.setItem('daily_quote', JSON.stringify({ date: today, text }));
    return text;
  });

  return (
    <div style={{
      textAlign: 'center',
      marginTop: '32px',
      padding: '16px',
      background: isDark ? 'rgba(30,41,59,0.4)' : 'rgba(255,255,255,0.4)',
      backdropFilter: 'blur(8px)',
      borderRadius: '16px',
      border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.6)'}`,
    }}>
      <p className="quote-text" style={{
        fontSize: '13px',
        color: isDark ? '#94a3b8' : '#64748b',
        fontStyle: 'italic',
        fontWeight: '600',
      }}>{quote}</p>
    </div>
  );
}