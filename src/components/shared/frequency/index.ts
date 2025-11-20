/**
 * Barrel export для системы частоты
 * Предоставляет публичный API модуля
 */
export { FrequencyEditor } from './FrequencyEditor';
export type { FrequencyData, FrequencyType } from '../../../types/frequency';

// Внутренний компонент для переиспользования (не экспортируется наружу)
// FrequencyButton и FrequencyInput используются только внутри Section-компонентов