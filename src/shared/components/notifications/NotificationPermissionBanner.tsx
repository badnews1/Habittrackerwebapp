/**
 * Баннер запроса разрешения на уведомления
 * 
 * Универсальный компонент для запроса разрешения на Web Notifications API.
 * Используется в различных модулях приложения (habits, tasks, finance и т.д.).
 * 
 * Функциональность:
 * - Отображается если разрешение не запрошено и баннер не был отклонён
 * - Запрос разрешения на уведомления
 * - Показ тестового уведомления при успешном разрешении
 * - Запоминание отклонения в localStorage
 * 
 * @module shared/components/notifications
 * Дата создания: начало проекта
 * Последнее обновление: 21 ноября 2025 - миграция в /shared для переиспользования
 */

import React, { useState, useEffect } from 'react';
import { Bell, Close } from '@/shared/icons';
import { Button } from '@/shared/components/button';

export const NotificationPermissionBanner: React.FC = () => {
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Проверяем нужно ли показывать баннер
    const checkPermission = () => {
      if ('Notification' in window) {
        const permission = Notification.permission;
        const wasDismissed = localStorage.getItem('notificationBannerDismissed');
        
        // Показываем баннер если разрешение не запрошено (default) и не было отклонено
        if (permission === 'default' && !wasDismissed) {
          setShow(true);
        }
      }
    };

    checkPermission();
  }, []);

  const handleRequestPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      
      if (permission === 'granted') {
        setShow(false);
        // Показываем тестовое уведомление
        new Notification('✅ Уведомления включены!', {
          body: 'Теперь вы будете получать напоминания о ваших привычках',
          icon: '/favicon.ico',
        });
      } else if (permission === 'denied') {
        setShow(false);
        localStorage.setItem('notificationBannerDismissed', 'true');
      }
    }
  };

  const handleDismiss = () => {
    setShow(false);
    setDismissed(true);
    localStorage.setItem('notificationBannerDismissed', 'true');
  };

  if (!show || dismissed) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md">
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 flex items-start gap-3">
        <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
          <Bell className="w-5 h-5 text-gray-900" />
        </div>
        
        <div className="flex-1">
          <h3 className="text-sm text-gray-900 mb-1">Включите уведомления</h3>
          <p className="text-xs text-gray-600 mb-3">
            Получайте напоминания о ваших привычках в выбранное время
          </p>
          
          <div className="flex gap-2">
            <Button
              variant="primary"
              onClick={handleRequestPermission}
              className="text-xs"
            >
              Включить
            </Button>
            <Button
              variant="secondary"
              onClick={handleDismiss}
              className="text-xs"
            >
              Позже
            </Button>
          </div>
        </div>
        
        <button
          onClick={handleDismiss}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <Close className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};