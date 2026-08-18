import React, { useState, useEffect } from 'react';

export const AdminClockWidget: React.FC = () => {
  const [timeState, setTimeState] = useState(() => {
    const now = new Date();
    return {
      dateFormatted: `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}`,
      dayOfWeek: now.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase(),
      timeFormatted: now.toTimeString().split(' ')[0], // HH:MM:SS
      fullDateString: now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    };
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setTimeState({
        dateFormatted: `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}`,
        dayOfWeek: now.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase(),
        timeFormatted: now.toTimeString().split(' ')[0],
        fullDateString: now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div 
      className="flex items-center bg-[#FAF5FF] border border-[#E8E0F0] rounded-xl px-2.5 sm:px-3 py-1 select-none transition-all hover:border-[#C084FC]"
      title={`Current Admin Time: ${timeState.fullDateString} ${timeState.timeFormatted}`}
    >
      {/* Date & Day Column */}
      <div className="flex flex-col items-center justify-center text-center">
        <span className="text-[#8E2D9D] font-mono font-bold text-[11px] leading-tight tracking-wider">
          {timeState.dateFormatted}
        </span>
        <span className="text-[#6F42C1] font-mono font-bold text-[10px] leading-tight tracking-widest uppercase">
          {timeState.dayOfWeek}
        </span>
      </div>

      {/* Vertical Purple Divider */}
      <div className="w-[1px] h-5 sm:h-6 bg-[#E8E0F0] mx-2 sm:mx-2.5" />

      {/* Digital Monospace Time (HH:MM:SS) */}
      <div className="flex items-center">
        <span className="text-[#1E1B2E] font-mono font-black text-xs sm:text-sm tracking-widest tabular-nums leading-none">
          {timeState.timeFormatted}
        </span>
      </div>
    </div>
  );
};
