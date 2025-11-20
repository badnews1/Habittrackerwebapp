import { useState } from 'react';
import { Modal } from '../modal';
import { Button } from '../common';
import { MODAL_STYLES } from '../../constants/styles';

export function MonthYearPicker({
  selectedMonth,
  selectedYear,
  onSelect,
  onClose,
}: {
  selectedMonth: number;
  selectedYear: number;
  onSelect: (month: number, year: number) => void;
  onClose: () => void;
}) {
  const [tempYear, setTempYear] = useState(selectedYear);
  const [tempMonth, setTempMonth] = useState(selectedMonth);

  const months = [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear + i); // 2025-2034

  return (
    <Modal.Root level="modal" onClose={onClose}>
      <Modal.Backdrop onClick={onClose} />
      <Modal.Content size="xl">
        {/* Header */}
        <div className={MODAL_STYLES.header}>
          <div>
            <h4 className="text-gray-900">Выбор периода</h4>
            <p className="text-sm text-gray-500 mt-1">Для навигации по календарю</p>
          </div>
          <Modal.CloseButton onClick={onClose} />
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="space-y-6">
            {/* Year Selector */}
            <div>
              <label className="block text-gray-700 mb-3">Год</label>
              <div className="grid grid-cols-5 gap-2">
                {years.map((year) => (
                  <button
                    key={year}
                    onClick={() => setTempYear(year)}
                    className={`px-3 py-2 rounded-xl transition-all ${
                      tempYear === year
                        ? 'bg-gray-900 text-white'
                        : 'bg-gray-50 text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    {year}
                  </button>
                ))}
              </div>
            </div>

            {/* Month Selector */}
            <div>
              <label className="block text-gray-700 mb-3">Месяц</label>
              <div className="grid grid-cols-3 gap-2">
                {months.map((month, index) => (
                  <button
                    key={index}
                    onClick={() => setTempMonth(index)}
                    className={`px-3 py-2 rounded-xl transition-all ${
                      tempMonth === index
                        ? 'bg-gray-900 text-white'
                        : 'bg-gray-50 text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    {month}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={MODAL_STYLES.footer}>
          <div className="flex gap-3">
            <Button
              variant="secondary"
              onClick={onClose}
              className="flex-1 rounded-full border-gray-200 hover:border-gray-300"
            >
              Отмена
            </Button>
            <Button
              variant="primary"
              onClick={() => onSelect(tempMonth, tempYear)}
              className="flex-1 rounded-full"
            >
              Применить
            </Button>
          </div>
        </div>
      </Modal.Content>
    </Modal.Root>
  );
}