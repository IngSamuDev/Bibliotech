import Modal from './Modal';
import Button from './Button';
import ErrorMessage from './ErrorMessage';

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  itemName,
  entityName = 'este registro',
  message,
  confirmText = 'Eliminar',
  confirmVariant = 'danger',
  cancelText = 'Cancelar',
  isLoading = false,
  error = '',
  onDismissError
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="max-w-xl">
      {message ? (
        <p className="mb-6 text-sm leading-6 text-slate-600">{message}</p>
      ) : (
        <p className="mb-6 text-sm leading-6 text-slate-600">
          ¿Estás seguro de que deseas eliminar {entityName}
          {itemName ? (
            <>
              {' '}
              <strong className="font-semibold text-slate-950">"{itemName}"</strong>
            </>
          ) : null}
          ? Esta acción no se puede deshacer.
        </p>
      )}
      {error && <ErrorMessage message={error} onDismiss={onDismissError} className="mb-4" />}
      <div className="grid gap-3 sm:grid-cols-2">
        <Button variant="secondary" onClick={onClose} disabled={isLoading} className="w-full">
          {cancelText}
        </Button>
        <Button variant={confirmVariant} onClick={onConfirm} isLoading={isLoading} className="w-full">
          {confirmText}
        </Button>
      </div>
    </Modal>
  );
};

export default ConfirmModal;
