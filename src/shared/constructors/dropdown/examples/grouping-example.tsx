/**
 * Пример: Группировка элементов в Dropdown
 * 
 * Демонстрация использования Dropdown.Group и Dropdown.Label для структурирования больших списков.
 * 
 * USE-CASES:
 * 1. UnitPicker - 22 единицы измерения (расстояние/вес/время/прочее)
 * 2. CategoryPicker - группировка категорий по темам
 * 3. Actions Menu - группировка действий по важности
 * 
 * @module shared/constructors/dropdown/examples
 * @created 22 ноября 2025
 */

import { Dropdown } from '../Dropdown';
import { Ruler, Scale, Clock, Hash, Dumbbell, Apple, Moon, Book, Code, Brain, Edit, Copy, Trash } from 'lucide-react';

// ==================== USE-CASE #1: UnitPicker ====================

export function UnitPickerGroupingExample() {
  return (
    <div className="p-8">
      <h2 className="mb-4">UnitPicker с группировкой (22 единицы)</h2>
      
      <Dropdown.Root>
        <Dropdown.Trigger className="px-4 py-2 bg-blue-500 text-white rounded">
          Выбрать единицу измерения
        </Dropdown.Trigger>
        
        <Dropdown.Content direction="down" width="auto">
          {/* Группа: Расстояние */}
          <Dropdown.Group label="📏 Расстояние">
            <Dropdown.Item>км</Dropdown.Item>
            <Dropdown.Item>м</Dropdown.Item>
            <Dropdown.Item>миля</Dropdown.Item>
            <Dropdown.Item>ярд</Dropdown.Item>
            <Dropdown.Item>фут</Dropdown.Item>
          </Dropdown.Group>
          
          {/* Группа: Вес */}
          <Dropdown.Group label="⚖️ Вес">
            <Dropdown.Item>кг</Dropdown.Item>
            <Dropdown.Item>г</Dropdown.Item>
            <Dropdown.Item>фунт</Dropdown.Item>
            <Dropdown.Item>унция</Dropdown.Item>
          </Dropdown.Group>
          
          {/* Группа: Время */}
          <Dropdown.Group label="⏱️ Время">
            <Dropdown.Item>час</Dropdown.Item>
            <Dropdown.Item>мин</Dropdown.Item>
            <Dropdown.Item>сек</Dropdown.Item>
          </Dropdown.Group>
          
          {/* Группа: Прочее */}
          <Dropdown.Group label="🔢 Прочее">
            <Dropdown.Item>раз</Dropdown.Item>
            <Dropdown.Item>стр</Dropdown.Item>
            <Dropdown.Item>л</Dropdown.Item>
            <Dropdown.Item>мл</Dropdown.Item>
            <Dropdown.Item>ккал</Dropdown.Item>
            <Dropdown.Item>шт</Dropdown.Item>
            <Dropdown.Item>%</Dropdown.Item>
          </Dropdown.Group>
        </Dropdown.Content>
      </Dropdown.Root>
      
      <p className="text-sm text-gray-500 mt-4">
        ✅ 22 элемента структурированы в 4 группы → легко найти нужное!
      </p>
    </div>
  );
}

// ==================== USE-CASE #2: CategoryPicker ====================

export function CategoryPickerGroupingExample() {
  return (
    <div className="p-8">
      <h2 className="mb-4">CategoryPicker с группировкой по темам</h2>
      
      <Dropdown.Root>
        <Dropdown.Trigger className="px-4 py-2 bg-green-500 text-white rounded">
          Выбрать категорию
        </Dropdown.Trigger>
        
        <Dropdown.Content direction="down" width="auto">
          {/* Группа: Здоровье */}
          <Dropdown.Group label="💪 Здоровье">
            <Dropdown.Item icon={Dumbbell}>Спорт</Dropdown.Item>
            <Dropdown.Item icon={Apple}>Питание</Dropdown.Item>
            <Dropdown.Item icon={Moon}>Сон</Dropdown.Item>
          </Dropdown.Group>
          
          <Dropdown.Separator />
          
          {/* Группа: Развитие */}
          <Dropdown.Group label="🧠 Развитие">
            <Dropdown.Item icon={Book}>Обучение</Dropdown.Item>
            <Dropdown.Item icon={Code}>Программирование</Dropdown.Item>
            <Dropdown.Item icon={Brain}>Медитация</Dropdown.Item>
          </Dropdown.Group>
        </Dropdown.Content>
      </Dropdown.Root>
      
      <p className="text-sm text-gray-500 mt-4">
        ✅ Категории сгруппированы по темам с разделителем
      </p>
    </div>
  );
}

// ==================== USE-CASE #3: Actions Menu ====================

export function ActionsMenuGroupingExample() {
  return (
    <div className="p-8">
      <h2 className="mb-4">Actions Menu с группировкой</h2>
      
      <Dropdown.Root>
        <Dropdown.Trigger className="px-4 py-2 bg-purple-500 text-white rounded">
          Действия
        </Dropdown.Trigger>
        
        <Dropdown.Content direction="down" width="auto">
          {/* Группа: Основные действия */}
          <Dropdown.Group label="Основные">
            <Dropdown.Item icon={Edit}>Редактировать</Dropdown.Item>
            <Dropdown.Item icon={Copy}>Дублировать</Dropdown.Item>
          </Dropdown.Group>
          
          <Dropdown.Separator />
          
          {/* Группа: Опасные действия */}
          <Dropdown.Group label="Опасные действия">
            <Dropdown.Item icon={Trash} variant="danger">
              Удалить
            </Dropdown.Item>
          </Dropdown.Group>
        </Dropdown.Content>
      </Dropdown.Root>
      
      <p className="text-sm text-gray-500 mt-4">
        ✅ Опасные действия визуально отделены от основных
      </p>
    </div>
  );
}

// ==================== Композитный вариант (с иконками в Label) ====================

export function CompositeGroupingExample() {
  return (
    <div className="p-8">
      <h2 className="mb-4">Композитный вариант (Label с иконками)</h2>
      
      <Dropdown.Root>
        <Dropdown.Trigger className="px-4 py-2 bg-orange-500 text-white rounded">
          Выбрать единицу (композитный)
        </Dropdown.Trigger>
        
        <Dropdown.Content direction="down" width="auto">
          {/* Композитный: Label отдельно от Group */}
          <Dropdown.Group>
            <Dropdown.Label icon={Ruler}>Расстояние</Dropdown.Label>
            <Dropdown.Item>км</Dropdown.Item>
            <Dropdown.Item>м</Dropdown.Item>
          </Dropdown.Group>
          
          <Dropdown.Group>
            <Dropdown.Label icon={Scale}>Вес</Dropdown.Label>
            <Dropdown.Item>кг</Dropdown.Item>
            <Dropdown.Item>г</Dropdown.Item>
          </Dropdown.Group>
          
          <Dropdown.Group>
            <Dropdown.Label icon={Clock}>Время</Dropdown.Label>
            <Dropdown.Item>час</Dropdown.Item>
            <Dropdown.Item>мин</Dropdown.Item>
          </Dropdown.Group>
          
          <Dropdown.Group>
            <Dropdown.Label icon={Hash}>Прочее</Dropdown.Label>
            <Dropdown.Item>раз</Dropdown.Item>
            <Dropdown.Item>стр</Dropdown.Item>
          </Dropdown.Group>
        </Dropdown.Content>
      </Dropdown.Root>
      
      <p className="text-sm text-gray-500 mt-4">
        ✅ Иконки в заголовках групп для визуального усиления
      </p>
    </div>
  );
}

// ==================== Все примеры вместе ====================

export function AllGroupingExamples() {
  return (
    <div className="space-y-8">
      <UnitPickerGroupingExample />
      <CategoryPickerGroupingExample />
      <ActionsMenuGroupingExample />
      <CompositeGroupingExample />
    </div>
  );
}
