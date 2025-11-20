import React, { useEffect, useRef } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { Modal } from '../modal';
import { AddHabitModalProps } from '../../types/addHabitModal';
import { useHabitsStore } from '../../stores/habitsStore';
import { useFrequencyModal } from '../../hooks/useFrequencyModal';
import { ModalFooter } from '../modals/ModalFooter';
import { HabitType } from '../../types/habit';
import {
  FrequencyModal,
  HabitBasicInfoStep,
  HabitMeasurableStep,
  HabitDetailsStep,
} from './add';

export const AddHabitModal: React.FC<AddHabitModalProps> = ({
  onClose,
  onAdd,
  categories,
  onAddCategory,
  onDeleteCategory,
  onUpdateCategoryColor,
  daysInMonth,
  allHabits,
  isEditing,
  initialData,
}) => {
  // Получаем состояние и actions из store с useShallow для оптимизации
  const {
    form,
    initializeAddHabitForm,
    resetAddHabitForm,
    setFormName,
    setFormDescription,
    setFormIcon,
    setFormCategory,
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
      initializeAddHabitForm: state.initializeAddHabitForm,
      resetAddHabitForm: state.resetAddHabitForm,
      setFormName: state.setFormName,
      setFormDescription: state.setFormDescription,
      setFormIcon: state.setFormIcon,
      setFormCategory: state.setFormCategory,
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
            category: initialData.category,
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
      category: data.category,
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
      <Modal.Root level="dialog" onClose={handleClose}>
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
              category={form.category}
              onCategoryChange={setFormCategory}
              type={form.type}
              onTypeChange={setFormType}
              categories={categories}
              onAddCategory={onAddCategory}
              onDeleteCategory={onDeleteCategory}
              onUpdateCategoryColor={onUpdateCategoryColor}
              allHabits={allHabits}
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