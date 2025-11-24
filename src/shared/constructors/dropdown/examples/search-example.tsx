/**
 * Пример: Search в Dropdown (ручной режим)
 * 
 * Демонстрация использования Dropdown.Search для фильтрации элементов.
 * Ручной режим - фильтрация выполняется вручную через useState.
 * 
 * USE-CASES:
 * 1. UnitPicker (22 единицы) - поиск с группировкой
 * 2. IconPicker (~30 иконок) - пагинация вместо поиска
 * 3. Country/City пикеры - поиск обязателен
 * 
 * @module shared/constructors/dropdown/examples
 * @created 22 ноября 2025
 */

import { useState } from 'react';
import { Dropdown } from '../Dropdown';
import { Dumbbell, Apple, Moon, Book, Code, Brain } from 'lucide-react';

// ==================== Данные для примеров ====================

const units = [
  // Расстояние
  { id: 'km', name: 'км', group: 'Расстояние', keywords: ['километр', 'расстояние', 'kilometer'] },
  { id: 'm', name: 'м', group: 'Расстояние', keywords: ['метр', 'meter'] },
  { id: 'mile', name: 'миля', group: 'Расстояние', keywords: ['mile'] },
  { id: 'yard', name: 'ярд', group: 'Расстояние', keywords: ['yard'] },
  { id: 'foot', name: 'фут', group: 'Расстояние', keywords: ['foot'] },
  // Вес
  { id: 'kg', name: 'кг', group: 'Вес', keywords: ['килограмм', 'вес', 'weight', 'kilogram'] },
  { id: 'g', name: 'г', group: 'Вес', keywords: ['грамм', 'gram'] },
  { id: 'pound', name: 'фунт', group: 'Вес', keywords: ['pound', 'фунт'] },
  { id: 'ounce', name: 'унция', group: 'Вес', keywords: ['ounce', 'унция'] },
  // Время
  { id: 'hour', name: 'час', group: 'Время', keywords: ['hour', 'час', 'часов'] },
  { id: 'min', name: 'мин', group: 'Время', keywords: ['минута', 'minute', 'минут'] },
  { id: 'sec', name: 'сек', group: 'Время', keywords: ['секунда', 'second', 'секунд'] },
  // Прочее
  { id: 'times', name: 'раз', group: 'Прочее', keywords: ['раз', 'times', 'повтор'] },
  { id: 'pages', name: 'стр', group: 'Прочее', keywords: ['страница', 'page', 'страниц'] },
  { id: 'liter', name: 'л', group: 'Прочее', keywords: ['литр', 'liter'] },
  { id: 'ml', name: 'мл', group: 'Прочее', keywords: ['миллилитр', 'milliliter'] },
  { id: 'kcal', name: 'ккал', group: 'Прочее', keywords: ['калория', 'calorie', 'килокалория'] },
  { id: 'pcs', name: 'шт', group: 'Прочее', keywords: ['штука', 'piece', 'pieces'] },
  { id: 'percent', name: '%', group: 'Прочее', keywords: ['процент', 'percent'] },
];

const categories = [
  { id: 'sport', name: 'Спорт', group: 'Здоровье', icon: Dumbbell, keywords: ['фитнес', 'тренировка', 'fitness', 'workout'] },
  { id: 'food', name: 'Питание', group: 'Здоровье', icon: Apple, keywords: ['еда', 'диета', 'food', 'diet'] },
  { id: 'sleep', name: 'Сон', group: 'Здоровье', icon: Moon, keywords: ['отдых', 'rest', 'sleep'] },
  { id: 'learn', name: 'Обучение', group: 'Развитие', icon: Book, keywords: ['учёба', 'education', 'study'] },
  { id: 'code', name: 'Программирование', group: 'Развитие', icon: Code, keywords: ['кодинг', 'coding', 'dev', 'разработка'] },
  { id: 'meditate', name: 'Медитация', group: 'Развитие', icon: Brain, keywords: ['mindfulness', 'осознанность'] },
];

// ==================== USE-CASE #1: UnitPicker с Search ====================

export function UnitPickerSearchExample() {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState('');

  // Фильтрация единиц
  const filteredUnits = units.filter(unit => {
    if (!search) return true;
    const query = search.toLowerCase();
    return (
      unit.name.toLowerCase().includes(query) ||
      unit.id.toLowerCase().includes(query) ||
      unit.keywords.some(kw => kw.toLowerCase().includes(query))
    );
  });

  // Группировка отфильтрованных единиц
  const groupedUnits = filteredUnits.reduce((acc, unit) => {
    if (!acc[unit.group]) acc[unit.group] = [];
    acc[unit.group].push(unit);
    return acc;
  }, {} as Record<string, typeof units>);

  const groups = [
    { label: '📏 Расстояние', key: 'Расстояние' },
    { label: '⚖️ Вес', key: 'Вес' },
    { label: '⏱️ Время', key: 'Время' },
    { label: '🔢 Прочее', key: 'Прочее' },
  ];

  return (
    <div className="p-8">
      <h2 className="mb-4">UnitPicker с Search (22 единицы)</h2>
      
      <Dropdown.Root>
        <Dropdown.Trigger className="px-4 py-2 bg-blue-500 text-white rounded">
          {selected || 'Выбрать единицу'}
        </Dropdown.Trigger>
        
        <Dropdown.Content direction="down" width="auto">
          {/* Search компонент - CONTROLLED */}
          <Dropdown.Search 
            value={search}
            onChange={setSearch}
            placeholder="Поиск единиц..." 
          />
          
          {/* Результаты */}
          {filteredUnits.length === 0 ? (
            <Dropdown.Empty>Ничего не найдено</Dropdown.Empty>
          ) : (
            groups.map(group => {
              const groupUnits = groupedUnits[group.key];
              if (!groupUnits || groupUnits.length === 0) return null;
              
              return (
                <Dropdown.Group key={group.key} label={group.label}>
                  {groupUnits.map(unit => (
                    <Dropdown.Item
                      key={unit.id}
                      selected={selected === unit.name}
                      onClick={() => setSelected(unit.name)}
                    >
                      {unit.name}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Group>
              );
            })
          )}
        </Dropdown.Content>
      </Dropdown.Root>
      
      <p className="text-sm text-gray-500 mt-4">
        ✅ Попробуй ввести: "кило", "метр", "вес", "время"
      </p>
      <p className="text-sm text-gray-500">
        ✅ Поиск работает по: названию (км), id (kg), keywords (килограмм)
      </p>
    </div>
  );
}

// ==================== USE-CASE #2: CategoryPicker с Search ====================

export function CategoryPickerSearchExample() {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<string[]>([]);

  // Фильтрация категорий
  const filteredCategories = categories.filter(category => {
    if (!search) return true;
    const query = search.toLowerCase();
    return (
      category.name.toLowerCase().includes(query) ||
      category.keywords.some(kw => kw.toLowerCase().includes(query))
    );
  });

  // Группировка
  const groupedCategories = filteredCategories.reduce((acc, cat) => {
    if (!acc[cat.group]) acc[cat.group] = [];
    acc[cat.group].push(cat);
    return acc;
  }, {} as Record<string, typeof categories>);

  const groups = [
    { label: '💪 Здоровье', key: 'Здоровье' },
    { label: '🧠 Развитие', key: 'Развитие' },
  ];

  const toggleCategory = (id: string) => {
    setSelected(prev => 
      prev.includes(id) 
        ? prev.filter(x => x !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="p-8">
      <h2 className="mb-4">CategoryPicker с Search (multi-select)</h2>
      
      <Dropdown.Root closeOnSelect={false}>
        <Dropdown.Trigger className="px-4 py-2 bg-green-500 text-white rounded">
          Категории ({selected.length})
        </Dropdown.Trigger>
        
        <Dropdown.Content direction="down" width="auto">
          <Dropdown.Search 
            value={search}
            onChange={setSearch}
            placeholder="Поиск категорий..." 
          />
          
          {filteredCategories.length === 0 ? (
            <Dropdown.Empty>Ничего не найдено</Dropdown.Empty>
          ) : (
            groups.map(group => {
              const groupCats = groupedCategories[group.key];
              if (!groupCats || groupCats.length === 0) return null;
              
              return (
                <Dropdown.Group key={group.key} label={group.label}>
                  {groupCats.map(cat => (
                    <Dropdown.Item
                      key={cat.id}
                      icon={cat.icon}
                      selected={selected.includes(cat.id)}
                      onClick={() => toggleCategory(cat.id)}
                      badge={selected.includes(cat.id) ? '✓' : undefined}
                    >
                      {cat.name}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Group>
              );
            })
          )}
        </Dropdown.Content>
      </Dropdown.Root>
      
      <p className="text-sm text-gray-500 mt-4">
        ✅ Попробуй ввести: "фит", "кодинг", "еда", "mindfulness"
      </p>
      <p className="text-sm text-gray-500">
        ✅ Multi-select: можно выбрать несколько категорий
      </p>
    </div>
  );
}

// ==================== USE-CASE #3: Простой Search (без группировки) ====================

export function SimpleSearchExample() {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState('');

  const items = ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry', 'Fig', 'Grape'];
  
  const filtered = items.filter(item => 
    item.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8">
      <h2 className="mb-4">Простой Search (без группировки)</h2>
      
      <Dropdown.Root>
        <Dropdown.Trigger className="px-4 py-2 bg-purple-500 text-white rounded">
          {selected || 'Выбрать фрукт'}
        </Dropdown.Trigger>
        
        <Dropdown.Content direction="down" width="auto">
          <Dropdown.Search 
            value={search}
            onChange={setSearch}
            placeholder="Поиск..." 
          />
          
          {filtered.length === 0 ? (
            <Dropdown.Empty>Ничего не найдено</Dropdown.Empty>
          ) : (
            filtered.map(item => (
              <Dropdown.Item
                key={item}
                selected={selected === item}
                onClick={() => setSelected(item)}
              >
                {item}
              </Dropdown.Item>
            ))
          )}
        </Dropdown.Content>
      </Dropdown.Root>
      
      <p className="text-sm text-gray-500 mt-4">
        ✅ Минималистичный пример без излишеств
      </p>
    </div>
  );
}

// ==================== Все примеры вместе ====================

export function AllSearchExamples() {
  return (
    <div className="space-y-8">
      <UnitPickerSearchExample />
      <CategoryPickerSearchExample />
      <SimpleSearchExample />
    </div>
  );
}