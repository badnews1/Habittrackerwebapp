/**
 * Select picker для выбора типа привычки
 * 
 * @description
 * Позволяет выбрать между:
 * - Простая отметка (binary) - для привычек, которые либо выполнены, либо нет
 * - Ввод числа (measurable) - для привычек, где нужно достичь числовой цели
 * 
 * @module entities/habit/ui/HabitTypePicker
 * @created 29 ноября 2025 - переход с кастомного Dropdown на shadcn Select
 * @migrated 1 декабря 2025 - перенос в /entities/habit/ui/ для консистентности
 */

import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { HabitType } from '@/entities/habit';

interface HabitTypePickerProps {
  selectedType: HabitType;
  onSelectType: (type: HabitType) => void;
}

export const HabitTypePicker: React.FC<HabitTypePickerProps> = ({
  selectedType,
  onSelectType,
}) => {
  const { t } = useTranslation('habits');
  
  return (
    <Select 
      value={selectedType} 
      onValueChange={(value) => onSelectType(value as HabitType)}
    >
      <SelectTrigger className="w-full">
        <SelectValue>
          {selectedType === 'binary' ? t('typePicker.binaryTitle') : t('typePicker.measurableTitle')}
        </SelectValue>
      </SelectTrigger>
      
      <SelectContent>
        <SelectItem value="binary">
          <div>
            <div className="font-medium">{t('typePicker.binaryTitle')}</div>
            <div className="text-xs text-text-secondary mt-0.5">
              {t('typePicker.binaryDescription')}
            </div>
            <div className="text-xs text-text-secondary">
              {t('typePicker.binaryExample')}
            </div>
          </div>
        </SelectItem>
        
        <SelectItem value="measurable">
          <div>
            <div className="font-medium">{t('typePicker.measurableTitle')}</div>
            <div className="text-xs text-text-secondary mt-0.5">
              {t('typePicker.measurableDescription')}
            </div>
            <div className="text-xs text-text-secondary">
              {t('typePicker.measurableExample')}
            </div>
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  );
};