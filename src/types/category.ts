import { CATEGORY_COLORS } from '../constants/colors';

export interface Category {
  name: string;
  color: string;
}

// Реэкспортируем CATEGORY_COLORS для обратной совместимости
export { CATEGORY_COLORS };

// Helper to migrate old string[] categories to Category[]
export const migrateLegacyCategories = (categories: any[]): Category[] => {
  if (categories.length === 0) return [];
  
  // Check if it's already new format
  if (typeof categories[0] === 'object' && categories[0] !== null && 'color' in categories[0]) {
    // Migrate old color values to new ones
    return (categories as Category[]).map((cat, index) => {
      // Map old color format to new format
      const colorMap: { [key: string]: string } = {
        'bg-gray-100 text-gray-700 border-gray-200': 'bg-gray-200 text-gray-800 border-gray-300',
        'bg-red-100 text-red-700 border-red-200': 'bg-red-200 text-red-800 border-red-300',
        'bg-orange-100 text-orange-700 border-orange-200': 'bg-orange-200 text-orange-800 border-orange-300',
        'bg-yellow-100 text-yellow-700 border-yellow-200': 'bg-yellow-200 text-yellow-800 border-yellow-300',
        'bg-green-100 text-green-700 border-green-200': 'bg-green-200 text-green-800 border-green-300',
        'bg-teal-100 text-teal-700 border-teal-200': 'bg-teal-200 text-teal-800 border-teal-300',
        'bg-blue-100 text-blue-700 border-blue-200': 'bg-blue-200 text-blue-800 border-blue-300',
        'bg-indigo-100 text-indigo-700 border-indigo-200': 'bg-indigo-200 text-indigo-800 border-indigo-300',
        'bg-purple-100 text-purple-700 border-purple-200': 'bg-purple-200 text-purple-800 border-purple-300',
        'bg-pink-100 text-pink-700 border-pink-200': 'bg-pink-200 text-pink-800 border-pink-300',
        // Migrate from the too-bright 400 level back to 200
        'bg-gray-300 text-gray-800 border-gray-400': 'bg-gray-200 text-gray-800 border-gray-300',
        'bg-red-400 text-red-900 border-red-500': 'bg-red-200 text-red-800 border-red-300',
        'bg-orange-400 text-orange-900 border-orange-500': 'bg-orange-200 text-orange-800 border-orange-300',
        'bg-yellow-400 text-yellow-900 border-yellow-500': 'bg-yellow-200 text-yellow-800 border-yellow-300',
        'bg-green-400 text-green-900 border-green-500': 'bg-green-200 text-green-800 border-green-300',
        'bg-teal-400 text-teal-900 border-teal-500': 'bg-teal-200 text-teal-800 border-teal-300',
        'bg-blue-400 text-blue-900 border-blue-500': 'bg-blue-200 text-blue-800 border-blue-300',
        'bg-indigo-400 text-indigo-900 border-indigo-500': 'bg-indigo-200 text-indigo-800 border-indigo-300',
        'bg-purple-400 text-purple-900 border-purple-500': 'bg-purple-200 text-purple-800 border-purple-300',
        'bg-pink-400 text-pink-900 border-pink-500': 'bg-pink-200 text-pink-800 border-pink-300',
      };
      
      return {
        ...cat,
        color: colorMap[cat.color] || cat.color
      };
    });
  }
  
  // Migrate from old format - assign colors based on index
  return (categories as string[]).map((name, index) => ({
    name,
    color: CATEGORY_COLORS[index % CATEGORY_COLORS.length],
  }));
};

// Get category color classes
export const getCategoryColor = (categories: Category[], categoryName: string): string => {
  const category = categories.find(c => c.name === categoryName);
  return category?.color || CATEGORY_COLORS[0];
};