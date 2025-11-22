/**
 * 🔢 NumericInputModal
 * 
 * Модальное окно для ввода числового значения измеримой привычки.
 * 
 * Возможности:
 * - Ввод числа с автофокусом
 * - Отображение цели и прогресса
 * - Сохранение значения или заморозка
 * - Enter для быстрого сохранения
 * 
 * Дата создания: 15 ноября 2025
 * Последнее обновление: 22 ноября 2025 (мигрировано в модуль habit-tracker)
 */

import React, { useState, useEffect, useRef } from 'react';
import { Modal } from '@/shared/constructors/modal';
import { Button } from '@/shared/components/button';
import { INPUT_STYLES } from '@/shared/constants/styles';

interface NumericInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  habitName: string;
  date: string;
  currentValue: number | '';
  unit?: string;
  targetValue?: number;
  targetType?: 'min' | 'max';
  onSave: (value: number) => void;
  onSkip: () => void;
  declineUnit?: (value: number, unit: string) => string;
}

export function NumericInputModal({
  isOpen,
  onClose,
  habitName,
  date,
  currentValue,
  unit = '',
  targetValue,
  targetType,
  onSave,
  onSkip,
  declineUnit,
}: NumericInputModalProps) {
  const [value, setValue] = useState<string>(currentValue === '' ? '' : currentValue.toString());
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setValue(currentValue === '' ? '' : currentValue.toString());
      // Фокусируем input с небольшой задержкой, чтобы модалка успела открыться
      setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 100);
    }
  }, [isOpen, currentValue]);

  if (!isOpen) return null;

  const numValue = value === '' ? 0 : parseFloat(value);
  const isMet = targetValue !== undefined && (
    targetType === 'min' ? numValue >= targetValue : numValue <= targetValue
  );

  const handleSave = () => {
    const finalValue = value === '' ? 0 : parseFloat(value);
    if (!isNaN(finalValue)) {
      onSave(finalValue);
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    // Ограничение на 7 символов
    if (newValue.length <= 7) {
      setValue(newValue);
    }
  };

  return (
    <Modal.Root level="modal" onClose={onClose}>
      <Modal.Backdrop onClick={onClose} />
      <Modal.Content size="md" className="p-6">
        {/* Заголовок */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <h4 className="text-gray-900 mb-1">{habitName}</h4>
            <p className="text-sm text-gray-500">{date}</p>
          </div>
          <Modal.CloseButton onClick={onClose} />
        </div>

        {/* Поле ввода */}
        <div className="mb-6">
          <div className="relative">
            <input
              ref={inputRef}
              type="number"
              value={value}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              className={`${INPUT_STYLES.numericLarge} ${INPUT_STYLES.noSpinButtons}`}
              placeholder=""
              step="any"
            />
          </div>

          {/* Информация о цели */}
          {targetValue !== undefined && (
            <div className={`mt-3 text-center text-sm ${isMet ? 'text-green-600' : 'text-gray-500'}`}>
              Цель: {targetValue} {declineUnit && unit ? declineUnit(targetValue, unit) : unit}
              {isMet && ' ✓'}
            </div>
          )}
        </div>

        {/* Кнопки */}
        <div className="flex gap-3">
          <Button
            variant="secondary"
            onClick={() => {
              onSkip();
              onClose();
            }}
            className="flex-1 border-2 rounded-xl text-sm"
          >
            Заморозить
          </Button>
          <Button
            variant="primary"
            onClick={handleSave}
            className="flex-1 rounded-xl text-sm"
          >
            Сохранить
          </Button>
        </div>
      </Modal.Content>
    </Modal.Root>
  );
}
