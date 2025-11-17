import React from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="modal fade show d-block" tabIndex={-1} style={{ background: 'rgba(21, 101, 192, 0.15)', backdropFilter: 'blur(2px)' }}>
      <div className="modal-dialog modal-dialog-centered animate__animated animate__fadeInDown" style={{ maxWidth: 500 }}>
        <div className="modal-content shadow-lg border-0 rounded-4" style={{ animation: 'modalPop .4s cubic-bezier(.4,2,.6,1)', background: 'linear-gradient(120deg, #f5faff 70%, #ede7f6 100%)' }}>
          <div className="modal-header bg-primary bg-gradient text-white rounded-top-4 d-flex align-items-center justify-content-between px-4 py-3" style={{ background: 'linear-gradient(90deg, #1565c0 60%, #512da8 100%)', boxShadow: '0 2px 12px 0 #1565c033' }}>
            <h2 className="modal-title fs-4 fw-bold mb-0" style={{ letterSpacing: '-1px' }}>{title}</h2>
            <button type="button" className="btn-close btn-close-white ms-2" aria-label="Cerrar" onClick={onClose}></button>
          </div>
          <div className="modal-body px-5 py-4" style={{ minHeight: 180 }}>
            <div style={{ maxWidth: 400, margin: '0 auto' }}>
              {children}
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes modalPop {
          0% { transform: scale(0.85) translateY(-40px); opacity: 0; }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }
        .modal-content input, .modal-content select {
          border-radius: 0.7rem !important;
          box-shadow: 0 1px 8px 0 #1565c01a;
          border: 1.5px solid #d1e3fa;
          margin-bottom: 0.5rem;
        }
        .modal-content label {
          font-weight: 500;
          color: #1565c0;
          margin-bottom: 0.2rem;
        }
        .modal-content .invalid-feedback {
          color: #d32f2f;
          font-size: 0.97em;
          margin-bottom: 0.5rem;
          display: flex;
          align-items: center;
          gap: 0.4em;
        }
        .modal-content .invalid-feedback svg {
          width: 1.1em;
          height: 1.1em;
          min-width: 1.1em;
          min-height: 1.1em;
          margin-right: 0.2em;
          color: #d32f2f;
        }
        .modal-content .btn {
          min-width: 110px;
          font-weight: 500;
          border-radius: 0.7rem;
          box-shadow: 0 2px 8px 0 #1565c022;
        }
        .modal-content .btn + .btn {
          margin-left: 0.5rem;
        }
        .modal-content form {
          margin-bottom: 0;
        }
        .modal-content .mb-3 {
          margin-bottom: 1.1rem !important;
        }
      `}</style>
    </div>
  );
};
