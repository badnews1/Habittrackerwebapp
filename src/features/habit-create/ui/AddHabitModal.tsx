/**
 * Модальное окно добавления/редактирования привычки
 * 
 * @description
 * Форма для создания новой привычки или редактирования существующей.
 * Все поля отображаются в одном окне. Условно показываются настройки
 * измеримой привычки (единицы измерения) только для типа measurable.
 * 
 * @module features/habit-create/ui/AddHabitModal
 * @created 25 ноября 2025
 * @migrated 29 ноября 2025 - на FSD архитектуру
 * @updated 1 декабря 2025 - убрана многошаговая логика, всё в одном окне
 */

import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal } from '@/shared/ui/modal';
import { Button } from '@/components/ui/button';
import { AddHabitModalProps } from '../model/types';
import { HabitType } from '@/entities/habit';
import { useHabitsStore } from '@/app/store';
import { useShallow } from 'zustand/react/shallow';
import {
  HabitBasicInfo,
  HabitMeasurable,
  HabitDetails,
} from './FormFields';

export const AddHabitModal: React.FC<AddHabitModalProps> = ({
  isOpen,
  onClose,
  onAdd,
  daysInMonth,
  isEditing,
  initialData,
}) => {
  const { t } = useTranslation('habits');
  const { t: tCommon } = useTranslation('common');
  
  // Получаем состояние и actions из store с useShallow для оптимизации
  const {
    form,
    initializeAddHabitForm,
    resetAddHabitForm,
    setFormName,
    setFormDescription,
    setFormIcon,
    setFormTags,
    setFormSection,
    setFormType,
    setFormFrequency,
    setFormOpenPicker,
    setFormUnit,
    setFormTargetValue,
    setFormTargetType,
    addFormReminder,
    deleteFormReminder,
    toggleFormReminder,
    updateFormReminderTime,
    getFormData,
  } = useHabitsStore(
    useShallow((state) => ({
      form: state.addHabitForm,
      initializeAddHabitForm: state.initializeAddHabitForm,
      resetAddHabitForm: state.resetAddHabitForm,
      setFormName: state.setFormName,
      setFormDescription: state.setFormDescription,
      setFormIcon: state.setFormIcon,
      setFormTags: state.setFormTags,
      setFormSection: state.setFormSection,
      setFormType: state.setFormType,
      setFormFrequency: state.setFormFrequency,
      setFormOpenPicker: state.setFormOpenPicker,
      setFormUnit: state.setFormUnit,
      setFormTargetValue: state.setFormTargetValue,
      setFormTargetType: state.setFormTargetType,
      addFormReminder: state.addFormReminder,
      deleteFormReminder: state.deleteFormReminder,
      toggleFormReminder: state.toggleFormReminder,
      updateFormReminderTime: state.updateFormReminderTime,
      getFormData: state.getFormData,
    }))
  );

  // Инициализируем форму при монтировании
  useEffect(() => {
    initializeAddHabitForm(
      initialData
        ? {
            name: initialData.name,
            description: initialData.description,
            icon: initialData.icon,
            tag: initialData.tag,
            type: initialData.type as HabitType,
            frequency: initialData.frequency,
            reminders: initialData.reminders,
            unit: initialData.unit,
            targetValue: initialData.targetValue?.toString(),
            targetType: initialData.targetType,
          }
        : undefined
    );

    // Очистка при размонтировании
    return () => {
      resetAddHabitForm();
    };
  }, []);

  const nameInputRef = useRef<HTMLInputElement>(null);

  // Автофокус на поле ввода названия
  useEffect(() => {
    if (nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, []);

  const handleClose = () => {
    resetAddHabitForm();
    onClose();
  };

  const handleSubmit = () => {
    // Проверяем что название заполнено
    if (!form.name.trim()) return;

    const data = getFormData();
    onAdd({
      name: data.name,
      description: data.description,
      icon: data.icon,
      tags: data.tags,
      section: data.section,
      frequency: data.frequency,
      type: data.type,
      reminders: data.reminders,
      unit: data.unit,
      targetValue: data.targetValue ? parseFloat(data.targetValue) : undefined,
      targetType: data.targetType,
    });
    
    resetAddHabitForm();
    onClose();
  };

  // Проверка возможности отправить форму
  const canSubmit = form.name.trim().length > 0;

  return (
    <>
      {isOpen && (
        <Modal.Root level="modal" onClose={handleClose}>
          <Modal.Backdrop onClick={handleClose} />
          <Modal.Content size="md">
            <Modal.Header 
              title={isEditing ? t('form.editHabit') : t('form.newHabit')}
              onClose={handleClose}
            />

            {/* Content — все поля в одном окне, фиксированная высота с прокруткой */}
            <div className="px-6 py-6 space-y-6 overflow-y-auto max-h-[60vh]">
              {/* Основная информация */}
              <HabitBasicInfo
                nameInputRef={nameInputRef}
                name={form.name}
                onNameChange={setFormName}
                icon={form.icon}
                onIconChange={setFormIcon}
                tags={form.tags}
                onTagsChange={setFormTags}
                section={form.section}
                onSectionChange={setFormSection}
                type={form.type}
                onTypeChange={setFormType}
                openPicker={form.openPicker}
                onOpenPickerChange={setFormOpenPicker}
              />

              {/* Настройки измеримой привычки — показываем только для measurable */}
              {form.type === 'measurable' && (
                <HabitMeasurable
                  unit={form.measurable.unit}
                  onUnitChange={setFormUnit}
                  targetType={form.measurable.targetType}
                  onTargetTypeChange={setFormTargetType}
                  targetValue={form.measurable.targetValue}
                  onTargetValueChange={setFormTargetValue}
                  openPicker={form.openPicker}
                  onOpenPickerChange={setFormOpenPicker}
                />
              )}

              {/* Детали */}
              <HabitDetails
                frequency={form.frequency}
                onFrequencyChange={setFormFrequency}
                reminders={form.reminders}
                onToggleReminder={toggleFormReminder}
                onUpdateReminderTime={updateFormReminderTime}
                onDeleteReminder={deleteFormReminder}
                onAddReminder={addFormReminder}
                description={form.description}
                onDescriptionChange={setFormDescription}
              />
            </div>

            {/* Footer — простые кнопки Отмена + Добавить */}
            <Modal.Footer>
              <Button
                variant="outline"
                onClick={handleClose}
                className="text-center"
              >
                {tCommon('common.cancel')}
              </Button>
              <Button
                variant="default"
                onClick={handleSubmit}
                disabled={!canSubmit}
                className="text-center"
              >
                {isEditing ? t('common:common.save') : t('habit.addHabit')}
              </Button>
            </Modal.Footer>
          </Modal.Content>
        </Modal.Root>
      )}
    </>
  );
};