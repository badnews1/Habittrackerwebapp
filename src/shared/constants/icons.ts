import React from 'react';
import * as ContentIcons from '@/shared/assets/icons/content';
import { type LucideIcon } from '@/shared/assets/icons/system';

/** Иконка маленького заполненного круга */
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
 * Единый источник всех иконок приложения
 * ICON_MAP и типы генерируются автоматически из этого массива
 */
export const ICON_OPTIONS = [
  { key: 'circle', Icon: SmallFilledCircle },
  { key: 'dumbbell', Icon: ContentIcons.Dumbbell },
  { key: 'book', Icon: ContentIcons.Book },
  { key: 'coffee', Icon: ContentIcons.Coffee },
  { key: 'zap', Icon: ContentIcons.Zap },
  { key: 'heart', Icon: ContentIcons.Heart },
  { key: 'droplet', Icon: ContentIcons.Droplet },
  { key: 'apple', Icon: ContentIcons.Apple },
  { key: 'moon', Icon: ContentIcons.Moon },
  { key: 'smile', Icon: ContentIcons.Smile },
  { key: 'checkCircle', Icon: ContentIcons.CheckCircle },
  { key: 'target', Icon: ContentIcons.Target },
  { key: 'music', Icon: ContentIcons.Music },
  { key: 'camera', Icon: ContentIcons.Camera },
  { key: 'brush', Icon: ContentIcons.Brush },
  { key: 'code', Icon: ContentIcons.Code },
  { key: 'briefcase', Icon: ContentIcons.Briefcase },
  { key: 'users', Icon: ContentIcons.Users },
  { key: 'phone', Icon: ContentIcons.Phone },
  { key: 'mail', Icon: ContentIcons.Mail },
  { key: 'bookmark', Icon: ContentIcons.Bookmark },
  { key: 'lightbulb', Icon: ContentIcons.Lightbulb },
  { key: 'star', Icon: ContentIcons.Star },
  { key: 'clock', Icon: ContentIcons.Clock },
  { key: 'calendar', Icon: ContentIcons.Calendar },
  { key: 'award', Icon: ContentIcons.Award },
  { key: 'gift', Icon: ContentIcons.Gift },
  { key: 'leaf', Icon: ContentIcons.Leaf },
  { key: 'sun', Icon: ContentIcons.Sun },
  { key: 'cloud', Icon: ContentIcons.Cloud },
  { key: 'helpCircle', Icon: ContentIcons.HelpCircle },
  { key: 'bike', Icon: ContentIcons.Bike },
  { key: 'mountain', Icon: ContentIcons.Mountain },
  { key: 'flame', Icon: ContentIcons.Flame },
  { key: 'wind', Icon: ContentIcons.Wind },
  { key: 'globe', Icon: ContentIcons.Globe },
  { key: 'home', Icon: ContentIcons.Home },
  { key: 'map', Icon: ContentIcons.Map },
  { key: 'compass', Icon: ContentIcons.Compass },
  { key: 'navigation', Icon: ContentIcons.Navigation },
  { key: 'flag', Icon: ContentIcons.Flag },
  { key: 'rocket', Icon: ContentIcons.Rocket },
  { key: 'plane', Icon: ContentIcons.Plane },
  { key: 'car', Icon: ContentIcons.Car },
  { key: 'train', Icon: ContentIcons.Train },
  { key: 'ship', Icon: ContentIcons.Ship },
  { key: 'package', Icon: ContentIcons.Package },
  { key: 'shoppingCart', Icon: ContentIcons.ShoppingCart },
  { key: 'shoppingBag', Icon: ContentIcons.ShoppingBag },
  { key: 'dollarSign', Icon: ContentIcons.DollarSign },
  { key: 'creditCard', Icon: ContentIcons.CreditCard },
  { key: 'wallet', Icon: ContentIcons.Wallet },
  { key: 'barChart', Icon: ContentIcons.BarChart },
  { key: 'pieChart', Icon: ContentIcons.PieChart },
  { key: 'activity', Icon: ContentIcons.Activity },
  { key: 'battery', Icon: ContentIcons.Battery },
  { key: 'wifi', Icon: ContentIcons.Wifi },
  { key: 'radio', Icon: ContentIcons.Radio },
  { key: 'tv', Icon: ContentIcons.Tv },
  { key: 'film', Icon: ContentIcons.Film },
  { key: 'image', Icon: ContentIcons.Image },
  { key: 'video', Icon: ContentIcons.Video },
  { key: 'headphones', Icon: ContentIcons.Headphones },
  { key: 'mic', Icon: ContentIcons.Mic },
  { key: 'messageCircle', Icon: ContentIcons.MessageCircle },
  { key: 'messageSquare', Icon: ContentIcons.MessageSquare },
  { key: 'inbox', Icon: ContentIcons.Inbox },
  { key: 'send', Icon: ContentIcons.Send },
  { key: 'download', Icon: ContentIcons.Download },
  { key: 'upload', Icon: ContentIcons.Upload },
  { key: 'fileText', Icon: ContentIcons.FileText },
  { key: 'folder', Icon: ContentIcons.Folder },
  { key: 'archive', Icon: ContentIcons.Archive },
  { key: 'trash', Icon: ContentIcons.Trash2 },
  { key: 'save', Icon: ContentIcons.Save },
  { key: 'umbrella', Icon: ContentIcons.Umbrella },
  { key: 'glasses', Icon: ContentIcons.Glasses },
  { key: 'watch', Icon: ContentIcons.Watch },
  { key: 'key', Icon: ContentIcons.Key },
  { key: 'lock', Icon: ContentIcons.Lock },
  { key: 'shield', Icon: ContentIcons.Shield },
  { key: 'sword', Icon: ContentIcons.Sword },
  { key: 'hammer', Icon: ContentIcons.Hammer },
  { key: 'wrench', Icon: ContentIcons.Wrench },
  { key: 'scissors', Icon: ContentIcons.Scissors },
  { key: 'ruler', Icon: ContentIcons.Ruler },
  { key: 'pencil', Icon: ContentIcons.Pencil },
  { key: 'footprints', Icon: ContentIcons.Footprints },
  { key: 'feather', Icon: ContentIcons.Feather },
  { key: 'palette', Icon: ContentIcons.Palette },
  { key: 'pizza', Icon: ContentIcons.Pizza },
  { key: 'iceCream', Icon: ContentIcons.IceCream },
  { key: 'cake', Icon: ContentIcons.Cake },
  { key: 'cookie', Icon: ContentIcons.Cookie },
  { key: 'fish', Icon: ContentIcons.Fish },
  { key: 'dog', Icon: ContentIcons.Dog },
  { key: 'cat', Icon: ContentIcons.Cat },
  { key: 'bird', Icon: ContentIcons.Bird },
  { key: 'treePine', Icon: ContentIcons.TreePine },
  { key: 'flower', Icon: ContentIcons.Flower },
] as const;

/**
 * Тип для элемента опции иконки
 */
export type IconOption = typeof ICON_OPTIONS[number];

/**
 * Тип для ключей иконок (автоматически извлекается из ICON_OPTIONS)
 */
export type IconKey = typeof ICON_OPTIONS[number]['key'];

/**
 * ICON_MAP генерируется автоматически из ICON_OPTIONS
 * Используется для быстрого доступа к иконке по ключу
 */
export const ICON_MAP = Object.fromEntries(
  ICON_OPTIONS.map(({ key, Icon }) => [key, Icon])
) as Record<IconKey, LucideIcon | React.FC<{ className?: string }>>;

/**
 * Функция для получения опций иконок с переводами
 * @param t - функция перевода из react-i18next
 * @returns массив опций иконок с переведенными labels
 */
export const getIconOptions = (t: (key: string) => string) => {
  return ICON_OPTIONS.map(({ key, Icon }) => ({
    key,
    label: t(`icons:icons.${key}`),
    Icon,
  }));
};