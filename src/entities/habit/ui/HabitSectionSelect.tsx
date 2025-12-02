/**
 * 🎯 HabitSectionSelect — Domain-специфичный компонент выбора раздела для привычки
 * 
 * Подключается к habit store и управляет разделами привычек.
 * Обёртка над SectionPicker из shared/ui с domain-логикой.
 * 
 * @module entities/habit/ui
 * @created 28 ноября 2025
 */

import React from 'react';
import { useTranslation } from 'react-i18next';
import { SectionPicker } from '@/shared/ui/section-picker';
import { useHabitsStore } from '@/app/store';
import { DEFAULT_SECTIONS_WITH_COLORS } from '@/entities/habit';
import { useTranslatedSectionName } from '@/entities/section';

interface HabitSectionSelectProps {
  /** Выбранный раздел */
  selectedSection: string;
  /** Колбэк выбора раздела */
  onSelectSection: (section: string) => void;
  /** Открыт ли пикер (controlled) */
  open?: boolean;
  /** Колбэк изменения состояния */
  onOpenChange?: (open: boolean) => void;
}

/**
 * HabitSectionSelect - выбор раздела для привычки
 * 
 * Подключается к habit store для получения списка всех привычек
 * и подсчёта использований разделов.
 */
export const HabitSectionSelect: React.FC<HabitSectionSelectProps> = ({
  selectedSection,
  onSelectSection,
  open,
  onOpenChange,
}) => {
  const { t } = useTranslation('common');
  const { t: tUi } = useTranslation('ui');
  const getTranslatedSectionName = useTranslatedSectionName();
  
  const sections = useHabitsStore((state) => state.sections);
  const habits = useHabitsStore((state) => state.habits);
  const addSection = useHabitsStore((state) => state.addSection);
  const updateSectionColor = useHabitsStore((state) => state.updateSectionColor);
  const deleteSection = useHabitsStore((state) => state.deleteSection);

  // Определяем, какие разделы можно удалять (все кроме стандартных)
  const canDelete = (sectionName: string) => {
    const defaultSectionNames = DEFAULT_SECTIONS_WITH_COLORS.map((s) => s.name);
    return !defaultSectionNames.includes(sectionName);
  };

  // Считаем использование раздела
  const getUsageCount = (sectionName: string) => {
    return habits.filter((h) => h.section === sectionName).length;
  };

  // Форматируем сообщение для удаления
  const formatDeleteMessage = (sectionName: string, usageCount?: number) => {
    const translatedName = getTranslatedSectionName(sectionName);
    
    if (!usageCount || usageCount === 0) {
      return `${tUi('ui.deleteSection')} "${translatedName}"?`;
    }
    
    const lastDefaultSection = DEFAULT_SECTIONS_WITH_COLORS[DEFAULT_SECTIONS_WITH_COLORS.length - 1];
    const translatedDefaultSection = getTranslatedSectionName(lastDefaultSection.name);
    
    return `${tUi('ui.deleteSection')} "${translatedName}"?\n\nВ этом разделе ${usageCount} ${
      usageCount === 1 ? t('habits:habitItem.usedInHabit') : t('habits:habitItem.usedInHabits')
    }. Они будут перемещены в раздел "${translatedDefaultSection}".`;
  };

  return (
    <SectionPicker
      sections={sections}
      selectedSection={selectedSection}
      onSelectSection={onSelectSection}
      onAddSection={addSection}
      onUpdateSectionColor={updateSectionColor}
      onDeleteSection={deleteSection}
      canDelete={canDelete}
      getUsageCount={getUsageCount}
      formatDeleteMessage={formatDeleteMessage}
      placeholder={tUi('ui.selectSection')}
      addButtonText={t('common.add')}
      inputPlaceholder={tUi('ui.sectionName')}
      open={open}
      onOpenChange={onOpenChange}
    />
  );
};
