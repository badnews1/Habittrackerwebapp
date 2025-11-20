import React from 'react';
import { ArrowLeft } from '../icons';
import { HabitType } from '../../types/habit';
import { Button } from '../common';

interface ModalFooterProps {
  currentStep: 1 | 2 | 3;
  habitType: HabitType;
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
  canProceedFromStep1: boolean;
  canProceedFromStep2: boolean;
  canSubmit: boolean;
}

export const ModalFooter: React.FC<ModalFooterProps> = ({
  currentStep,
  habitType,
  onClose,
  onPrevious,
  onNext,
  onSubmit,
  canProceedFromStep1,
  canProceedFromStep2,
  canSubmit,
}) => {
  // Step 1: Cancel + Next
  if (currentStep === 1) {
    return (
      <div className="p-6 border-t border-gray-200 flex gap-3">
        <Button
          variant="secondary"
          onClick={onClose}
          className="flex-[1] text-center"
        >
          Отмена
        </Button>
        <Button
          variant="primary"
          onClick={onNext}
          disabled={!canProceedFromStep1}
          className="flex-[2] text-center"
        >
          Далее
        </Button>
      </div>
    );
  }

  // Step 2 (only for measurable): Back + Next
  if (currentStep === 2 && habitType === 'measurable') {
    return (
      <div className="p-6 border-t border-gray-200 flex gap-3">
        <Button
          variant="secondary"
          onClick={onPrevious}
          className="flex-[1] gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Назад
        </Button>
        <Button
          variant="primary"
          onClick={onNext}
          disabled={!canProceedFromStep2}
          className="flex-[2] text-center"
        >
          Далее
        </Button>
      </div>
    );
  }

  // Step 3 (final step): Back + Submit
  return (
    <div className="p-6 border-t border-gray-200 flex gap-3">
      <Button
        variant="secondary"
        onClick={onPrevious}
        className="flex-[1] gap-2"
      >
        <ArrowLeft className="w-4 h-4" />
        Назад
      </Button>
      <Button
        variant="primary"
        onClick={onSubmit}
        disabled={!canSubmit}
        className="flex-[2] text-center"
      >
        Добавить привычку
      </Button>
    </div>
  );
};