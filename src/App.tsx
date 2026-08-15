import React from 'react';
import { useApp } from './context/AppContext';
import { PublicWebsite } from './components/public/PublicWebsite';
import { AdminPortal } from './components/portal/AdminPortal';

export default function App() {
  const { currentView } = useApp();

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 font-sans">
      {currentView === 'public' ? (
        <PublicWebsite />
      ) : (
        <AdminPortal />
      )}
    </div>
  );
}

