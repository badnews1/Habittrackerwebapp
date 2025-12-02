/**
 * Типы для SectionPicker
 * 
 * @module shared/ui/section-picker
 * @created 28 ноября 2025
 * @updated 2 декабря 2025 - добавлена поддержка Section[] с цветами
 */

import type { Section } from '@/entities/habit';
import type { ColorVariant } from '@/shared/constants/colors';

export interface SectionPickerProps {
  /** Список разделов с цветами */
  sections: Section[];
  
  /** Выбранный раздел (только название) */
  selectedSection: string | null;
  
  /** Callback выбора раздела */
  onSelectSection: (section: string) => void;
  
  /** Callback добавления раздела с цветом */
  onAddSection: (name: string, color: ColorVariant) => void;
  
  /** Callback обновления цвета раздела (опционально) */
  onUpdateSectionColor?: (name: string, color: ColorVariant) => void;
  
  /** Callback удаления раздела */
  onDeleteSection: (section: string) => void;
  
  /** Функция проверки возможности удаления (вместо хардкода "Другие") */
  canDelete?: (section: string) => boolean;
  
  /** Функция получения количества использований раздела */
  getUsageCount?: (section: string) => number;
  
  /** 
   * Форматирование сообщения при удалении раздела
   * Если не передано, показывается простое подтверждение без деталей
   * 
   * @param sectionName - Название удаляемого раздела
   * @param usageCount - Количество использований (если getUsageCount задан)
   * @returns Текст сообщения для AlertDialog
   * 
   * @example
   * formatDeleteMessage={(name, count) => 
   *   count && count > 0
   *     ? `Раздел "${name}" используется в ${count} ${pluralize(count, 'привычке', 'привычках', 'привычках')}`
   *     : `Удалить раздел "${name}"?`
   * }
   */
  formatDeleteMessage?: (sectionName: string, usageCount?: number) => string;
  
  /** Placeholder для триггера */
  placeholder?: string;
  
  /** Текст кнопки добавления */
  addButtonText?: string;
  
  /** Placeholder для input */
  inputPlaceholder?: string;
  
  /** Максимальная длина названия раздела */
  maxLength?: number;
  
  /** Controlled состояние открытия */
  open?: boolean;
  
  /** Callback изменения состояния открытия */
  onOpenChange?: (open: boolean) => void;
}