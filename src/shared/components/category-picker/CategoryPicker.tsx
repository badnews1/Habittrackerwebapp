/**
 * Generic компонент выбора категорий
 * 
 * Универсальный UI компонент для управления категориями любого типа.
 * Используется во всех модулях (habits, tasks, finance) через специфичные обёртки.
 * 
 * @module shared/components/category-picker
 * @created 22 ноября 2025
 */

import React, { useState, useEffect, useRef } from 'react';
import { Modal } from '@/shared/constructors/modal';
import { COLOR_DISPLAY_MAP, TEXT_LENGTH_LIMITS, CATEGORY_COLORS } from '@/shared/constants';
import { Button } from '@/shared/components/button';
import { INPUT_STYLES } from '@/shared/constants/styles';
import { useDropdown } from '@/shared/hooks/use-dropdown';
import { Tag, ChevronDown, Plus, Close } from '@/shared/icons';
import { ColorPicker } from '@/shared/components/popovers';
import { ConfirmDialog } from '@/shared/components/modals';

/**
 * Базовый интерфейс категории
 * Любая категория должна иметь name и color
 */
export interface BaseCategory {
  name: string;
  color: string;
}

/**
 * Callback для получения количества использований категории
 */
export type GetCategoryUsageCount = (categoryName: string) => number;

export interface CategoryPickerProps<T extends BaseCategory> {
  /** Выбранная категория */
  selectedCategory: string;
  /** Callback выбора категории */
  onSelectCategory: (category: string) => void;
  /** Список категорий */
  categories: T[];
  /** Callback добавления категории */
  onAddCategory: (category: string) => void;
  /** Callback удаления категории */
  onDeleteCategory: (category: string) => void;
  /** Callback обновления цвета категории */
  onUpdateCategoryColor: (categoryName: string, color: string) => void;
  /** Функция для получения количества использований категории */
  getCategoryUsageCount: GetCategoryUsageCount;
  /** Опциональное внешнее управление состоянием dropdown */
  isOpen?: boolean;
  /** Функция переключения состояния dropdown */
  onToggle?: () => void;
  /** Placeholder для пустого состояния */
  placeholder?: string;
  /** Текст для сообщения об удалении */
  deleteMessageSingular?: string;
  deleteMessagePlural?: string;
}

/**
 * Generic компонент выбора категорий
 * 
 * Позволяет:
 * - Выбирать категорию из списка
 * - Добавлять новые категории
 * - Удалять категории (с подтверждением)
 * - Изменять цвета категорий через ColorPicker
 * 
 * Поддерживает как внутреннее, так и внешнее управление состоянием:
 * - Внутреннее: просто передайте обязательные пропсы (поведение по умолчанию)
 * - Внешнее: также передайте isOpen и onToggle для полного контроля
 * 
 * UI СТРУКТУРА:
 * - Слева: кнопка выбора цвета текущей выбранной категории
 * - Справа: поле выбора категории из списка
 * 
 * @example
 * ```tsx
 * <CategoryPicker
 *   selectedCategory={habit.category}
 *   onSelectCategory={handleSelect}
 *   categories={categories}
 *   onAddCategory={handleAdd}
 *   onDeleteCategory={handleDelete}
 *   onUpdateCategoryColor={handleColorUpdate}
 *   getCategoryUsageCount={(name) => habits.filter(h => h.category === name).length}
 * />
 * ```
 */
export function CategoryPicker<T extends BaseCategory>({
  selectedCategory,
  onSelectCategory,
  categories,
  onAddCategory,
  onDeleteCategory,
  onUpdateCategoryColor,
  getCategoryUsageCount,
  isOpen,
  onToggle,
  placeholder = 'Без категории',
  deleteMessageSingular = 'элементе',
  deleteMessagePlural = 'элементах',
}: CategoryPickerProps<T>) {
  // Дополнительное локальное состояние (специфичное для CategoryPicker)
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const [colorPickerAnchor, setColorPickerAnchor] = useState<HTMLElement | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<{ name: string; usageCount: number } | null>(null);
  
  const newCategoryInputRef = useRef<HTMLInputElement>(null);
  const colorButtonRef = useRef<HTMLButtonElement>(null);

  // Используем универсальный хук dropdown
  const dropdown = useDropdown({
    isOpen,
    onToggle,
    onClose: () => {
      // Сбрасываем локальное состояние при закрытии
      setIsAddingCategory(false);
      setNewCategory('');
    },
  });

  // Закрытие ColorPicker при клике вне его области
  useEffect(() => {
    if (!isColorPickerOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      
      // Проверяем что клик не был на кнопке цвета
      if (colorButtonRef.current && colorButtonRef.current.contains(target)) {
        return;
      }
      
      // Проверяем что клик не был внутри ColorPicker (через data-атрибут или closest)
      if (target.closest('[data-color-picker="true"]')) {
        return;
      }
      
      // Закрываем ColorPicker при клике вне
      setIsColorPickerOpen(false);
      setColorPickerAnchor(null);
    };

    // Небольшая задержка чтобы не закрыть сразу после открытия
    setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 0);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isColorPickerOpen]);

  // Фокус на поле ввода новой категории при добавлении
  useEffect(() => {
    if (isAddingCategory && newCategoryInputRef.current) {
      newCategoryInputRef.current.focus();
    }
  }, [isAddingCategory]);

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      onAddCategory(newCategory.trim());
      onSelectCategory(newCategory.trim());
      setNewCategory('');
      setIsAddingCategory(false);
      dropdown.close();
    }
  };

  const handleSelectCategory = (categoryName: string) => {
    onSelectCategory(categoryName);
    dropdown.close();
  };

  const handleDeleteCategory = (categoryName: string) => {
    const usageCount = getCategoryUsageCount(categoryName);
    setDeletingCategory({ name: categoryName, usageCount });
  };

  const confirmDeleteCategory = () => {
    if (!deletingCategory) return;
    
    onDeleteCategory(deletingCategory.name);
    // Если это была выбранная категория, очистить её
    if (selectedCategory === deletingCategory.name) {
      onSelectCategory('');
    }
    setDeletingCategory(null);
  };

  // Получить текущую выбранную категорию для отображения цвета
  const currentCategory = categories.find(cat => cat.name === selectedCategory);
  const currentCategoryColor = currentCategory?.color || 'bg-gray-200 border-gray-300';
  const bgClass = currentCategoryColor.split(' ')[0];
  const displayBgClass = COLOR_DISPLAY_MAP[bgClass] || bgClass;

  return (
    <div className="relative flex items-center gap-2" ref={dropdown.ref} data-picker="category">
      {/* Кнопка выбора цвета СЛЕВА */}
      <button
        ref={colorButtonRef}
        onClick={(e) => {
          // Открыть ColorPicker только если категория выбрана
          if (selectedCategory) {
            setIsColorPickerOpen(!isColorPickerOpen);
            setColorPickerAnchor(e.currentTarget);
          }
        }}
        disabled={!selectedCategory}
        className={`w-6 h-6 rounded-full border flex-shrink-0 ${displayBgClass} ${
          selectedCategory && isColorPickerOpen ? 'ring-2 ring-gray-900' : 'border-gray-200'
        } hover:scale-110 transition-transform ${
          !selectedCategory ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'
        }`}
        title={selectedCategory ? 'Изменить цвет категории' : 'Выберите категорию чтобы изменить цвет'}
      />

      {/* ColorPicker для текущей выбранной категории */}
      {isColorPickerOpen && selectedCategory && (
        <ColorPicker
          currentColor={currentCategoryColor}
          onSelectColor={(color) => {
            onUpdateCategoryColor(selectedCategory, color);
            setIsColorPickerOpen(false);
            setColorPickerAnchor(null);
          }}
          onClose={() => {
            setIsColorPickerOpen(false);
            setColorPickerAnchor(null);
          }}
          anchorElement={colorPickerAnchor}
        />
      )}

      {/* Поле выбора категории СПРАВА */}
      <div className="flex-1 relative">
        <button
          onClick={dropdown.toggle}
          className={`w-full px-3 py-2 border border-gray-200 rounded cursor-pointer hover:border-gray-300 transition-colors text-sm text-left flex items-center gap-2 ${
            selectedCategory ? 'text-gray-900' : 'text-gray-400'
          }`}
        >
          <Tag className="w-4 h-4" />
          <span className="flex-1">{selectedCategory || placeholder}</span>
          <ChevronDown className="w-4 h-4" />
        </button>

        {dropdown.isOpen && (
          <div className="absolute left-0 top-full mt-1 z-50 bg-white border border-gray-200 rounded-lg shadow-lg w-full max-h-60 overflow-y-auto">
            {/* Опция удаления категории */}
            {selectedCategory && (
              <button
                onClick={() => handleSelectCategory('')}
                className="w-full px-3 py-2 text-left hover:bg-gray-50 transition-colors text-sm text-gray-500 border-b border-gray-200"
              >
                {placeholder}
              </button>
            )}

            {/* Список категорий */}
            {categories.map((cat) => {
              const usageCount = getCategoryUsageCount(cat.name);

              return (
                <div
                  key={cat.name}
                  className={`flex items-center gap-1 group ${
                    selectedCategory === cat.name ? 'bg-gray-100' : ''
                  }`}
                >
                  {/* Кнопка имени категории */}
                  <button
                    onClick={() => handleSelectCategory(cat.name)}
                    className={`flex-1 px-3 py-2 text-left hover:bg-gray-100 transition-colors text-sm flex items-center justify-between ${
                      selectedCategory === cat.name ? 'text-gray-900' : 'text-gray-700'
                    }`}
                  >
                    <span>{cat.name}</span>
                    {usageCount > 0 && (
                      <span className="text-xs text-gray-400">({usageCount})</span>
                    )}
                  </button>

                  {/* Кнопка удаления категории */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteCategory(cat.name);
                    }}
                    className="px-2 py-2 text-gray-400 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100"
                    title="Удалить категорию"
                  >
                    <Close className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}

            {/* Добавить новую категорию */}
            {isAddingCategory ? (
              <div className="p-2 border-t border-gray-200">
                <div className="flex gap-2">
                  <input
                    ref={newCategoryInputRef}
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleAddCategory();
                      } else if (e.key === 'Escape') {
                        setNewCategory('');
                        setIsAddingCategory(false);
                      }
                    }}
                    placeholder="Новая категория..."
                    className={`flex-1 ${INPUT_STYLES.compact}`}
                    maxLength={TEXT_LENGTH_LIMITS.categoryName.max}
                  />
                  <Button
                    variant="primary"
                    onClick={handleAddCategory}
                    disabled={!newCategory.trim()}
                    className="text-sm"
                  >
                    Добавить
                  </Button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setIsAddingCategory(true)}
                className="w-full px-3 py-2 text-left hover:bg-gray-50 transition-colors text-sm text-gray-600 border-t border-gray-200 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Добавить категорию
              </button>
            )}
          </div>
        )}
      </div>

      {/* Диалог подтверждения удаления категории */}
      {deletingCategory && (
        <ConfirmDialog
          title="Удалить категорию?"
          message={
            deletingCategory.usageCount > 0
              ? `Категория "${deletingCategory.name}" используется в ${deletingCategory.usageCount} ${
                  deletingCategory.usageCount === 1 ? deleteMessageSingular : deleteMessagePlural
                }. Удалить категорию? Она будет удалена из всех элементов.`
              : `Удалить категорию "${deletingCategory.name}"?`
          }
          confirmText="Удалить"
          cancelText="Отмена"
          variant="danger"
          onConfirm={confirmDeleteCategory}
          onCancel={() => setDeletingCategory(null)}
        />
      )}
    </div>
  );
}
