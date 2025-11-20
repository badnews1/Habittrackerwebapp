import { useState } from 'react';
import { FrequencyConfig } from '../types/habit';

/**
 * Хук для управления состоянием модального окна редактирования частоты
 * 
 * Инкапсулирует логику:
 * - Открытие/закрытие модального окна
 * - Сохранение/восстановление бэкапа при отмене
 * - Применение дефолтных значений при сохранении
 * 
 * Дата создания: 19 ноября 2024
 */
export const useFrequencyModal = (currentFrequency: FrequencyConfig) => {
  const [isOpen, setIsOpen] = useState(false);
  const [editingType, setEditingType] = useState(currentFrequency.type);
  const [editingCount, setEditingCount] = useState(currentFrequency.count || 7);
  const [editingPeriod, setEditingPeriod] = useState(currentFrequency.period || 7);
  const [editingDaysOfWeek, setEditingDaysOfWeek] = useState(currentFrequency.daysOfWeek || [0, 1, 2, 3, 4]);
  
  // Бэкап для отмены изменений
  const [backup, setBackup] = useState<{
    type: FrequencyConfig['type'];
    count: number;
    period: number;
    daysOfWeek: number[];
  } | null>(null);

  /**
   * Открывает модальное окно и сохраняет бэкап текущих значений
   */
  const open = () => {
    // Синхронизируем с текущей частотой
    setEditingType(currentFrequency.type);
    setEditingCount(currentFrequency.count || 7);
    setEditingPeriod(currentFrequency.period || 7);
    setEditingDaysOfWeek(currentFrequency.daysOfWeek || [0, 1, 2, 3, 4]);
    
    // Сохраняем бэкап для отмены
    setBackup({
      type: currentFrequency.type,
      count: currentFrequency.count || 7,
      period: currentFrequency.period || 7,
      daysOfWeek: currentFrequency.daysOfWeek || [0, 1, 2, 3, 4],
    });
    
    setIsOpen(true);
  };

  /**
   * Закрывает модальное окно и восстанавливает бэкап
   */
  const cancel = () => {
    // Восстанавливаем из бэкапа
    if (backup) {
      setEditingType(backup.type);
      setEditingCount(backup.count);
      setEditingPeriod(backup.period);
      setEditingDaysOfWeek(backup.daysOfWeek);
    }
    setIsOpen(false);
  };

  /**
   * Применяет изменения и возвращает новую частоту с дефолтными значениями
   * @returns Объект FrequencyConfig с применёнными дефолтами
   */
  const save = (): FrequencyConfig => {
    // Применяем дефолты на основе типа
    let finalCount = editingCount;
    let finalPeriod = editingPeriod;
    
    switch (editingType) {
      case 'every_n_days':
        finalPeriod = editingPeriod || 5;
        break;
      case 'n_times_week':
        finalCount = editingCount || 5;
        break;
      case 'n_times_month':
        finalCount = editingCount || 10;
        break;
      case 'n_times_in_m_days':
        finalCount = editingCount || 5;
        finalPeriod = editingPeriod || 14;
        break;
    }
    
    setIsOpen(false);
    
    return {
      type: editingType,
      count: finalCount,
      period: finalPeriod,
      daysOfWeek: editingType === 'by_days_of_week' ? editingDaysOfWeek : undefined,
    };
  };

  return {
    // State
    isOpen,
    editingType,
    editingCount,
    editingPeriod,
    editingDaysOfWeek,
    
    // Setters
    setEditingType,
    setEditingCount,
    setEditingPeriod,
    setEditingDaysOfWeek,
    
    // Actions
    open,
    cancel,
    save,
  };
};