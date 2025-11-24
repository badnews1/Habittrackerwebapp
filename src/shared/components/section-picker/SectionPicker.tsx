/**
 * Generic компонент выбора раздела
 * 
 * Универсальный UI компонент для управления разделами.
 * Используется для организации привычек по времени дня.
 * 
 * @module shared/components/section-picker
 * @created 24 ноября 2025
 */

import React, { useState, useEffect, useRef } from 'react';
import { TEXT_LENGTH_LIMITS } from '@/shared/constants';
import { Button } from '@/shared/components/button';
import { INPUT_STYLES } from '@/shared/constants/styles';
import { Dropdown } from '@/shared/constructors/dropdown';
import { ChevronDown, Plus, X, AlertCircle } from '@/shared/icons';
import { ConfirmDialog } from '@/shared/components/modals';

/**
 * Callback для получения количества привычек в разделе
 */
export type GetSectionUsageCount = (sectionName: string) => number;

export interface SectionPickerProps {
  /** Выбранный раздел */
  selectedSection: string;
  /** Callback выбора раздела */
  onSelectSection: (section: string) => void;
  /** Список разделов */
  sections: string[];
  /** Callback добавления раздела */
  onAddSection: (name: string) => void;
  /** Callback удаления раздела */
  onDeleteSection: (name: string) => void;
  /** Функция для получения количества привычек в разделе */
  getSectionUsageCount: GetSectionUsageCount;
  /** Открыт ли dropdown */
  isOpen: boolean;
  /** Toggle функция */
  onToggle: () => void;
}

/**
 * Внутренний компонент контента SectionPicker
 * Получает доступ к DropdownContext для программного закрытия
 */
interface SectionPickerContentProps {
  selectedSection: string;
  onSelectSection: (section: string) => void;
  sections: string[];
  onAddSection: (name: string) => void;
  getSectionUsageCount: GetSectionUsageCount;
  onDeleteSection: (name: string) => void;
}

function SectionPickerContent({
  selectedSection,
  onSelectSection,
  sections,
  onAddSection,
  getSectionUsageCount,
  onDeleteSection,
}: SectionPickerContentProps) {
  // Получаем доступ к контексту Dropdown для программного закрытия
  const context = Dropdown.useContext();
  
  // Локальное состояние для добавления нового раздела
  const newSectionInputRef = useRef<HTMLInputElement>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newSection, setNewSection] = useState('');
  const [deletingSection, setDeletingSection] = useState<{ name: string; usageCount: number } | null>(null);

  // Автофокус на input при открытии формы добавления
  useEffect(() => {
    if (isAdding && newSectionInputRef.current) {
      // Небольшая задержка для корректного рендера
      setTimeout(() => {
        newSectionInputRef.current?.focus();
      }, 0);
    }
  }, [isAdding]);

  // Сбрасываем состояние добавления при закрытии dropdown
  useEffect(() => {
    if (!context.isOpen) {
      setIsAdding(false);
      setNewSection('');
    }
  }, [context.isOpen]);

  // Валидация: нормализация и проверка дубликатов
  const normalized = newSection.trim().replace(/\s+/g, ' ');
  const alreadyExists = normalized && sections.some(
    s => s.toLowerCase() === normalized.toLowerCase()
  );

  // Добавить раздел
  const handleAdd = () => {
    if (!normalized || alreadyExists) return;
    
    onAddSection(normalized);
    onSelectSection(normalized); // Автоматически выбрать новый раздел
    setNewSection('');
    setIsAdding(false);
  };

  // Обработка выбора раздела
  const handleSelectSection = (section: string) => {
    onSelectSection(section);
    // Закрываем dropdown вручную (для обычных button нужно явно вызывать close)
    context.close();
  };

  // Удалить раздел (с подтверждением)
  const handleDelete = (e: React.MouseEvent, sectionName: string) => {
    e.stopPropagation();
    
    // Защита от удаления "Другие"
    if (sectionName === 'Другие') return;
    
    const usageCount = getSectionUsageCount(sectionName);
    setDeletingSection({ name: sectionName, usageCount });
  };

  const confirmDelete = () => {
    if (!deletingSection) return;
    onDeleteSection(deletingSection.name);
    
    // Если это был выбранный раздел, переключить на "Другие"
    if (selectedSection === deletingSection.name) {
      onSelectSection('Другие');
    }
    
    setDeletingSection(null);
  };

  return (
    <>
      <Dropdown.Content direction="down" width="full" maxHeight="300px" className="p-3">
        {/* Список разделов - обычные button как в TagPicker */}
        <div className="flex flex-col gap-1 mb-3">
          {sections.map((section) => {
            const isSelected = selectedSection === section;
            const isProtected = section === 'Другие';
            
            return (
              <button
                key={section}
                role="menuitem"
                onClick={() => handleSelectSection(section)}
                className={`group relative w-full px-3 py-1.5 rounded text-sm text-left border transition-all ${
                  isSelected 
                    ? 'bg-blue-50 border-blue-200 text-blue-700' 
                    : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300'
                }`}
                title={section}
              >
                <div className="flex items-center justify-between">
                  <span>{section}</span>
                  
                  {/* Кнопка удаления (только для неprotected) */}
                  {!isProtected && (
                    <span
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => handleDelete(e, section)}
                      title="Удалить раздел"
                    >
                      <X className="w-3 h-3 text-red-600 hover:text-red-700" />
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
        
        {/* Кнопка добавления */}
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 px-3 py-2 rounded text-sm text-gray-500 hover:bg-gray-50 transition-all w-full"
          >
            <Plus className="w-4 h-4" />
            <span>Добавить раздел</span>
          </button>
        )}
        
        {/* Форма добавления */}
        {isAdding && (
          <div 
            className="space-y-2 pt-2 border-t border-gray-200"
            onKeyDown={(e) => e.stopPropagation()} // Предотвращаем keyboard navigation
          >
            <div className="flex gap-2 items-center">
              <div className="relative flex-1">
                <input
                  ref={newSectionInputRef}
                  type="text"
                  value={newSection}
                  autoFocus
                  onChange={(e) => setNewSection(e.target.value)}
                  onKeyDown={(e) => {
                    e.stopPropagation();
                    if (e.key === 'Enter') handleAdd();
                    if (e.key === 'Escape') {
                      setNewSection('');
                      setIsAdding(false);
                    }
                  }}
                  placeholder="Название раздела..."
                  className={`w-full ${INPUT_STYLES.standard} pr-12`}
                  maxLength={TEXT_LENGTH_LIMITS.tagName.max}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-gray-400">
                  {TEXT_LENGTH_LIMITS.tagName.max - newSection.length}
                </span>
              </div>
              <Button
                variant="primary"
                onClick={handleAdd}
                disabled={!newSection.trim() || alreadyExists}
                className="text-sm !py-2 px-4"
              >
                Добавить
              </Button>
            </div>
            
            {/* Предупреждение о дубликате */}
            {alreadyExists && (
              <p className="text-xs text-red-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                Раздел с таким названием уже существует
              </p>
            )}
            
            {/* Кнопка отмены */}
            <button
              onClick={() => {
                setNewSection('');
                setIsAdding(false);
              }}
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              Отмена
            </button>
          </div>
        )}
      </Dropdown.Content>
      
      {/* ConfirmDialog для удаления */}
      {deletingSection && (
        <ConfirmDialog
          title="Удалить раздел?"
          message={
            deletingSection.usageCount > 0
              ? `Раздел "${deletingSection.name}" используется в ${deletingSection.usageCount} ${
                  deletingSection.usageCount === 1 ? 'привычке' : 
                  deletingSection.usageCount > 1 && deletingSection.usageCount < 5 ? 'привычках' : 
                  'привычках'
                }.\n\nВсе привычки из этого раздела будут перенесены в "Другие".\n\nПродолжить?`
              : `Удалить раздел "${deletingSection.name}"?`
          }
          confirmText="Удалить"
          cancelText="Отмена"
          variant="danger"
          onConfirm={confirmDelete}
          onCancel={() => setDeletingSection(null)}
        />
      )}
    </>
  );
}

/**
 * Основной компонент SectionPicker
 */
export function SectionPicker({
  selectedSection,
  onSelectSection,
  sections,
  onAddSection,
  onDeleteSection,
  getSectionUsageCount,
  isOpen,
  onToggle,
}: SectionPickerProps) {
  return (
    <div className="relative" data-picker="section">
      <div className="relative">
        <Dropdown.Root 
          closeOnSelect={true} // Единичный выбор, закрывать сразу
          isOpen={isOpen} 
          onOpenChange={(open) => !open && onToggle()}
          enableTypeahead={false}
        >
          {/* Триггер */}
          <Dropdown.Trigger 
            onClick={onToggle}
            className="w-full px-3 py-2 border border-gray-200 rounded cursor-pointer hover:border-gray-300 transition-colors text-sm text-left flex items-center justify-between"
          >
            <span className="text-gray-900">{selectedSection}</span>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </Dropdown.Trigger>
          
          <SectionPickerContent
            selectedSection={selectedSection}
            onSelectSection={onSelectSection}
            sections={sections}
            onAddSection={onAddSection}
            onDeleteSection={onDeleteSection}
            getSectionUsageCount={getSectionUsageCount}
          />
        </Dropdown.Root>
      </div>
    </div>
  );
}