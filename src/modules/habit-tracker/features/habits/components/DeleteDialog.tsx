/**
 * 🗑️ DeleteDialog
 * 
 * Диалог подтверждения удаления привычки.
 * Обёртка над универсальным ConfirmDialog для удобства использования.
 * 
 * Дата создания: 15 ноября 2025
 * Последнее обновление: 22 ноября 2025 (мигрировано в модуль habit-tracker)
 */

import { ConfirmDialog } from '@/shared/components/modals';

/**
 * Диалог подтверждения удаления привычки
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
