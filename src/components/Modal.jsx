import React, { useEffect } from 'react';

const Modal = ({ isOpen, onClose, title, children, className = "" }) => {
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
    }
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className={`modal-content ${className}`} 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          {/* 1. UPDATED: Red heading */}
          <h2 className="modal-title text-2xl font-semibold text-red-600 dark:text-red-500">
            {title}
          </h2>
          
          {/* 2. UPDATED: Close button hover effect */}
          <button 
            onClick={onClose} 
            className="modal-close-btn text-3xl font-light text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors duration-300"
          >
            &times;
          </button>
        </div>
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;