/**
 * Хук для получения локализованных групп единиц измерения для привычек
 * 
 * Формирует группы единиц на основе текущего языка приложения.
 * 
 * @module entities/habit/lib/useHabitUnitGroups
 * @created 2 декабря 2025
 */

import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { UnitGroup } from '@/shared/ui/unit-picker';

/**
 * Хук для получения локализованных групп единиц измерения
 * 
 * Возвращает массив групп единиц измерения, где все названия групп
 * и единиц переведены на текущий язык приложения.
 */
export function useHabitUnitGroups(): UnitGroup[] {
  const { t } = useTranslation('units');

  return useMemo(
    () => [
      // Группа: Счёт (Count)
      {
        label: t('units.groups.counting'),
        units: [
          t('units.counting.times'),
          t('units.counting.pieces'),
          t('units.counting.points'),
          t('units.counting.sets'),
          t('units.counting.tasks'),
        ],
      },
      
      // Группа: Время (Time)
      {
        label: t('units.groups.time'),
        units: [
          t('units.time.minutes'),
          t('units.time.hours'),
        ],
      },
      
      // Группа: Расстояние и движение (Distance and Movement)
      {
        label: t('units.groups.distance'),
        units: [
          t('units.distance.steps'),
          t('units.distance.kilometers'),
          t('units.distance.meters'),
        ],
      },
      
      // Группа: Здоровье и питание (Health and Nutrition)
      {
        label: t('units.groups.health'),
        units: [
          t('units.calories.calories'),
          t('units.weight.kilograms'),
          t('units.weight.grams'),
          t('units.volume.glasses'),
          t('units.volume.liters'),
          t('units.volume.milliliters'),
          t('units.volume.portions'),
          t('units.volume.cups'),
        ],
      },
      
      // Группа: Чтение и обучение (Reading and Learning)
      {
        label: t('units.groups.reading'),
        units: [
          t('units.reading.pages'),
          t('units.reading.words'),
          t('units.reading.chapters'),
        ],
      },
      
      // Группа: Финансы (Finance)
      {
        label: t('units.groups.finance'),
        units: [
          t('units.currency.rub'),
          t('units.currency.usd'),
          t('units.currency.eur'),
        ],
      },
    ],
    [t]
  );
}
