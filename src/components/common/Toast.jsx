import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
export const ToastContainer = ({ toasts, onDismiss }) => {
    if (toasts.length === 0)
        return null;
    return (<div className="fixed bottom-5 right-5 z-50 flex flex-col space-y-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (<div key={toast.id} className={`pointer-events-auto p-4 rounded-xl shadow-lg border flex items-start space-x-3 transition-all animate-slide-up ${toast.type === 'success'
                ? 'bg-emerald-900 text-white border-emerald-800'
                : toast.type === 'error'
                    ? 'bg-rose-900 text-white border-rose-800'
                    : 'bg-slate-900 text-white border-slate-800'}`}>
          {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5"/>}
          {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5"/>}
          {toast.type === 'info' && <Info className="w-5 h-5 text-sky-400 shrink-0 mt-0.5"/>}

          <div className="flex-1 text-xs font-medium leading-relaxed">
            {toast.text}
          </div>

          <button type="button" onClick={() => onDismiss(toast.id)} className="text-white/60 hover:text-white transition-colors p-1">
            <X className="w-4 h-4"/>
          </button>
        </div>))}
    </div>);
};
