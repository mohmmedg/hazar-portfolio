import React from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';

export interface Toast {
  id: string;
  type: 'success' | 'error';
  message: string;
}

interface AdminToastProps {
  toasts: Toast[];
}

export default function AdminToast({ toasts }: AdminToastProps) {
  return (
    <div className="fixed bottom-6 right-6 z-50 space-y-3 pointer-events-none">
      {toasts.map(toast => (
        <div 
          key={toast.id}
          className={`px-4 py-3 border border-white/10 rounded-none shadow-2xl backdrop-blur-md flex items-center gap-2 text-white text-xs tracking-wider uppercase font-sans animate-fade-in pointer-events-auto ${
            toast.type === 'success' ? 'bg-emerald-950/80 border-emerald-500/30' : 'bg-red-950/80 border-red-500/30'
          }`}
        >
          {toast.type === 'success' ? (
            <CheckCircle className="w-4 h-4 text-emerald-400" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-400" />
          )}
          <span>{toast.message}</span>
        </div>
      ))}
    </div>
  );
}
