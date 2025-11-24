/**
 * Пример: Динамический responsive maxHeight
 * 
 * Демонстрация автоматического расчёта maxHeight на основе доступного пространства во viewport.
 * 
 * ТЕСТИРОВАНИЕ:
 * 1. Откройте dropdown внизу страницы (мало места) → maxHeight ~150-200px
 * 2. Откройте dropdown вверху страницы (много места) → maxHeight 240px (макс)
 * 3. Протестируйте на mobile (iPhone SE) → адаптивный размер
 * 4. Попробуйте direction="up" для dropdown внизу страницы
 * 
 * @module shared/constructors/dropdown/examples
 * @created 22 ноября 2025
 */

import { Dropdown } from '../Dropdown';
import { Check } from 'lucide-react';

export function ResponsiveMaxHeightExample() {
  return (
    <div className="p-8 space-y-96">
      {/* Dropdown вверху страницы (много места) */}
      <div className="flex flex-col items-start gap-4">
        <h3 className="text-sm font-medium">Dropdown вверху (много места)</h3>
        <Dropdown.Root>
          <Dropdown.Trigger className="px-4 py-2 bg-blue-500 text-white rounded">
            Открыть (вверху)
          </Dropdown.Trigger>
          <Dropdown.Content direction="down" width="auto">
            {Array.from({ length: 20 }, (_, i) => (
              <Dropdown.Item key={i} icon={Check}>
                Элемент #{i + 1}
              </Dropdown.Item>
            ))}
          </Dropdown.Content>
        </Dropdown.Root>
        <p className="text-xs text-gray-500">
          maxHeight: 240px (максимум) - много места во viewport
        </p>
      </div>

      {/* Dropdown внизу страницы (мало места) */}
      <div className="flex flex-col items-start gap-4">
        <h3 className="text-sm font-medium">Dropdown внизу (мало места)</h3>
        <Dropdown.Root>
          <Dropdown.Trigger className="px-4 py-2 bg-green-500 text-white rounded">
            Открыть (внизу)
          </Dropdown.Trigger>
          <Dropdown.Content direction="down" width="auto">
            {Array.from({ length: 20 }, (_, i) => (
              <Dropdown.Item key={i} icon={Check}>
                Элемент #{i + 1}
              </Dropdown.Item>
            ))}
          </Dropdown.Content>
        </Dropdown.Root>
        <p className="text-xs text-gray-500">
          maxHeight: ~150-200px (адаптивно) - мало места до края viewport
        </p>
      </div>

      {/* Dropdown с direction="up" */}
      <div className="flex flex-col items-start gap-4">
        <h3 className="text-sm font-medium">Dropdown вверх (direction="up")</h3>
        <Dropdown.Root>
          <Dropdown.Trigger className="px-4 py-2 bg-purple-500 text-white rounded">
            Открыть вверх
          </Dropdown.Trigger>
          <Dropdown.Content direction="up" width="auto">
            {Array.from({ length: 20 }, (_, i) => (
              <Dropdown.Item key={i} icon={Check}>
                Элемент #{i + 1}
              </Dropdown.Item>
            ))}
          </Dropdown.Content>
        </Dropdown.Root>
        <p className="text-xs text-gray-500">
          maxHeight: рассчитывается от triggerRect.top (пространство сверху)
        </p>
      </div>

      {/* Edge case: минимальный размер */}
      <div className="fixed bottom-4 left-4">
        <h3 className="text-sm font-medium mb-2">Edge case (у самого края)</h3>
        <Dropdown.Root>
          <Dropdown.Trigger className="px-4 py-2 bg-red-500 text-white rounded">
            Открыть у края
          </Dropdown.Trigger>
          <Dropdown.Content direction="down" width="auto">
            {Array.from({ length: 20 }, (_, i) => (
              <Dropdown.Item key={i} icon={Check}>
                Элемент #{i + 1}
              </Dropdown.Item>
            ))}
          </Dropdown.Content>
        </Dropdown.Root>
        <p className="text-xs text-gray-500 mt-2">
          maxHeight: минимум 128px (8rem) + автоматический скролл
        </p>
      </div>
    </div>
  );
}
