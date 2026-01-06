import React from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';
import { useToast } from '../context/AppStateContext';

const Toast = () => {
  const { toast, hideToast } = useToast();

  if (!toast) return null;

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-500" />,
    error: <XCircle className="w-5 h-5 text-red-500" />,
    warning: <AlertCircle className="w-5 h-5 text-yellow-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />,
  };

  const bgColors = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    warning: 'bg-yellow-50 border-yellow-200',
    info: 'bg-blue-50 border-blue-200',
  };

  const textColors = {
    success: 'text-green-800',
    error: 'text-red-800',
    warning: 'text-yellow-800',
    info: 'text-blue-800',
  };

  return (
    <div className="fixed top-20 right-4 z-50 animate-slide-in">
      <div className={`flex items-center gap-3 ${bgColors[toast.type]} border rounded-lg shadow-lg px-4 py-3 min-w-[300px] max-w-md`}>
        {icons[toast.type]}
        <p className={`flex-1 text-sm font-medium ${textColors[toast.type]}`}>
          {toast.message}
        </p>
        <button
          onClick={hideToast}
          className={`p-1 rounded hover:bg-opacity-20 hover:bg-gray-500 transition-colors ${textColors[toast.type]}`}
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Toast;
