/**
 * DebugPanel - панель отладки для разработки
 * 
 * Показывает текущее состояние тегов и других важных данных.
 * Используется только в режиме разработки.
 * 
 * @module shared/ui/debug-panel
 */

import React from 'react';
import { useHabitsStore } from '@/app/store';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const DebugPanel = () => {
  const { t } = useTranslation('debug');
  const { t: tTags } = useTranslation('tags');
  const tags = useHabitsStore((state) => state.tags);
  const sections = useHabitsStore((state) => state.sections);
  const addTag = useHabitsStore(state => state.addTag);

  const handleClearLocalStorage = () => {
    if (confirm('Очистить localStorage и перезагрузить страницу?')) {
      localStorage.removeItem('habits-storage');
      window.location.reload();
    }
  };

  const handleAddTestTag = () => {
    const testName = `Тест ${Date.now()}`;
    console.log('🧪 Добавляем тестовый тег:', testName);
    addTag(testName, 'blue');
  };

  // Получаем сырые данные из localStorage
  const localStorageData = React.useMemo(() => {
    try {
      const raw = localStorage.getItem('habits-storage');
      if (raw) {
        return JSON.parse(raw);
      }
    } catch (e) {
      return null;
    }
    return null;
  }, [tags, sections]); // Обновляем при изменении

  return (
    <Card className="fixed bottom-4 right-4 p-4 max-w-md z-50 bg-white shadow-lg border-2 border-status-warning">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-bold text-status-warning">🐛 Debug Panel</h3>
        <div className="flex gap-1">
          <Button 
            onClick={handleAddTestTag} 
            variant="outline" 
            size="sm"
            className="h-6 px-2 text-xs"
            title={t('debug.addTestTag')}
          >
            + {tTags('tags.tag')}
          </Button>
          <Button 
            onClick={handleClearLocalStorage} 
            variant="outline" 
            size="sm"
            className="h-6 px-2 text-xs"
            title={t('debug.clearStorage')}
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      </div>
      
      <div className="space-y-2 text-xs">
        <div>
          <strong>{t('debug.tagsInStore')}:</strong> {tags?.length || 0}
          <div className="ml-2 text-text-secondary">
            {tags?.map(t => `${t.name} (${t.color})`).join(', ') || 'Нет тегов'}
          </div>
        </div>
        
        <div>
          <strong>{t('debug.sectionsInStore')}:</strong> {sections?.length || 0}
        </div>

        <div>
          <strong>localStorage['habits-storage']:</strong>
          {localStorageData ? (
            <div className="ml-2 text-text-secondary">
              <div>tags: {localStorageData.state?.tags?.length || 0}</div>
              <div className="text-[10px] max-h-20 overflow-y-auto">
                {JSON.stringify(localStorageData.state?.tags, null, 2)}
              </div>
            </div>
          ) : (
            <span className="ml-2 text-status-error">Нет данных</span>
          )}
        </div>
      </div>
    </Card>
  );
};