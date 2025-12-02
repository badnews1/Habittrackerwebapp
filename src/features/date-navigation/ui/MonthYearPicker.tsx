/**
 * Модальное окно выбора месяца и года для навигации по датам
 * 
 * @module features/date-navigation
 * @updated 2 декабря 2025 - исправлен namespace для переводов (изменен заголовок на "Выбор периода")
 */

import React, { useState } from 'react';
import { Modal } from '@/shared/ui/modal';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useTranslation } from 'react-i18next';

export function MonthYearPicker({
  isOpen,
  selectedMonth,
  selectedYear,
  onSelect,
  onClose,
}: {
  isOpen: boolean;
  selectedMonth: number;
  selectedYear: number;
  onSelect: (month: number, year: number) => void;
  onClose: () => void;
}) {
  const { t } = useTranslation(['common', 'habits']);
  const [tempYear, setTempYear] = useState(selectedYear);
  const [tempMonth, setTempMonth] = useState(selectedMonth);

  // Месяцы из переводов
  const months = [
    t('months.full.january'),
    t('months.full.february'),
    t('months.full.march'),
    t('months.full.april'),
    t('months.full.may'),
    t('months.full.june'),
    t('months.full.july'),
    t('months.full.august'),
    t('months.full.september'),
    t('months.full.october'),
    t('months.full.november'),
    t('months.full.december'),
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear + i); // 2025-2034

  return (
    <>
      {isOpen && (
        <Modal.Root level="modal" onClose={onClose}>
          <Modal.Backdrop onClick={onClose} />
          <Modal.Content size="md">
            <Modal.Header 
              title={t('calendar.selectPeriod', { ns: 'habits' })}
              onClose={onClose}
            />

            {/* Content */}
            <div className="p-6">
              <div className="space-y-6">
                {/* Year Selector */}
                <div>
                  <Label>{t('common.year')}</Label>
                  <div className="grid grid-cols-5 gap-2 mt-2">
                    {years.map((year) => (
                      <Button
                        key={year}
                        onClick={() => setTempYear(year)}
                        variant={tempYear === year ? 'default' : 'secondary'}
                      >
                        {year}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Month Selector */}
                <div>
                  <Label>{t('common.month')}</Label>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {months.map((month, index) => (
                      <Button
                        key={index}
                        onClick={() => setTempMonth(index)}
                        variant={tempMonth === index ? 'default' : 'secondary'}
                      >
                        {month}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <Modal.Footer>
              <Button
                variant="outline"
                onClick={onClose}
              >
                {t('common.cancel')}
              </Button>
              <Button
                variant="default"
                onClick={() => onSelect(tempMonth, tempYear)}
              >
                {t('common.apply')}
              </Button>
            </Modal.Footer>
          </Modal.Content>
        </Modal.Root>
      )}
    </>
  );
}