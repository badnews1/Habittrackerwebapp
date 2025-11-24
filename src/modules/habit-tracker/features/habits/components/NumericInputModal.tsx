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
import { formatDateFull } from '@/shared/utils/date';
import { Eraser, Pause, Check } from '@/shared/icons';

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

  // Форматируем дату в формат "ДД.ММ"
  const formattedDate = new Date(date).toLocaleDateString('ru-RU', { 
    day: '2-digit', 
    month: '2-digit' 
  });

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
    
    // Разрешаем только цифры и . или , для дробных чисел
    // Запрещаем отрицательные значения (знак минус)
    const validPattern = /^[0-9]*[.,]?[0-9]*$/;
    
    if (!validPattern.test(newValue)) {
      return; // Не обновляем значение, если оно не соответствует паттерну
    }
    
    // Ограничение на 7 символов
    if (newValue.length <= 7) {
      // Заменяем запятую на точку для корректного parseFloat
      const normalizedValue = newValue.replace(',', '.');
      setValue(normalizedValue);
    }
  };

  const handleSetTarget = () => {
    if (targetValue !== undefined) {
      onSave(targetValue);
      onClose();
    }
  };

  const handleClear = () => {
    onSave(0);
    onClose();
  };

  const handleFreeze = () => {
    setValue(''); // Очищаем поле перед заморозкой
    onSkip();
    onClose();
  };

  const handleIncrement = () => {
    const currentNum = value === '' ? 0 : parseFloat(value);
    const newValue = currentNum + 1;
    setValue(newValue.toString());
  };

  const handleDecrement = () => {
    const currentNum = value === '' ? 0 : parseFloat(value);
    const newValue = Math.max(0, currentNum - 1); // Не даём уйти в отрицательные
    setValue(newValue.toString());
  };

  return (
    <Modal.Root level="modal" onClose={onClose}>
      <Modal.Backdrop onClick={onClose} />
      <Modal.Content size="sm" className="p-6">
        {/* Заголовок */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <h4 className="text-gray-900 mb-1">
              {formattedDate} {habitName}
            </h4>
            <p className={`text-sm ${isMet ? 'text-green-600' : 'text-gray-500'}`}>
              Цель: {targetValue} {declineUnit && unit ? declineUnit(targetValue, unit) : unit}
              {isMet && ' ✓'}
            </p>
          </div>
          <Modal.CloseButton onClick={onClose} />
        </div>

        {/* Поле ввода с иконками */}
        <div className="mb-6">
          <div className="flex items-center gap-3">
            {/* Поле ввода с встроенными кнопками +/- */}
            <div className="flex-1 flex items-center border border-gray-300 rounded focus-within:border-gray-900 transition-colors overflow-hidden">
              {/* Кнопка уменьшения */}
              <button
                onClick={handleDecrement}
                className="px-3 h-10 flex items-center justify-center transition-transform hover:scale-110"
                title="Уменьшить"
              >
                <span className="text-sm text-gray-600">−</span>
              </button>

              {/* Поле ввода */}
              <input
                ref={inputRef}
                type="text"
                inputMode="decimal"
                value={value}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                className={`flex-1 min-w-0 px-3 py-2 text-center text-sm border-none focus:outline-none`}
                placeholder=""
              />

              {/* Кнопка увеличения */}
              <button
                onClick={handleIncrement}
                className="px-3 h-10 flex items-center justify-center transition-transform hover:scale-110"
                title="Увеличить"
              >
                <span className="text-sm text-gray-600">+</span>
              </button>
            </div>

            {/* Иконки действий */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Иконка очистки */}
              <button
                onClick={handleClear}
                className="w-8 h-8 rounded-full bg-white border border-gray-300 hover:border-gray-400 transition-colors flex items-center justify-center"
                title="Очистить прогресс"
              >
                <Eraser className="w-4 h-4 text-gray-600" />
              </button>

              {/* Иконка заморозки */}
              <button
                onClick={handleFreeze}
                className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors flex items-center justify-center"
                title="Заморозить привычку"
              >
                <Pause className="w-3.5 h-3.5 text-gray-600" />
              </button>

              {/* Иконка галочки (установить цель) */}
              {targetValue !== undefined && (
                <button
                  onClick={handleSetTarget}
                  className="w-8 h-8 rounded-full bg-gray-900 hover:bg-gray-800 transition-colors flex items-center justify-center"
                  title={`Установить цель: ${targetValue} ${declineUnit && unit ? declineUnit(targetValue, unit) : unit}`}
                >
                  <Check className="w-4 h-4 text-white" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Кнопки действий */}
        <div className="flex gap-3">
          <Button
            variant="secondary"
            onClick={onClose}
            className="flex-1 rounded-xl text-sm"
          >
            Отмена
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