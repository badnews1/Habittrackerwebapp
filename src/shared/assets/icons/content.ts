/**
 * Контентные иконки для пользовательского выбора
 * 
 * Эти иконки показываются пользователю в пикерах (привычки, модули и т.д.)
 * Базовый набор: 100 иконок
 * 
 * Импорт всех иконок разом:
 * ```typescript
 * import * as ContentIcons from '@/shared/assets/icons/content';
 * 
 * const iconsList = Object.entries(ContentIcons).map(([name, Icon]) => ({
 *   name,
 *   Icon
 * }));
 * ```
 */

export {
  // Спорт и активность
  Dumbbell,
  Bike,
  Activity,
  Trophy,
  Award,
  Target,
  Flame,
  
  // Обучение и творчество
  Book,
  Pencil,
  Brush,
  Code,
  Music,
  Camera,
  Film,
  Palette,
  Feather,
  
  // Здоровье и wellness
  Heart,
  Apple,
  Droplet,
  Moon,
  Sun,
  Battery,
  
  // Еда и напитки
  Coffee,
  Pizza,
  IceCream,
  Cake,
  Cookie,
  Fish,
  
  // Эмоции и настроение
  Smile,
  Zap,
  Star,
  Lightbulb,
  CheckCircle,
  
  // Работа и бизнес
  Briefcase,
  Calendar,
  Clock,
  Mail,
  Phone,
  CreditCard,
  DollarSign,
  Wallet,
  BarChart,
  PieChart,
  
  // Путешествия и навигация
  Map,
  Compass,
  Navigation,
  Globe,
  Plane,
  Car,
  Train,
  Ship,
  Rocket,
  Mountain,
  
  // Дом и быт
  Home,
  Key,
  Lock,
  Umbrella,
  Glasses,
  Watch,
  
  // Коммуникация
  Users,
  MessageCircle,
  MessageSquare,
  Send,
  Inbox,
  
  // Природа
  Leaf,
  Cloud,
  Wind,
  TreePine,
  Flower,
  Dog,
  Cat,
  Bird,
  
  // Технологии
  Wifi,
  Radio,
  Tv,
  Video,
  Headphones,
  Mic,
  
  // Инструменты
  Hammer,
  Wrench,
  Scissors,
  Ruler,
  Sword,
  Shield,
  Scale,
  Brain,
  
  // Документы и файлы
  FileText,
  Folder,
  Archive,
  Save,
  Download,
  Upload,
  Bookmark,
  
  // Покупки
  ShoppingCart,
  ShoppingBag,
  Package,
  Gift,
  
  // Разное
  Flag,
  HelpCircle,
  Image,
  Footprints,
  
  // Некоторые системные иконки, которые также используются в контенте
  Trash2, // может использоваться как иконка привычки "Убрать мусор"
  
  // Типы (полезны для типизации пропсов компонентов)
  type LucideIcon,
  type LucideProps,
} from 'lucide-react';