/**
 * Модальное окно добавления/редактирования привычки
 * 
 * Трёхшаговый визард для создания новой привычки или редактирования существующей.
 * Использует локальное состояние формы из Zustand store (addHabitForm slice).
 * 
 * Шаги:
 * 1. Основная информация (название, иконка, категория, тип)
 * 2. Настройки измеримой привычки (цель, единица) - только для measurable
 * 3. Детали (частота, напоминания, заметки)
 * 
 * @module modules/habit-tracker/features/habits/components/AddHabitModal
 * @migrated 22 ноября 2025
 */

import React, { useEffect, useRef } from 'react';
import { Modal } from '@/shared/constructors/modal';
import { AddHabitModalProps } from '../types';
import { useHabitsStore } from '@/core/store';
import { useShallow } from 'zustand/react/shallow';
import { useFrequencyModal } from '../hooks';
import { ModalFooter } from './add';
import { HabitType } from '../types';
import {
  FrequencyModal,
  HabitBasicInfoStep,
  HabitMeasurableStep,
  HabitDetailsStep,
} from './add';

export const AddHabitModal: React.FC<AddHabitModalProps> = ({
  onClose,
  onAdd,
  daysInMonth,
  isEditing,
  initialData,
}) => {
  // Получаем состояние и actions из store с useShallow для оптимизации
  const {
    form,
    habits,
    sections,
    addSection,
    deleteSection,
    initializeAddHabitForm,
    resetAddHabitForm,
    setFormName,
    setFormDescription,
    setFormIcon,
    setFormTags,
    setFormSection,
    setFormType,
    setFormFrequency,
    setFormCurrentStep,
    setFormOpenPicker,
    setFormCurrentIconPage,
    setFormUnit,
    setFormTargetValue,
    setFormTargetType,
    addFormReminder,
    deleteFormReminder,
    toggleFormReminder,
    updateFormReminderTime,
    handleFormNextStep,
    handleFormPreviousStep,
    getFormTotalSteps,
    getFormDisplayStep,
    canProceedFromFormStep1,
    canProceedFromFormStep2,
    canSubmitForm,
    getFormData,
  } = useHabitsStore(
    useShallow((state) => ({
      form: state.addHabitForm,
      habits: state.habits,
      sections: state.sections,
      addSection: state.addSection,
      deleteSection: state.deleteSection,
      initializeAddHabitForm: state.initializeAddHabitForm,
      resetAddHabitForm: state.resetAddHabitForm,
      setFormName: state.setFormName,
      setFormDescription: state.setFormDescription,
      setFormIcon: state.setFormIcon,
      setFormTags: state.setFormTags,
      setFormSection: state.setFormSection,
      setFormType: state.setFormType,
      setFormFrequency: state.setFormFrequency,
      setFormCurrentStep: state.setFormCurrentStep,
      setFormOpenPicker: state.setFormOpenPicker,
      setFormCurrentIconPage: state.setFormCurrentIconPage,
      setFormUnit: state.setFormUnit,
      setFormTargetValue: state.setFormTargetValue,
      setFormTargetType: state.setFormTargetType,
      addFormReminder: state.addFormReminder,
      deleteFormReminder: state.deleteFormReminder,
      toggleFormReminder: state.toggleFormReminder,
      updateFormReminderTime: state.updateFormReminderTime,
      handleFormNextStep: state.handleFormNextStep,
      handleFormPreviousStep: state.handleFormPreviousStep,
      getFormTotalSteps: state.getFormTotalSteps,
      getFormDisplayStep: state.getFormDisplayStep,
      canProceedFromFormStep1: state.canProceedFromFormStep1,
      canProceedFromFormStep2: state.canProceedFromFormStep2,
      canSubmitForm: state.canSubmitForm,
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

  // Хук модального окна частоты
  const frequencyModal = useFrequencyModal(form.frequency);

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

  const handleSaveFrequency = () => {
    const newFrequency = frequencyModal.save();
    setFormFrequency(newFrequency);
  };

  const handleSubmit = () => {
    if (!canSubmitForm()) return;

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

  return (
    <>
      <Modal.Root level="modal" onClose={handleClose}>
        <Modal.Backdrop onClick={handleClose} />
        <Modal.Content size="xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <h4 className="text-gray-900">Новая привычка</h4>
              <p className="text-sm text-gray-500 mt-1">
                Шаг {getFormDisplayStep()} из {getFormTotalSteps()}
              </p>
            </div>
            <Modal.CloseButton onClick={handleClose} />
          </div>

          {/* Content - Step 1 */}
          {form.currentStep === 1 && (
            <HabitBasicInfoStep
              nameInputRef={nameInputRef}
              name={form.name}
              onNameChange={setFormName}
              icon={form.icon}
              onIconChange={setFormIcon}
              tags={form.tags}
              onTagsChange={setFormTags}
              section={form.section}
              onSectionChange={setFormSection}
              sections={sections}
              onAddSection={addSection}
              onDeleteSection={deleteSection}
              getSectionUsageCount={(name) => habits.filter(h => h.section === name).length}
              type={form.type}
              onTypeChange={setFormType}
              openPicker={form.openPicker}
              onOpenPickerChange={setFormOpenPicker}
              currentIconPage={form.currentIconPage}
              onIconPageChange={setFormCurrentIconPage}
            />
          )}

          {/* Content - Step 2 (только для measurable) */}
          {form.currentStep === 2 && form.type === 'measurable' && (
            <HabitMeasurableStep
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

          {/* Content - Step 3 */}
          {form.currentStep === 3 && (
            <HabitDetailsStep
              frequency={form.frequency}
              onOpenFrequencyModal={frequencyModal.open}
              reminders={form.reminders}
              onToggleReminder={toggleFormReminder}
              onUpdateReminderTime={updateFormReminderTime}
              onDeleteReminder={deleteFormReminder}
              onAddReminder={addFormReminder}
              description={form.description}
              onDescriptionChange={setFormDescription}
            />
          )}

          {/* Footer */}
          <ModalFooter
            currentStep={form.currentStep}
            habitType={form.type}
            onClose={handleClose}
            onPrevious={handleFormPreviousStep}
            onNext={handleFormNextStep}
            onSubmit={handleSubmit}
            canProceedFromStep1={canProceedFromFormStep1()}
            canProceedFromStep2={canProceedFromFormStep2()}
            canSubmit={canSubmitForm()}
          />
        </Modal.Content>
      </Modal.Root>

      {/* Frequency Editor Modal */}
      <FrequencyModal
        isOpen={frequencyModal.isOpen}
        frequencyType={frequencyModal.editingType}
        frequencyCount={frequencyModal.editingCount}
        frequencyPeriod={frequencyModal.editingPeriod}
        daysOfWeek={frequencyModal.editingDaysOfWeek}
        onFrequencyTypeChange={frequencyModal.setEditingType}
        onFrequencyCountChange={frequencyModal.setEditingCount}
        onFrequencyPeriodChange={frequencyModal.setEditingPeriod}
        onDaysOfWeekChange={frequencyModal.setEditingDaysOfWeek}
        onSave={handleSaveFrequency}
        onCancel={frequencyModal.cancel}
      />
    </>
  );
};