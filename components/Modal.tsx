
import React from 'react';
import { useUIStore } from '../store/uiStore';
import type { ModalAction } from '../types/index';

const Modal: React.FC = () => {
  const { isModalOpen, modalContent, closeModal } = useUIStore((state) => ({
    isModalOpen: state.isModalOpen,
    modalContent: state.modalContent,
    closeModal: state.closeModal,
  }));

  if (!isModalOpen || !modalContent) return null;

  const getButtonClasses = (style: ModalAction['style']) => {
    switch (style) {
      case 'danger':
        return 'bg-red-600 hover:bg-red-700 text-white';
      case 'primary':
        return 'bg-blue-500 hover:bg-blue-600 text-white';
      case 'secondary':
      default:
        return 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-black dark:text-white';
    }
  };

  const handleActionClick = (action: ModalAction) => {
    if (action.action) {
      action.action();
    }
    closeModal();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm"
      onClick={closeModal}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-sm m-4 p-6 text-black dark:text-white transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold mb-2">{modalContent.title}</h2>
        {modalContent.description && <p className="text-gray-600 dark:text-gray-300 mb-6">{modalContent.description}</p>}
        <div className="flex justify-end space-x-3">
          {modalContent.actions.map((action) => (
            <button
              key={action.label}
              onClick={() => handleActionClick(action)}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors duration-200 ${getButtonClasses(action.style)}`}
            >
              {action.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Modal;
