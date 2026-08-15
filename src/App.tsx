import React from 'react';
import { useApp } from './context/AppContext';
import { PublicWebsite } from './components/public/PublicWebsite';
import { AdminPortal } from './components/portal/AdminPortal';

export default function App() {
  const { currentView } = useApp();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#050b1a] via-[#09122a] to-[#0e1b3d] text-slate-100 font-sans selection:bg-blue-600 selection:text-white antialiased">
      {currentView === 'public' ? (
        <PublicWebsite />
      ) : (
        <AdminPortal />
      )}
    </div>
  );
}



