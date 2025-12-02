/**
 * HabitsFilterDropdown - умный компонент для фильтрации привычек
 * 
 * @description
 * "Умный" компонент, который:
 * - Использует хук useHabitsFilter для логики фильтрации
 * - Подготавливает данные из entities/habit с помощью утилит
 * - Передаёт секции фильтров в generic FilterDropdown
 * 
 * Интеграция:
 * - Логика: features/habit-filters/lib/useHabitsFilter
 * - Утилиты: entities/habit/lib/filters
 * - UI: shared/ui/filter-dropdown/FilterDropdown
 * 
 * @module features/habit-filters/ui
 * @created 29 ноября 2025 - рефакторинг на FSD архитектуру
 * @updated 30 ноября 2025 - переименование из filter-habits в habit-filters
 * @updated 30 ноября 2025 - исправлен антипаттерн: useMemo → useEffect для side-effects
 */

import { useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTranslatedTagName } from '@/entities/tag';
import type { Habit } from '@/entities/habit';
import {
  getUniqueSections,
  countByTag,
  countBySection,
  countByType,
  countUncategorized,
  hasUncategorizedHabits,
} from '@/entities/habit';
import type { FilterSection } from '@/shared/types';
import { FilterDropdown } from '@/shared/ui/filter-dropdown';
import { useHabitsFilter } from '../lib/useHabitsFilter';

interface Tag {
  name: string;
  color?: string;
}

interface HabitsFilterDropdownProps {
  /** Массив привычек для фильтрации */
  habits: Habit[];
  /** Массив тегов для отображения в фильтре */
  tags: Tag[];
  /** Открыт ли dropdown */
  isOpen: boolean;
  /** Callback для переключения открытия/закрытия */
  onToggleOpen: () => void;
  /** Дополнительные CSS классы */
  className?: string;
  /** Callback для получения отфильтрованных привычек */
  onFilteredHabitsChange?: (filteredHabits: Habit[]) => void;
}

/**
 * Умный компонент для фильтрации привычек
 * 
 * @example
 * ```tsx
 * const [isOpen, setIsOpen] = useState(false);
 * 
 * <HabitsFilterDropdown
 *   habits={habits}
 *   tags={tags}
 *   isOpen={isOpen}
 *   onToggleOpen={() => setIsOpen(!isOpen)}
 *   onFilteredHabitsChange={(filtered) => setFilteredHabits(filtered)}
 * />
 * ```
 */
export function HabitsFilterDropdown({
  habits,
  tags,
  isOpen,
  onToggleOpen,
  className,
  onFilteredHabitsChange,
}: HabitsFilterDropdownProps) {
  const { t } = useTranslation('habits');
  const getTranslatedTagName = useTranslatedTagName();
  
  // Используем хук фильтрации
  const { state, actions, result } = useHabitsFilter(habits);

  // Передаём отфильтрованные привычки наверх (если нужно)
  useEffect(() => {
    if (onFilteredHabitsChange) {
      onFilteredHabitsChange(result.filteredHabits);
    }
  }, [result.filteredHabits, onFilteredHabitsChange]);

  // Подсчёт количества привычек
  const counts = useMemo(() => ({
    tags: countByTag(habits),
    sections: countBySection(habits),
    types: countByType(habits),
    uncategorized: countUncategorized(habits),
  }), [habits]);

  // Получаем уникальные секции
  const availableSections = useMemo(() => getUniqueSections(habits), [habits]);

  // Подготавливаем секции фильтров для generic компонента
  const filterSections: FilterSection[] = useMemo(() => {
    const sections: FilterSection[] = [];

    // Секция "Теги"
    const tagOptions = [];
    
    // Опция "Без тега"
    if (hasUncategorizedHabits(habits)) {
      tagOptions.push({
        id: 'uncategorized',
        label: t('manage.filters.uncategorized'),
        checked: state.showUncategorized,
        count: counts.uncategorized,
        onChange: actions.toggleUncategorized,
      });
    }
    
    // Опции для каждого тега
    tags.forEach((tag) => {
      const translatedName = getTranslatedTagName(tag.name);
      tagOptions.push({
        id: tag.name,
        label: translatedName,
        checked: state.selectedCategories.has(tag.name),
        count: counts.tags.get(tag.name) || 0,
        onChange: () => actions.toggleCategory(tag.name),
      });
    });

    sections.push({
      id: 'tags',
      title: t('manage.filters.tags'),
      options: tagOptions,
    });

    // Секция "Разделы"
    const sectionOptions = availableSections.map((section) => ({
      id: section,
      label: section,
      checked: state.selectedSections.has(section),
      count: counts.sections.get(section) || 0,
      onChange: () => actions.toggleSection(section),
    }));

    sections.push({
      id: 'sections',
      title: t('manage.filters.sections'),
      options: sectionOptions,
    });

    // Секция "Тип отслеживания"
    sections.push({
      id: 'types',
      title: t('manage.filters.trackingType'),
      options: [
        {
          id: 'binary',
          label: t('habit.types.binary'),
          checked: state.selectedTypes.has('binary'),
          count: counts.types.binary,
          onChange: () => actions.toggleType('binary'),
        },
        {
          id: 'measurable',
          label: t('habit.types.measurable'),
          checked: state.selectedTypes.has('measurable'),
          count: counts.types.measurable,
          onChange: () => actions.toggleType('measurable'),
        },
      ],
    });

    return sections;
  }, [habits, tags, state, actions, counts, availableSections, t]);

  return (
    <FilterDropdown
      sections={filterSections}
      hasActiveFilters={result.hasActiveFilters}
      onClearAll={actions.clearAllFilters}
      isOpen={isOpen}
      onToggleOpen={onToggleOpen}
      className={className}
    />
  );
}