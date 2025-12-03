import React from 'react';

const Alert = ({ message, type = 'info', onClose }) => {
  const types = {
    info: 'bg-blue-100 border-blue-500 text-blue-700',
    success: 'bg-green-100 border-green-500 text-green-700',
    warning: 'bg-yellow-100 border-yellow-500 text-yellow-700',
    error: 'bg-red-100 border-red-500 text-red-700',
  };

  return (
    <div className={`border-l-4 p-4 mb-4 ${types[type]}`} role="alert">
      <div className="flex">
        <div className="flex-shrink-0">
          {type === 'success' && <span>✓</span>}
          {type === 'error' && <span>✗</span>}
          {type === 'warning' && <span>⚠</span>}
          {type === 'info' && <span>ℹ</span>}
        </div>
        <div className="ml-3">
          <p className="text-sm">{message}</p>
        </div>
        {onClose && (
          <div className="ml-auto pl-3">
            <button onClick={onClose} className="inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2">
              <span className="sr-only">Dismiss</span>
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Alert;
