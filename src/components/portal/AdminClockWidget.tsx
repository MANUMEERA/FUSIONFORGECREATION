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
      className="flex items-center bg-[#130E26] border border-[#3B255E] shadow-sm rounded-xl px-3 sm:px-3.5 py-1.5 select-none transition-all hover:border-[#8E2D9D] hover:shadow-md"
      title={`Current Admin Time: ${timeState.fullDateString} ${timeState.timeFormatted}`}
    >
      {/* Date & Day Column */}
      <div className="flex flex-col items-center justify-center text-center">
        <span className="text-[#E9D5FF] font-mono font-black text-xs leading-tight tracking-wider">
          {timeState.dateFormatted}
        </span>
        <span className="text-[#C084FC] font-mono font-bold text-[10px] leading-tight tracking-widest uppercase">
          {timeState.dayOfWeek}
        </span>
      </div>

      {/* Vertical Deep Divider */}
      <div className="w-[1.5px] h-6 sm:h-7 bg-[#3B255E] mx-2.5 sm:mx-3" />

      {/* Digital Monospace Time (HH:MM:SS) */}
      <div className="flex items-center">
        <span className="text-white font-mono font-black text-sm sm:text-base tracking-widest tabular-nums leading-none drop-shadow-xs">
          {timeState.timeFormatted}
        </span>
      </div>
    </div>
  );
};
