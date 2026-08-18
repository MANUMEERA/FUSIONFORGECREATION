import React from 'react';
import { useApp } from './context/AppContext';
import { PublicWebsite } from './components/public/PublicWebsite';
import { AdminPortal } from './components/portal/AdminPortal';

export default function App() {
  const { currentView } = useApp();

  return (
    <div className="min-h-screen bg-[#FAF8FF] text-[#1E1B2E] font-sans selection:bg-[#8E2D9D] selection:text-white antialiased">
      {currentView === 'public' ? (
        <PublicWebsite />
      ) : (
        <AdminPortal />
      )}
    </div>
  );
}



