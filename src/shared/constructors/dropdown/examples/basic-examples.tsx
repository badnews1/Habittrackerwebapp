/**
 * Примеры использования Dropdown конструктора
 * 
 * @module shared/constructors/dropdown
 * @created 22 ноября 2025
 * @updated 22 ноября 2025 - перемещено в /examples/ для консистентности
 */

import React, { useState } from 'react';
import { Dropdown } from '../Dropdown';
import { ChevronDown, Plus, Tag, Trash, Settings } from '@/shared/icons';

// ==================== БАЗОВЫЙ ПРИМЕР ====================

export function BasicDropdownExample() {
  const [value, setValue] = useState('Option 1');

  return (
    <Dropdown.Root>
      <Dropdown.Trigger className="px-3 py-2 border border-gray-200 rounded flex items-center gap-2 hover:border-gray-300">
        <span>{value}</span>
        <ChevronDown className="w-4 h-4" />
      </Dropdown.Trigger>

      <Dropdown.Content>
        <Dropdown.Item 
          onClick={() => setValue('Option 1')}
          selected={value === 'Option 1'}
        >
          Option 1
        </Dropdown.Item>
        
        <Dropdown.Item 
          onClick={() => setValue('Option 2')}
          selected={value === 'Option 2'}
        >
          Option 2
        </Dropdown.Item>
        
        <Dropdown.Item 
          onClick={() => setValue('Option 3')}
          selected={value === 'Option 3'}
        >
          Option 3
        </Dropdown.Item>
      </Dropdown.Content>
    </Dropdown.Root>
  );
}

// ==================== CONTROLLED РЕЖИМ ====================

export function ControlledDropdownExample() {
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState('');

  return (
    <Dropdown.Root 
      isOpen={isOpen} 
      onToggle={() => setIsOpen(!isOpen)}
    >
      <Dropdown.Trigger className="px-3 py-2 border rounded">
        {value || 'Выберите опцию'}
      </Dropdown.Trigger>

      <Dropdown.Content>
        <Dropdown.Item onClick={() => setValue('First')}>
          First
        </Dropdown.Item>
        <Dropdown.Item onClick={() => setValue('Second')}>
          Second
        </Dropdown.Item>
      </Dropdown.Content>
    </Dropdown.Root>
  );
}

// ==================== С ИКОНКАМИ И BADGES ====================

export function DropdownWithIconsExample() {
  const [category, setCategory] = useState('Work');

  const categories = [
    { name: 'Work', count: 5 },
    { name: 'Personal', count: 12 },
    { name: 'Health', count: 3 },
  ];

  return (
    <Dropdown.Root>
      <Dropdown.Trigger className="w-full px-3 py-2 border rounded flex items-center gap-2">
        <Tag className="w-4 h-4" />
        <span className="flex-1">{category}</span>
        <ChevronDown className="w-4 h-4" />
      </Dropdown.Trigger>

      <Dropdown.Content>
        {categories.map(cat => (
          <Dropdown.Item
            key={cat.name}
            icon={Tag}
            badge={<span className="text-xs text-gray-400">({cat.count})</span>}
            selected={category === cat.name}
            onClick={() => setCategory(cat.name)}
          >
            {cat.name}
          </Dropdown.Item>
        ))}
        
        <Dropdown.Separator />
        
        <Dropdown.Item icon={Plus} onClick={() => console.log('Add')}>
          Добавить категорию
        </Dropdown.Item>
      </Dropdown.Content>
    </Dropdown.Root>
  );
}

// ==================== НАПРАВЛЕНИЕ ВВЕРХ ====================

export function DropdownDirectionUpExample() {
  const [value, setValue] = useState('Option 1');

  return (
    <div className="mt-64"> {/* Показываем внизу страницы */}
      <Dropdown.Root>
        <Dropdown.Trigger className="px-3 py-2 border rounded">
          {value}
        </Dropdown.Trigger>

        <Dropdown.Content direction="up">
          <Dropdown.Item onClick={() => setValue('Option 1')}>
            Option 1
          </Dropdown.Item>
          <Dropdown.Item onClick={() => setValue('Option 2')}>
            Option 2
          </Dropdown.Item>
        </Dropdown.Content>
      </Dropdown.Root>
    </div>
  );
}

// ==================== DANGER ВАРИАНТ ====================

export function DropdownWithDangerExample() {
  return (
    <Dropdown.Root>
      <Dropdown.Trigger className="p-2 border rounded">
        <Settings className="w-4 h-4" />
      </Dropdown.Trigger>

      <Dropdown.Content align="right">
        <Dropdown.Item icon={Settings}>
          Настройки
        </Dropdown.Item>
        
        <Dropdown.Separator />
        
        <Dropdown.Item 
          icon={Trash}
          variant="danger"
          onClick={() => console.log('Delete')}
        >
          Удалить
        </Dropdown.Item>
      </Dropdown.Content>
    </Dropdown.Root>
  );
}

// ==================== КАСТОМНАЯ ШИРИНА ====================

export function DropdownCustomWidthExample() {
  return (
    <Dropdown.Root>
      <Dropdown.Trigger className="px-3 py-2 border rounded">
        Открыть меню
      </Dropdown.Trigger>

      <Dropdown.Content width="300px">
        <div className="p-4">
          <h4 className="text-sm font-medium mb-2">Кастомный контент</h4>
          <p className="text-xs text-gray-500">
            Можно передать любой контент, не только Dropdown.Item
          </p>
        </div>
        
        <Dropdown.Separator />
        
        <Dropdown.Item>Действие 1</Dropdown.Item>
        <Dropdown.Item>Действие 2</Dropdown.Item>
      </Dropdown.Content>
    </Dropdown.Root>
  );
}

// ==================== AS CHILD ====================

export function DropdownAsChildExample() {
  return (
    <Dropdown.Root>
      <Dropdown.Trigger asChild>
        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Кастомная кнопка
        </button>
      </Dropdown.Trigger>

      <Dropdown.Content>
        <Dropdown.Item>Option 1</Dropdown.Item>
        <Dropdown.Item>Option 2</Dropdown.Item>
      </Dropdown.Content>
    </Dropdown.Root>
  );
}

// ==================== ВСЕ ПРИМЕРЫ ====================

export function AllDropdownExamples() {
  return (
    <div className="p-8 space-y-8">
      <div>
        <h3 className="text-lg font-medium mb-3">Базовый пример</h3>
        <BasicDropdownExample />
      </div>

      <div>
        <h3 className="text-lg font-medium mb-3">Controlled режим</h3>
        <ControlledDropdownExample />
      </div>

      <div>
        <h3 className="text-lg font-medium mb-3">С иконками и badges</h3>
        <DropdownWithIconsExample />
      </div>

      <div>
        <h3 className="text-lg font-medium mb-3">Danger вариант</h3>
        <DropdownWithDangerExample />
      </div>

      <div>
        <h3 className="text-lg font-medium mb-3">Кастомная ширина</h3>
        <DropdownCustomWidthExample />
      </div>

      <div>
        <h3 className="text-lg font-medium mb-3">AsChild</h3>
        <DropdownAsChildExample />
      </div>

      <DropdownDirectionUpExample />
    </div>
  );
}
