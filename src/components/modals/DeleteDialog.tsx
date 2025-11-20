import { ConfirmDialog } from './ConfirmDialog';

/**
 * Диалог подтверждения удаления привычки
 * Обёртка над универсальным ConfirmDialog для удобства использования
 */
export function DeleteDialog({
  habitName,
  onConfirm,
  onCancel,
}: {
  habitName: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <ConfirmDialog
      title="Удалить привычку?"
      message={`Привычка "${habitName}" и вся история выполнения будут удалены навсегда.`}
      confirmText="Удалить"
      cancelText="Отмена"
      variant="danger"
      onConfirm={onConfirm}
      onCancel={onCancel}
    />
  );
}
