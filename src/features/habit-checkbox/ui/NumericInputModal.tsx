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
 * @module features/habit-checkbox/ui/NumericInputModal
 * @migrated 30 ноября 2025 - миграция на FSD
 */

import React, { useState, useEffect, useRef } from 'react';
import { Modal } from '@/shared/ui/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eraser, Pause, Check } from '@/shared/assets/icons/system';
import { useTranslation } from 'react-i18next';
import { declineUnit as declineUnitFn } from '@/shared/lib/text';

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
  const { t, i18n } = useTranslation('habits');
  const { t: tCommon } = useTranslation('common');
  const currentLanguage = i18n.language;
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
    <>
      {isOpen && (
        <Modal.Root level="modal" onClose={onClose}>
          <Modal.Backdrop onClick={onClose} />
          <Modal.Content size="xs">
            <Modal.Header 
              title={`${formattedDate} ${habitName}`}
              subtitle={
                <span className={isMet ? 'text-accent' : 'text-text-tertiary'}>
                  {t('habit.target')}: {targetValue} {unit ? declineUnitFn(targetValue, unit, t, currentLanguage) : ''}
                  {isMet && ' ✓'}
                </span>
              }
              onClose={onClose}
            />

        {/* Поле ввода с иконками */}
        <div className="px-6 pt-6 pb-6">
          <div className="flex items-center gap-3">
            {/* Поле ввода с встроенными кнопками +/- */}
            <div className="flex-1 flex items-center border border-border rounded focus-within:border-primary transition-colors overflow-hidden">
              {/* Кнопка уменьшения */}
              <Button
                type="button"
                variant="ghost"
                onClick={handleDecrement}
                className="px-3 h-10 flex items-center justify-center transition-transform hover:scale-110 rounded-none hover:bg-transparent"
                title={t('habit.decrease')}
              >
                <span className="text-sm text-text-secondary">−</span>
              </Button>

              {/* Поле ввода */}
              <Input
                ref={inputRef}
                type="text"
                inputMode="decimal"
                variant="borderless"
                value={value}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                className="flex-1 min-w-0"
                placeholder=""
              />

              {/* Кнопка увеличения */}
              <Button
                type="button"
                variant="ghost"
                onClick={handleIncrement}
                className="px-3 h-10 flex items-center justify-center transition-transform hover:scale-110 rounded-none hover:bg-transparent"
                title={t('habit.increase')}
              >
                <span className="text-sm text-text-secondary">+</span>
              </Button>
            </div>

            {/* Иконки действий */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Иконка очистки */}
              <Button
                type="button"
                variant="outline"
                onClick={handleClear}
                className="w-8 h-8 p-0 rounded-full bg-background border-border hover:border-border-hover transition-colors flex items-center justify-center"
                title={t('habit.clearProgress')}
              >
                <Eraser className="w-4 h-4 text-text-secondary" />
              </Button>

              {/* Иконка заморозки */}
              <Button
                type="button"
                variant="outline"
                onClick={handleFreeze}
                className="w-8 h-8 p-0 rounded-full bg-background-secondary hover:bg-background-tertiary transition-colors flex items-center justify-center"
                title={t('habit.freeze')}
              >
                <Pause className="w-3.5 h-3.5 text-text-secondary" />
              </Button>

              {/* Иконка галочки (установить цель) */}
              {targetValue !== undefined && (
                <Button
                  type="button"
                  variant="default"
                  onClick={handleSetTarget}
                  className="w-8 h-8 p-0 rounded-full bg-primary hover:bg-primary-hover transition-colors flex items-center justify-center"
                  title={`${t('habit.setTarget')}: ${targetValue} ${unit ? declineUnitFn(targetValue, unit, t, currentLanguage) : ''}`}
                >
                  <Check className="w-4 h-4 text-primary-foreground" />
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Кнопки действий */}
        <Modal.Footer>
          <Button
            variant="outline"
            onClick={onClose}
          >
            {tCommon('common.cancel')}
          </Button>
          <Button
            variant="default"
            onClick={handleSave}
          >
            {t('common:common.save')}
          </Button>
        </Modal.Footer>
          </Modal.Content>
        </Modal.Root>
      )}
    </>
  );
}