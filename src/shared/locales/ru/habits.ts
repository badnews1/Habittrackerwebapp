export default {
  habit: {
    title: "Привычки",
    name: "Название",
    description: "Описание",
    icon: "Иконка",
    color: "Цвет",
    addHabit: "Добавить привычку",
    editHabit: "Редактировать привычку",
    deleteHabit: "Удалить привычку",
    section: "Раздел",
    tags: "Теги",
    type: "Тип",
    unit: "Единица измерения",
    targetValue: "Цель",
    frequency: "Частота",
    notes: "Заметки",
    addNotes: "Добавить заметки...",
    noName: "Без названия",
    noHabits: "Пока нет привычек",
    createFirstHabit: "Создайте свою первую привычку для начала отслеживания"
  },
  type: {
    binary: "Бинарная",
    measurable: "Измеримая",
    selectType: "Выберите тип",
    binaryDescription: "Выполнено или не выполнено",
    measurableDescription: "Отслеживание конкретных значений"
  },
  target: {
    none: "Без цели",
    daily: "Ежедневная цель",
    weekly: "Еженедельная цель",
    monthly: "Ежемесячная цель",
    value: "Целевое значение",
    unit: "Единица измерения"
  },
  // ℹ️ Единицы измерения перенесены в units.ts для устранения дублирования
  // Используйте units:units.{category}.{key} вместо habits:units.{key}
  completion: {
    completed: "Выполнено",
    notCompleted: "Не выполнено",
    partiallyCompleted: "Частично выполнено",
    markComplete: "Отметить как выполненное",
    markIncomplete: "Отметить как невыполненное",
    enterValue: "Введите значение",
    currentValue: "Текущее значение",
    targetValue: "Целевое значение"
  },
  frequency: {
    title: "Частота",
    daily: "Каждый день",
    weekly: "Еженедельно",
    monthly: "Ежемесячно",
    custom: "Произвольно",
    timesPerWeek: "{{count}} раз в неделю",
    timesPerMonth: "{{count}} раз в месяц",
    everyNDays: "Каждые {{count}} дней",
    specificDays: "Определённые дни недели",
    selectDays: "Выберите дни",
    daysSelected: "Выбрано дней: {{count}}"
  },
  strength: {
    title: "Сила привычки",
    value: "Сила",
    frozen: "Заморожена",
    freezeStrength: "Заморозить силу",
    unfreezeStrength: "Разморозить силу",
    frozenTooltip: "Сила не будет уменьшаться при пропуске этой привычки",
    description: "Сила привычки показывает насколько укоренилась привычка на основе истории выполнения"
  },
  reminders: {
    title: "Напоминания",
    addReminder: "Добавить напоминание",
    editReminder: "Редактировать напоминание",
    deleteReminder: "Удалить напоминание",
    noReminders: "Нет напоминаний",
    time: "Время",
    selectTime: "Выберите время",
    enabled: "Включено",
    disabled: "Отключено"
  },
  stats: {
    title: "Статистика",
    currentStreak: "Текущая серия",
    longestStreak: "Лучшая серия",
    completionRate: "Процент выполнения",
    totalCompletions: "Всего выполнений",
    thisWeek: "На этой неделе",
    thisMonth: "В этом месяце",
    allTime: "За всё время",
    progress: "Прогресс",
    history: "История",
    viewStats: "Посмотреть статистику"
  },
  filter: {
    all: "Все привычки",
    active: "Активные",
    completed: "Выполненные",
    notCompleted: "Не выполненные",
    bySection: "По разделу",
    byTag: "По тегу",
    sortBy: "Сортировать по",
    sortByName: "Названию",
    sortByStrength: "Силе",
    sortByCreated: "Дате создания",
    sortByCompletion: "Проценту выполнения"
  },
  manage: {
    title: "Управление привычками",
    settings: "Настройки",
    general: "Общие",
    frequency: "Частота",
    reminders: "Напоминания",
    measurable: "Настройки измеримой привычки",
    deleteConfirm: "Вы уверены, что хотите удалить эту привычку?",
    deleteWarning: "Это действие нельзя отменить. Все данные о выполнении будут потеряны.",
    reorder: "Изменить порядок привычек",
    dragToReorder: "Перетащите для изменения порядка",
    filters: {
      tags: "Теги",
      sections: "Разделы",
      trackingType: "Тип отслеживания",
      uncategorized: "Без тега"
    },
    delete: {
      title: "Удалить привычку?",
      description: "Привычка \"{{habitName}}\" и вся история выполнения будут удалены навсегда.",
      confirm: "Удалить"
    }
  },
  calendar: {
    today: "Сегодня",
    goToToday: "Перейти к сегодня",
    previousMonth: "Предыдущий месяц",
    nextMonth: "Следующий месяц",
    selectMonth: "Выбрать месяц",
    selectPeriod: "Выбор периода"
  },
  icons: {
    selectIcon: "Выбрать иконку",
    noIcon: "Без иконки",
    searchIcons: "Поиск иконок"
  },
  colors: {
    selectColor: "Выбрать цвет",
    noColor: "Без цвета"
  },
  form: {
    newHabit: "Новая привычка",
    editHabit: "Редактировать привычку",
    nameAndIcon: "Название и иконка",
    section: "Раздел",
    tags: "Теги",
    trackingType: "Тип отслеживания",
    unitOfMeasurement: "Единица измерения",
    targetType: "Тип цели",
    targetValue: "Цель",
    targetPlaceholder: "Например: 2 или 1.5",
    namePlaceholder: "Например: Утренняя пробежка"
  },
  typePicker: {
    binaryTitle: "Простая отметка",
    binaryDescription: "Для привычек, которые либо выполнены, либо нет.",
    binaryExample: "Например: \"Заправить постель\", \"Медитация\"",
    measurableTitle: "Ввод числа",
    measurableDescription: "Для привычек, где нужно достичь цели.",
    measurableExample: "Например: \"Выпить 2л воды\", \"Прочитать 10 страниц\""
  },
  targetType: {
    min: "Не меньше",
    max: "Не больше"
  },
  notes: {
    label: "Заметки",
    placeholder: "Добавьте заметки к привычке..."
  },
  frequencyConfig: {
    title: "Частота",
    byDays: "По дням",
    perWeek: "В неделю",
    perMonth: "В месяц",
    interval: "Интервал",
    every: "Каждые"
  },
  habitItem: {
    dragToReorder: "Перетащите для изменения порядка",
    collapse: "Свернуть",
    settings: "Настройки привычки",
    delete: "Удалить привычку",
    section: "Раздел",
    tags: "Теги",
    noTag: "Без тега",
    clickToEdit: "Нажмите для редактирования",
    untitled: "Без названия",
    usedInHabit: "привычке",
    usedInHabits: "привычках"
  },
  measurableSettings: {
    unit: "Единица измерения",
    targetType: "Тип цели",
    target: "Цель",
    placeholder: "Например: 2 или 1.5"
  }
} as const;