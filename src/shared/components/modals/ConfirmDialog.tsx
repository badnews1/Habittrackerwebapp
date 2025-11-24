import { Button } from '@/shared/components/button';
import { Modal } from '@/shared/constructors/modal';

interface ConfirmDialogProps {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning';
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * Универсальный диалог подтверждения действия
 * Используется для удаления привычек, категорий и других критических операций
 * 
 * @example
 * ```tsx
 * <ConfirmDialog
 *   title="Удалить элемент?"
 *   message="Это действие нельзя отменить"
 *   confirmText="Удалить"
 *   cancelText="Отмена"
 *   variant="danger"
 *   onConfirm={handleDelete}
 *   onCancel={handleCancel}
 * />
 * ```
 * 
 * Дата создания: 19 ноября 2025
 * Последнее обновление: 21 ноября 2025 (мигрирован в /shared/components/modals/)
 */
export function ConfirmDialog({
  title,
  message,
  confirmText = 'Подтвердить',
  cancelText = 'Отмена',
  variant = 'danger',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Modal.Root level="dialog" onClose={onCancel}>
      <Modal.Backdrop onClick={onCancel} />
      <Modal.Content size="sm" className="p-8">
        <h4 className="text-gray-900 mb-3">{title}</h4>
        <p className="text-sm text-gray-500 mb-8 whitespace-pre-line">{message}</p>
        <div className="flex gap-3">
          <Button
            variant="secondary"
            onClick={onCancel}
            className="flex-1 rounded-full border-gray-200 hover:border-gray-300"
          >
            {cancelText}
          </Button>
          <Button
            variant={variant}
            onClick={onConfirm}
            className="flex-1 rounded-full"
          >
            {confirmText}
          </Button>
        </div>
      </Modal.Content>
    </Modal.Root>
  );
}