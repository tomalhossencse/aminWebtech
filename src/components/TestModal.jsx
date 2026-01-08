import React from 'react';

const TestModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Simple DaisyUI Modal Test */}
      <div className={`modal ${isOpen ? 'modal-open' : ''}`}>
        <div className="modal-box">
          <h3 className="font-bold text-lg">Test Modal</h3>
          <p className="py-4">This is a simple test modal to verify DaisyUI modal functionality.</p>
          <div className="modal-action">
            <button className="btn" onClick={onClose}>Close</button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={onClose}>close</button>
        </form>
      </div>
    </>
  );
};

export default TestModal;