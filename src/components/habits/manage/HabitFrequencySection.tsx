import React, { useState } from 'react';
import { ChevronDown } from '../../icons';
import { Habit } from '../../../types/habit';
import { FrequencyModal } from '../add/FrequencyModal';
import { formatFrequency } from '../../../utils/habitUtils';

interface HabitFrequencySectionProps {
  habitId: string;
  frequency: Habit['frequency'];
  onUpdateFrequency: (id: string, frequency: Habit['frequency']) => void;
}

/**
 * Frequency settings section with modal editor
 * Displays current frequency and opens modal to edit
 */
export const HabitFrequencySection: React.FC<HabitFrequencySectionProps> = ({
  habitId,
  frequency,
  onUpdateFrequency,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFrequencyType, setEditingFrequencyType] = useState<Habit['frequency']['type']>('daily');
  const [editingFrequencyCount, setEditingFrequencyCount] = useState<number>(7);
  const [editingFrequencyPeriod, setEditingFrequencyPeriod] = useState<number>(7);
  const [editingDaysOfWeek, setEditingDaysOfWeek] = useState<number[]>([0, 1, 2, 3, 4]);
  
  // Temporary backup for cancel functionality
  const [frequencyBackup, setFrequencyBackup] = useState<{
    type: Habit['frequency']['type'];
    count: number;
    period: number;
    daysOfWeek: number[];
  } | null>(null);

  const handleOpenModal = () => {
    const freq = frequency || { type: 'daily' as const };
    setEditingFrequencyType(freq.type);
    setEditingFrequencyCount(freq.count || 7);
    setEditingFrequencyPeriod(freq.period || 7);
    setEditingDaysOfWeek(freq.daysOfWeek || [0, 1, 2, 3, 4]);
    
    // Save backup before opening modal
    setFrequencyBackup({
      type: freq.type,
      count: freq.count || 7,
      period: freq.period || 7,
      daysOfWeek: freq.daysOfWeek || [0, 1, 2, 3, 4],
    });
    
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    // Restore backup values on cancel
    if (frequencyBackup) {
      setEditingFrequencyType(frequencyBackup.type);
      setEditingFrequencyCount(frequencyBackup.count);
      setEditingFrequencyPeriod(frequencyBackup.period);
      setEditingDaysOfWeek(frequencyBackup.daysOfWeek);
    }
    setIsModalOpen(false);
  };

  const handleSave = () => {
    // Validate and fill default values if empty before saving
    let finalCount = editingFrequencyCount;
    let finalPeriod = editingFrequencyPeriod;
    
    // Apply defaults based on active frequency type
    if (editingFrequencyType === 'every_n_days') {
      finalPeriod = editingFrequencyPeriod || 5;
    } else if (editingFrequencyType === 'n_times_week') {
      finalCount = editingFrequencyCount || 5;
    } else if (editingFrequencyType === 'n_times_month') {
      finalCount = editingFrequencyCount || 10;
    } else if (editingFrequencyType === 'n_times_in_m_days') {
      finalCount = editingFrequencyCount || 5;
      finalPeriod = editingFrequencyPeriod || 14;
    }
    
    onUpdateFrequency(habitId, {
      type: editingFrequencyType,
      count: finalCount,
      period: finalPeriod,
      daysOfWeek: editingFrequencyType === 'by_days_of_week' ? editingDaysOfWeek : undefined,
    });
    
    setIsModalOpen(false);
  };

  return (
    <>
      {/* Frequency Button */}
      <div className="mt-3 pb-3 border-b border-gray-100">
        <label className="text-xs text-gray-500 mb-1 block">Частота</label>
        <button
          onClick={handleOpenModal}
          className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded text-sm text-gray-700 hover:bg-gray-100 hover:border-gray-300 transition-colors cursor-pointer text-left flex items-center gap-2"
        >
          <span className="flex-1">{formatFrequency(frequency)}</span>
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </button>
      </div>

      {/* Frequency Editor Modal */}
      {isModalOpen && (
        <FrequencyModal
          isOpen={isModalOpen}
          frequencyType={editingFrequencyType}
          frequencyCount={editingFrequencyCount}
          frequencyPeriod={editingFrequencyPeriod}
          daysOfWeek={editingDaysOfWeek}
          onFrequencyTypeChange={setEditingFrequencyType}
          onFrequencyCountChange={setEditingFrequencyCount}
          onFrequencyPeriodChange={setEditingFrequencyPeriod}
          onDaysOfWeekChange={setEditingDaysOfWeek}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}
    </>
  );
};