import React from 'react';
import { Modal } from '../../modal';
import { FrequencyEditor } from '../../shared/frequency';
import { FrequencyConfig } from '../../../types/habit';
import { Button } from '../../common';

interface FrequencyModalProps {
  /** Открыто ли модальное окно */
  isOpen: boolean;
  
  /** Тип частоты */
  frequencyType: FrequencyConfig['type'];
  
  /** Количество (для n_times_week, n_times_month, n_times_in_m_days) */
  frequencyCount: number;
  
  /** Период (для every_n_days, n_times_in_m_days) */
  frequencyPeriod: number;
  
  /** Дни недели (для by_days_of_week) */
  daysOfWeek: number[];
  
  /** Колбэк изменения типа частоты */
  onFrequencyTypeChange: (type: FrequencyConfig['type']) => void;
  
  /** Колбэк изменения количества */
  onFrequencyCountChange: (count: number) => void;
  
  /** Колбэк изменения периода */
  onFrequencyPeriodChange: (period: number) => void;
  
  /** Колбэк изменения дней недели */
  onDaysOfWeekChange: (days: number[]) => void;
  
  /** Колбэк сохранения */
  onSave: () => void;
  
  /** Колбэк отмены */
  onCancel: () => void;
}

/**
 * Модальное окно редактирования частоты привычки
 * 
 * Используется в AddHabitModal для настройки частоты выполнения привычки.
 * Отображается поверх основного модального окна (z-index 70).
 * 
 * Дата создания: 19 ноября 2024
 * Дата обновления: 19 ноября 2025 (использует Modal компоненты)
 */
export const FrequencyModal: React.FC<FrequencyModalProps> = ({
  isOpen,
  frequencyType,
  frequencyCount,
  frequencyPeriod,
  daysOfWeek,
  onFrequencyTypeChange,
  onFrequencyCountChange,
  onFrequencyPeriodChange,
  onDaysOfWeekChange,
  onSave,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <Modal.Root level="nested" onClose={onCancel}>
      <Modal.Backdrop onClick={onCancel} />
      <Modal.Content size="sm">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h4 className="text-gray-900">Изменить частоту</h4>
            <p className="text-sm text-gray-500 mt-1">Настройка частоты выполнения</p>
          </div>
          <Modal.CloseButton onClick={onCancel} />
        </div>

        {/* Content */}
        <div className="p-6">
          <FrequencyEditor
            frequencyType={frequencyType}
            frequencyCount={frequencyCount}
            frequencyPeriod={frequencyPeriod}
            daysOfWeek={daysOfWeek}
            onFrequencyTypeChange={onFrequencyTypeChange}
            onFrequencyCountChange={onFrequencyCountChange}
            onFrequencyPeriodChange={onFrequencyPeriodChange}
            onDaysOfWeekChange={onDaysOfWeekChange}
          />
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex gap-3">
          <Button
            variant="primary"
            onClick={onSave}
            className="flex-[2]"
          >
            Сохранить
          </Button>
          <Button
            variant="secondary"
            onClick={onCancel}
            className="flex-[1]"
          >
            Отмена
          </Button>
        </div>
      </Modal.Content>
    </Modal.Root>
  );
};