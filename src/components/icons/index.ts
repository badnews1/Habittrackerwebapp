/**
 * Централизованный файл импорта всех иконок
 * 
 * Включает:
 * 1. Иконки из lucide-react (библиотечные)
 * 2. Алиасы для удобства использования
 * 
 * Преимущества:
 * - Единая точка входа для всех иконок
 * - Легко заменить библиотечную иконку на кастомную
 * - Tree-shaking сохраняется при использовании именованных импортов
 * - Все иконки в одном месте для лёгкого управления
 */

// === ПРЯМОЙ РЕЭКСПОРТ ИЗ LUCIDE-REACT ===

export {
  // Навигация
  ArrowLeft,
  X,
  XIcon,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  
  // Действия
  Plus,
  Edit,
  Trash2,
  Check,
  Move,
  Undo,
  
  // Уведомления
  Bell,
  BellOff,
  
  // Статистика
  Flame,
  TrendingUp,
  Calendar,
  Trophy,
  Award,
  
  // Типы привычек
  CheckSquare,
  CheckCircle2,
  Hash,
  
  // Частота
  Repeat,
  
  // UI элементы
  Filter,
  Tag,
  Grip,
  GripVertical,
  
  // Навигация Sidebar
  Target,
  BarChart3,
  Settings,
  LayoutDashboard,
  
  // Разное
  Bug,
  
  // Иконки привычек
  Dumbbell,
  Book,
  Coffee,
  Zap,
  Heart,
  Droplet,
  Apple,
  Moon,
  Smile,
  CheckCircle,
  Music,
  Camera,
  Brush,
  Code,
  Briefcase,
  Users,
  Phone,
  Mail,
  Bookmark,
  Lightbulb,
  Star,
  Clock,
  Gift,
  Leaf,
  Sun,
  Cloud,
  HelpCircle,
} from 'lucide-react';

// === АЛИАСЫ ===

// Алиас для drag handle (GripVertical → DragHandle)
export { GripVertical as DragHandle } from 'lucide-react';

// UI алиасы для некрасивых технических названий (улучшают читаемость)
export { X as Close } from 'lucide-react';
export { Trash2 as Delete } from 'lucide-react';

// Доменные алиасы для трекера привычек (специфика домена)
export { Flame as StreakIcon } from 'lucide-react';
export { TrendingUp as ProgressIcon } from 'lucide-react';
export { Trophy as AchievementIcon } from 'lucide-react';
export { Target as GoalIcon } from 'lucide-react';
export { Repeat as FrequencyIcon } from 'lucide-react';
export { Bell as NotificationIcon } from 'lucide-react';

// Алиасы для типов привычек (специфика домена)
export { CheckSquare as BinaryHabitIcon } from 'lucide-react';
export { Hash as MeasurableHabitIcon } from 'lucide-react';

// === ТИПЫ ===

// Тип компонента иконки из lucide-react (полезно для пропсов)
export type { LucideIcon } from 'lucide-react';

// Тип пропсов иконок из lucide-react
export type { LucideProps } from 'lucide-react';