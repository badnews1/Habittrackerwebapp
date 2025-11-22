import React from 'react';
import {
  Dumbbell, Book, Coffee, Zap, Heart, Droplet, Apple, Moon, Smile, CheckCircle,
  Target, Music, Camera, Brush, Code, Briefcase, Users, Phone, Mail, Bookmark,
  Lightbulb, Star, Clock, Calendar, Award, Gift, Leaf, Sun, Cloud, HelpCircle,
  type LucideIcon
} from '@/shared/icons';

// Export DragHandle from the icons folder
export { DragHandle } from '@/shared/icons';

// Small filled circle icon component
export const SmallFilledCircle: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="12" cy="12" r="4" />
  </svg>
);

/**
 * Icon mapping for habit icons
 * Maps icon key strings to their corresponding Lucide icon components
 */
export const ICON_MAP: Record<string, LucideIcon | React.FC<{ className?: string }>> = {
  circle: SmallFilledCircle,
  dumbbell: Dumbbell,
  book: Book,
  coffee: Coffee,
  zap: Zap,
  heart: Heart,
  droplet: Droplet,
  apple: Apple,
  moon: Moon,
  smile: Smile,
  checkCircle: CheckCircle,
  target: Target,
  music: Music,
  camera: Camera,
  brush: Brush,
  code: Code,
  briefcase: Briefcase,
  users: Users,
  phone: Phone,
  mail: Mail,
  bookmark: Bookmark,
  lightbulb: Lightbulb,
  star: Star,
  clock: Clock,
  calendar: Calendar,
  award: Award,
  gift: Gift,
  leaf: Leaf,
  sun: Sun,
  cloud: Cloud,
  helpCircle: HelpCircle,
};

/**
 * Available icon options for the icon picker
 * Each option includes a key, label, and the icon component
 */
export const ICON_OPTIONS = [
  { key: 'circle', label: 'Базовое', Icon: SmallFilledCircle },
  { key: 'dumbbell', label: 'Тренировки', Icon: Dumbbell },
  { key: 'book', label: 'Чтение', Icon: Book },
  { key: 'coffee', label: 'Утренний ритуал', Icon: Coffee },
  { key: 'zap', label: 'Энергия', Icon: Zap },
  { key: 'heart', label: 'Здоровье', Icon: Heart },
  { key: 'droplet', label: 'Вода', Icon: Droplet },
  { key: 'apple', label: 'Питание', Icon: Apple },
  { key: 'moon', label: 'Сон', Icon: Moon },
  { key: 'smile', label: 'Медитация', Icon: Smile },
  { key: 'checkCircle', label: 'Задачи', Icon: CheckCircle },
  { key: 'target', label: 'Цели', Icon: Target },
  { key: 'music', label: 'Музыка', Icon: Music },
  { key: 'camera', label: 'Фото', Icon: Camera },
  { key: 'brush', label: 'Творчество', Icon: Brush },
  { key: 'code', label: 'Программирование', Icon: Code },
  { key: 'briefcase', label: 'Работа', Icon: Briefcase },
  { key: 'users', label: 'Социальное', Icon: Users },
  { key: 'phone', label: 'Звонки', Icon: Phone },
  { key: 'mail', label: 'Почта', Icon: Mail },
  { key: 'bookmark', label: 'Обучение', Icon: Bookmark },
  { key: 'lightbulb', label: 'Идеи', Icon: Lightbulb },
  { key: 'star', label: 'Важное', Icon: Star },
  { key: 'clock', label: 'Время', Icon: Clock },
  { key: 'calendar', label: 'Планирование', Icon: Calendar },
  { key: 'award', label: 'Достижения', Icon: Award },
  { key: 'gift', label: 'Благодарность', Icon: Gift },
  { key: 'leaf', label: 'Экология', Icon: Leaf },
  { key: 'sun', label: 'Утро', Icon: Sun },
  { key: 'cloud', label: 'Вечер', Icon: Cloud },
  { key: 'helpCircle', label: 'Помощь', Icon: HelpCircle },
] as const;

/**
 * Default icon key used when no icon is specified
 */
export const DEFAULT_ICON_KEY = 'circle';

/**
 * Number of icons to display per page in the icon picker
 */
export const ICONS_PER_PAGE = 10;
