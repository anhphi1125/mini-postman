type Props = {
  message: string;
  showModal: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

function ConfirmModal({ message, showModal, onConfirm, onCancel }: Props) {
  if (!showModal) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <p>{message}</p>

        <div className="modal-action">
          <button className="status-ok" onClick={onConfirm}>
            Yes
          </button>

          <button className="status-error" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
