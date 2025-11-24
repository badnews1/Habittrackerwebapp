/**
 * Generic компонент выбора тегов
 * 
 * Универсальный UI компонент для управления тегами любого типа.
 * Используется во всех модулях (habits, tasks, finance) через специфичные обёртки.
 * 
 * @module shared/components/tag-picker
 * @created 23 ноября 2025 (миграция с category-picker)
 * @updated 23 ноября 2025 - теги отображаются как цветные кнопки вместо списка
 * @updated 23 ноября 2025 - добавлен множественный выбор тегов с overflow
 * @updated 23 ноября 2025 - ColorPicker перемещён в форму создания тега
 * @updated 23 ноября 2025 - добавлено визуальное предупреждение о дубликатах тегов
 */

import React, { useState, useEffect, useRef } from 'react';
import { TEXT_LENGTH_LIMITS } from '@/shared/constants';
import { Button } from '@/shared/components/button';
import { INPUT_STYLES } from '@/shared/constants/styles';
import { Dropdown } from '@/shared/constructors/dropdown';
import { Tag, ChevronDown, Plus, Close } from '@/shared/icons';
import { ColorPicker } from '@/shared/components/popovers';
import { ConfirmDialog } from '@/shared/components/modals';
import { TAG_COLORS } from '@/shared/constants/colors';
import { AlertCircle } from '@/shared/icons';

/**
 * Базовый интерфейс тега
 * Любой тег должен иметь name и color
 */
export interface BaseTag {
  name: string;
  color: string;
}

/**
 * Callback для получения количества использований тега
 */
export type GetTagUsageCount = (tagName: string) => number;

export interface TagPickerProps<T extends BaseTag> {
  /** Выбранные теги */
  selectedTags: string[];
  /** Callback выбора тегов */
  onSelectTags: (tags: string[]) => void;
  /** Список тегов */
  tags: T[];
  /** Callback добавления тега */
  onAddTag: (tag: string, color?: string) => void;
  /** Callback удаления тега */
  onDeleteTag: (tag: string) => void;
  /** Функция для получения количества использований тега */
  getTagUsageCount: GetTagUsageCount;
  /** Placeholder для пустого состояния */
  placeholder?: string;
  /** Текст для сообщения об удалении */
  deleteMessageSingular?: string;
  deleteMessagePlural?: string;
  /** Открыт ли dropdown */
  isOpen: boolean;
  /** Toggle функция */
  onToggle: () => void;
}

/**
 * Внутренний компонент контента TagPicker
 * Получает доступ к DropdownContext для программного закрытия
 */
interface TagPickerContentProps<T extends BaseTag> {
  selectedTags: string[];
  onSelectTags: (tags: string[]) => void;
  tags: T[];
  onAddTag: (tag: string, color?: string) => void;
  getTagUsageCount: GetTagUsageCount;
  onDeleteTag: (tag: string) => void;
  placeholder: string;
  deleteMessageSingular: string;
  deleteMessagePlural: string;
}

function TagPickerContent<T extends BaseTag>({
  selectedTags,
  onSelectTags,
  tags,
  onAddTag,
  getTagUsageCount,
  onDeleteTag,
  placeholder,
  deleteMessageSingular,
  deleteMessagePlural,
}: TagPickerContentProps<T>) {
  // Получаем доступ к контексту Dropdown для программного закрытия
  const context = Dropdown.useContext();
  
  // Локальное состояние для добавления нового тега
  const newTagInputRef = useRef<HTMLInputElement>(null);
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [newTagColor, setNewTagColor] = useState(TAG_COLORS[0]);
  const [deletingTag, setDeletingTag] = useState<{ name: string; usageCount: number } | null>(null);

  // Автофокус на input при открытии формы добавления тега
  useEffect(() => {
    if (isAddingTag && newTagInputRef.current) {
      // Небольшая задержка для корректного рендера
      setTimeout(() => {
        newTagInputRef.current?.focus();
      }, 0);
    }
  }, [isAddingTag]);

  // Сброс состояния при закрытии dropdown
  useEffect(() => {
    if (!context.isOpen) {
      setIsAddingTag(false);
      setNewTag('');
      setNewTagColor(TAG_COLORS[0]);
    }
  }, [context.isOpen]);

  const handleAddTag = () => {
    // ✅ Нормализуем пробелы: множественные пробелы → один
    const normalized = newTag.trim().replace(/\s+/g, ' ');
    
    // Проверка дубликата с нормализованным значением
    const alreadyExists = tags.some(
      tag => tag.name.trim().toLowerCase() === normalized.toLowerCase()
    );
    
    if (!normalized || alreadyExists) return;
    
    onAddTag(normalized, newTagColor);
    // Автоматически добавляем новый тег в выбранные
    onSelectTags([...selectedTags, normalized]);
    setNewTag('');
    setNewTagColor(TAG_COLORS[0]);
    setIsAddingTag(false);
  };

  // Проверяем, существует ли уже тег с таким именем (case-insensitive, trim-aware, нормализованные пробелы)
  const normalized = newTag.trim().replace(/\s+/g, ' ');
  const tagAlreadyExists = normalized && tags.some(
    tag => tag.name.trim().toLowerCase() === normalized.toLowerCase()
  );

  // Toggle логика для множественного выбора
  const handleToggleTag = (tagName: string) => {
    if (selectedTags.includes(tagName)) {
      // Убираем тег из выбранных
      onSelectTags(selectedTags.filter(t => t !== tagName));
    } else {
      // Добавляем тег к выбранным
      onSelectTags([...selectedTags, tagName]);
    }
  };

  // Очистить все теги
  const handleClearAll = () => {
    onSelectTags([]);
  };

  const handleDeleteTag = (e: React.MouseEvent, tagName: string) => {
    e.stopPropagation(); // Предотвращаем выбор тега при клике на удаление
    const usageCount = getTagUsageCount(tagName);
    setDeletingTag({ name: tagName, usageCount });
  };

  const confirmDeleteTag = () => {
    if (!deletingTag) return;
    
    onDeleteTag(deletingTag.name);
    // Если это был выбранный тег, убрать из выбранных
    if (selectedTags.includes(deletingTag.name)) {
      onSelectTags(selectedTags.filter(tag => tag !== deletingTag.name));
    }
    setDeletingTag(null);
  };

  return (
    <>
      <Dropdown.Content 
        direction="down" 
        width="full"
        maxHeight="300px"
        className="p-3"
      >
        {/* Подсказка */}
        <div className="text-xs text-gray-500 mb-2">
          Выберите один или несколько тегов:
        </div>

        {/* Сетка тегов в виде кнопок + кнопка добавления */}
        <div className="flex flex-wrap gap-2 mb-3">
          {/* Кнопка "Без тега" - всегда первая */}
          <button
            role="menuitem"
            onClick={handleClearAll}
            className={`group relative px-4 py-0.5 rounded text-xs border transition-all ${
              selectedTags.length === 0 
                ? 'bg-gray-200 text-gray-700 border-gray-400' 
                : 'bg-gray-100 text-gray-500 border-gray-300 hover:shadow-sm'
            }`}
            title={placeholder}
          >
            <div className="flex items-center gap-1 justify-center">
              <Tag className="w-3 h-3 flex-shrink-0" />
              <span className="flex-shrink-0">{placeholder}</span>
            </div>
          </button>
          
          {tags.map((tag) => {
            const isSelected = selectedTags.includes(tag.name);
            return (
              <button
                key={tag.name}
                role="menuitem"
                onClick={() => handleToggleTag(tag.name)}
                className={`group relative px-4 py-0.5 rounded text-xs border transition-all ${tag.color} ${
                  isSelected ? 'opacity-100' : 'opacity-60 hover:opacity-80 hover:shadow-sm'
                }`}
                title={tag.name}
              >
                {/* Контейнер для содержимого - центрируется по умолчанию, смещается влево при hover */}
                <div className="flex items-center gap-1 justify-center group-hover:-translate-x-2 transition-transform">
                  <Tag className="w-3 h-3 flex-shrink-0" />
                  <span className="flex-shrink-0">{tag.name}</span>
                </div>
                
                {/* Кнопка удаления абсолютно позиционирована справа */}
                <span 
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => handleDeleteTag(e, tag.name)}
                  title="Удалить тег"
                >
                  <Close className="w-3 h-3 hover:text-red-600 transition-colors" />
                </span>
              </button>
            );
          })}
          
          {/* Кнопка добавления тега */}
          <button
            onClick={() => setIsAddingTag(!isAddingTag)}
            className="inline-flex items-center justify-center px-2 py-0.5 rounded text-xs border border-dashed border-gray-300 text-gray-500 hover:border-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-all"
            title="Добавить тег"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>

        {/* ✅ Форма добавления нового тега */}
        {isAddingTag && (
          <div className="space-y-2">
            <div className="flex gap-1 items-center">
              <ColorPicker
                currentColor={newTagColor}
                onSelectColor={setNewTagColor}
              />
              <div className="relative flex-1">
                <input
                  ref={newTagInputRef}
                  type="text"
                  value={newTag}
                  autoFocus
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={(e) => {
                    e.stopPropagation(); // Предотвращаем обработку клавиш в Dropdown
                    if (e.key === 'Enter') {
                      handleAddTag();
                    } else if (e.key === 'Escape') {
                      setNewTag('');
                      setNewTagColor(TAG_COLORS[0]);
                      setIsAddingTag(false);
                    }
                  }}
                  placeholder="Новый тег..."
                  className={`w-full ${INPUT_STYLES.standard} pr-12`}
                  maxLength={TEXT_LENGTH_LIMITS.tagName.max}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-gray-400">
                  {TEXT_LENGTH_LIMITS.tagName.max - newTag.length}
                </span>
              </div>
              <Button
                variant="primary"
                onClick={handleAddTag}
                disabled={!newTag.trim() || tagAlreadyExists}
                className="text-sm !py-2 px-4 ml-2"
              >
                Добавить
              </Button>
            </div>
            
            {/* ✅ Визуальное предупреждение о дубликате */}
            {tagAlreadyExists && (
              <p className="text-xs text-red-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                Тег с таким названием уже существует
              </p>
            )}
          </div>
        )}
      </Dropdown.Content>

      {/* Диалог подтверждения удаления тега */}
      {deletingTag && (
        <ConfirmDialog
          title="Удалить тег?"
          message={
            deletingTag.usageCount > 0
              ? `Тег "${deletingTag.name}" используется в ${deletingTag.usageCount} ${
                  deletingTag.usageCount === 1 ? deleteMessageSingular : deleteMessagePlural
                }.\n\nУдалить тег? Он будет удалён из всех элементов.`
              : `Удалить тег "${deletingTag.name}"?`
          }
          confirmText="Удалить"
          cancelText="Отмена"
          variant="danger"
          onConfirm={confirmDeleteTag}
          onCancel={() => setDeletingTag(null)}
        />
      )}
    </>
  );
}

/**
 * Generic компонент выбора тегов
 * 
 * Позволяет:
 * - Выбирать несколько тегов из списка
 * - Добавлять новые теги с выбором цвета
 * - Удалять теги (с подтверждением)
 * 
 * @example
 * ```tsx
 * <TagPicker
 *   selectedTags={habit.tags}
 *   onSelectTags={handleSelect}
 *   tags={tags}
 *   onAddTag={handleAdd}
 *   onDeleteTag={handleDelete}
 *   getTagUsageCount={(name) => habits.filter(h => h.tags?.includes(name)).length}
 *   isOpen={isOpen}
 *   onToggle={() => setIsOpen(!isOpen)}
 * />
 * ```
 */
export function TagPicker<T extends BaseTag>({
  selectedTags = [],
  onSelectTags,
  tags,
  onAddTag,
  onDeleteTag,
  getTagUsageCount,
  placeholder = 'Без тега',
  deleteMessageSingular = 'элементе',
  deleteMessagePlural = 'элементах',
  isOpen,
  onToggle,
}: TagPickerProps<T>) {
  const [visibleTags, setVisibleTags] = useState<number>(selectedTags?.length || 0);
  const triggerRef = useRef<HTMLDivElement>(null);

  // Получить выбранные теги с их цветами
  const selectedTagObjects = (selectedTags || [])
    .map(tagName => tags.find(tag => tag.name === tagName))
    .filter(Boolean) as T[];

  // Вычисляем сколько тегов помещается
  useEffect(() => {
    const tagsLength = selectedTags?.length || 0;
    if (!triggerRef.current || tagsLength === 0) {
      setVisibleTags(tagsLength);
      return;
    }

    // Простая эвристика: считаем что тег занимает примерно 80px
    const availableWidth = triggerRef.current.offsetWidth - 80; // 80px для иконки и chevron
    const tagWidth = 80; // примерная ширина одного тега
    const maxTags = Math.max(1, Math.floor(availableWidth / tagWidth));
    
    setVisibleTags(Math.min(maxTags, tagsLength));
  }, [selectedTags, triggerRef.current?.offsetWidth]);

  const overflowCount = selectedTags.length - visibleTags;
  const displayTags = selectedTagObjects.slice(0, visibleTags);

  return (
    <div className="relative" data-picker="tag">
      {/* Поле выбора тега */}
      <div className="relative">
        <Dropdown.Root 
          closeOnSelect={false} 
          isOpen={isOpen} 
          onOpenChange={(open) => !open && onToggle()}
          enableTypeahead={false}
        >
          {/* Кнопка-триггер */}
          <Dropdown.Trigger 
            onClick={onToggle}
            className={`w-full px-3 py-2 border border-gray-200 rounded cursor-pointer hover:border-gray-300 transition-colors text-sm text-left flex items-center gap-2 overflow-hidden ${
              selectedTags.length > 0 ? 'text-gray-900' : 'text-gray-400'
            }`}
          >
            <div ref={triggerRef} className="flex items-center gap-2 flex-1 overflow-hidden">
              {/* Отображаем выбранные теги как кнопки или placeholder */}
              {selectedTags.length > 0 ? (
                <>
                  {displayTags.map((tag, index) => (
                    <div 
                      key={`${tag.name}-${index}`}
                      className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs border flex-shrink-0 ${tag.color}`}
                    >
                      <Tag className="w-3 h-3" />
                      <span>{tag.name}</span>
                    </div>
                  ))}
                  {/* Показываем +N если есть overflow */}
                  {overflowCount > 0 && (
                    <div className="inline-flex items-center justify-center px-2 py-0.5 rounded text-xs border bg-gray-100 text-gray-600 border-gray-300 flex-shrink-0">
                      +{overflowCount}
                    </div>
                  )}
                </>
              ) : (
                <>
                  <Tag className="w-4 h-4" />
                  <span className="flex-1">{placeholder}</span>
                </>
              )}
            </div>
            <ChevronDown className="w-4 h-4 flex-shrink-0" />
          </Dropdown.Trigger>

          {/* Dropdown контент с тегами */}
          <TagPickerContent
            selectedTags={selectedTags}
            onSelectTags={onSelectTags}
            tags={tags}
            onAddTag={onAddTag}
            getTagUsageCount={getTagUsageCount}
            onDeleteTag={onDeleteTag}
            placeholder={placeholder}
            deleteMessageSingular={deleteMessageSingular}
            deleteMessagePlural={deleteMessagePlural}
          />
        </Dropdown.Root>
      </div>
    </div>
  );
}