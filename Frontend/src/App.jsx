import { useState } from 'react';
import AppRoutes from "./AppRoutes";
import toast, { Toaster } from 'react-hot-toast';

function App() {

  return (
    <>

      <Toaster
        position="top-center"   
        toastOptions={{
          className: '!bg-[#2a1f1a]/80 !backdrop-blur-md !border !border-orange-400/30 !rounded-2xl !shadow-[0_8px_32px_rgba(255,140,0,0.2)] !shadow-orange-500/20',
          style: {
            background: 'rgba(42, 31, 26, 0.8)',
            color: '#f5e6d3',
            border: '1px solid rgba(255, 140, 0, 0.3)',
            borderRadius: '3.50rem',
            boxShadow: '0 8px 32px rgba(255, 140, 0, 0.15), 0 0 80px rgba(255, 140, 0, 0.05)',
            backdropFilter: 'blur(12px)',
            padding: '14px 24px',
            fontSize: '0.9rem',
            fontWeight: '500',
          },
          success: {
            className: '!border-emerald-400/40 !shadow-emerald-500/20',
            iconTheme: { primary: '#34d399', secondary: '#0a0807' },
          },
          error: {
            className: '!border-rose-400/40 !shadow-rose-500/20',
            iconTheme: { primary: '#fb7185', secondary: '#0a0807' },
          },
          loading: {
            className: '!border-amber-400/40 !shadow-amber-500/20',
            iconTheme: { primary: '#fbbf24', secondary: '#0a0807' },
          },
          duration: 4000,
        }}
      />

      <AppRoutes />
    </>
  );
}
export default App;