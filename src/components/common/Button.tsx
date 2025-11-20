import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Вариант стиля кнопки
   * @default 'primary'
   */
  variant?: ButtonVariant;
  
  /**
   * Размер кнопки
   * @default 'md'
   */
  size?: ButtonSize;
  
  /**
   * Растянуть кнопку на всю ширину
   * @default false
   */
  fullWidth?: boolean;
  
  /**
   * Дополнительные CSS классы
   */
  className?: string;
  
  /**
   * Содержимое кнопки
   */
  children: React.ReactNode;
}

/**
 * Универсальный компонент кнопки
 * Устраняет дублирование стилей кнопок по всему приложению
 * 
 * @example
 * <Button variant="primary" size="lg">Сохранить</Button>
 * <Button variant="secondary" onClick={onCancel}>Отмена</Button>
 * <Button variant="danger" disabled>Удалить</Button>
 * 
 * Дата создания: 19 ноября 2024
 */
export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  children,
  disabled,
  ...props
}) => {
  // Базовые стили для всех кнопок
  const baseStyles = 'rounded-lg transition-colors inline-flex items-center justify-center';
  
  // Стили для вариантов кнопок
  const variantStyles: Record<ButtonVariant, string> = {
    primary: 'bg-gray-900 text-white hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed',
    secondary: 'border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed',
    danger: 'bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed',
    ghost: 'text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed',
  };
  
  // Стили для размеров
  const sizeStyles: Record<ButtonSize, string> = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-6 py-3 text-[14px]',
    lg: 'px-8 py-4 text-base',
  };
  
  // Ширина
  const widthStyle = fullWidth ? 'w-full' : '';
  
  // Собираем все классы
  const combinedClassName = [
    baseStyles,
    variantStyles[variant],
    sizeStyles[size],
    widthStyle,
    className,
  ]
    .filter(Boolean)
    .join(' ');
  
  return (
    <button
      className={combinedClassName}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};
