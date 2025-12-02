/**
 * Универсальный header приложения
 * 
 * Переиспользуемый виджет для отображения header'а на всех страницах приложения.
 * Обеспечивает единообразный дизайн (отступы, высота, стили) и позволяет
 * кастомизировать содержимое через пропсы.
 * 
 * @module widgets/app-header/ui/AppHeader
 * @created 1 декабря 2025
 * @updated 1 декабря 2025 - унификация сепаратора на shadcn Separator
 */

import React from 'react';
import { Separator } from '@/components/ui/separator';

interface AppHeaderProps {
  /** Левый элемент (иконка, кнопка назад и т.д.) */
  leftElement?: React.ReactNode;
  
  /** Заголовок страницы */
  title: string;
  
  /** Правый элемент (опционально, для будущих нужд) */
  rightElement?: React.ReactNode;
}

export function AppHeader({ leftElement, title, rightElement }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-10 bg-bg-primary">
      <div className="h-11 px-6 flex items-center gap-2">
        {leftElement}
        <h1 className="text-base text-text-primary">{title}</h1>
        {rightElement && <div className="ml-auto">{rightElement}</div>}
      </div>
      <Separator />
    </header>
  );
}
