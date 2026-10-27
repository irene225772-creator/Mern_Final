import { useEffect, useRef } from 'react';

export default function Dialog({ title, onClose, children, wide = false }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    dialog?.showModal();
    return () => {
      if (dialog?.open) dialog.close();
    };
  }, []);

  return (
    <dialog
      ref={dialogRef}
      className={`dialog${wide ? ' dialog--wide' : ''}`}
      aria-labelledby="dialog-title"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="dialog__heading">
        <h2 id="dialog-title">{title}</h2>
        <button className="icon-button" type="button" onClick={onClose} aria-label="Close dialog">
          <span aria-hidden="true">×</span>
        </button>
      </div>
      {children}
    </dialog>
  );
}