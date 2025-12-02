export default {
  habit: {
    title: "Habits",
    name: "Name",
    description: "Description",
    icon: "Icon",
    color: "Color",
    addHabit: "Add Habit",
    editHabit: "Edit Habit",
    deleteHabit: "Delete Habit",
    section: "Section",
    tags: "Tags",
    type: "Type",
    unit: "Unit",
    targetValue: "Target",
    frequency: "Frequency",
    notes: "Notes",
    addNotes: "Add notes...",
    noName: "No name",
    noHabits: "No habits yet",
    createFirstHabit: "Create your first habit to start tracking"
  },
  type: {
    binary: "Binary",
    measurable: "Measurable",
    selectType: "Select Type",
    binaryDescription: "Complete or not complete",
    measurableDescription: "Track specific values"
  },
  target: {
    none: "No target",
    daily: "Daily target",
    weekly: "Weekly target",
    monthly: "Monthly target",
    value: "Target value",
    unit: "Unit"
  },
  // ℹ️ Единицы измерения перенесены в units.ts для устранения дублирования
  // Используйте units:units.{category}.{key} вместо habits:units.{key}
  completion: {
    completed: "Completed",
    notCompleted: "Not completed",
    partiallyCompleted: "Partially completed",
    markComplete: "Mark as complete",
    markIncomplete: "Mark as incomplete",
    enterValue: "Enter value",
    currentValue: "Current value",
    targetValue: "Target value"
  },
  frequency: {
    title: "Frequency",
    daily: "Every day",
    weekly: "Weekly",
    monthly: "Monthly",
    custom: "Custom",
    timesPerWeek: "{{count}} times per week",
    timesPerMonth: "{{count}} times per month",
    everyNDays: "Every {{count}} days",
    specificDays: "Specific days of the week",
    selectDays: "Select days",
    daysSelected: "{{count}} days selected"
  },
  strength: {
    title: "Habit Strength",
    value: "Strength",
    frozen: "Frozen",
    freezeStrength: "Freeze strength",
    unfreezeStrength: "Unfreeze strength",
    frozenTooltip: "Strength will not decrease when you miss this habit",
    description: "Habit strength shows how established this habit is based on your completion history"
  },
  reminders: {
    title: "Reminders",
    addReminder: "Add Reminder",
    editReminder: "Edit Reminder",
    deleteReminder: "Delete Reminder",
    noReminders: "No reminders",
    time: "Time",
    selectTime: "Select time",
    enabled: "Enabled",
    disabled: "Disabled"
  },
  stats: {
    title: "Statistics",
    currentStreak: "Current Streak",
    longestStreak: "Longest Streak",
    completionRate: "Completion Rate",
    totalCompletions: "Total Completions",
    thisWeek: "This Week",
    thisMonth: "This Month",
    allTime: "All Time",
    progress: "Progress",
    history: "History",
    viewStats: "View Statistics"
  },
  filter: {
    all: "All Habits",
    active: "Active",
    completed: "Completed",
    notCompleted: "Not Completed",
    bySection: "By Section",
    byTag: "By Tag",
    sortBy: "Sort by",
    sortByName: "Name",
    sortByStrength: "Strength",
    sortByCreated: "Date Created",
    sortByCompletion: "Completion Rate"
  },
  manage: {
    title: "Manage Habits",
    settings: "Settings",
    general: "General",
    frequency: "Frequency",
    reminders: "Reminders",
    measurable: "Measurable Settings",
    deleteConfirm: "Are you sure you want to delete this habit?",
    deleteWarning: "This action cannot be undone. All completion data will be lost.",
    reorder: "Reorder habits",
    dragToReorder: "Drag to reorder",
    filters: {
      tags: "Tags",
      sections: "Sections",
      trackingType: "Tracking Type",
      uncategorized: "Untagged"
    },
    delete: {
      title: "Delete Habit?",
      description: "Habit \"{{habitName}}\" and all completion history will be permanently deleted.",
      confirm: "Delete"
    }
  },
  calendar: {
    today: "Today",
    goToToday: "Go to today",
    previousMonth: "Previous month",
    nextMonth: "Next month",
    selectMonth: "Select month",
    selectPeriod: "Select period"
  },
  icons: {
    selectIcon: "Select Icon",
    noIcon: "No icon",
    searchIcons: "Search icons"
  },
  colors: {
    selectColor: "Select Color",
    noColor: "No color"
  },
  form: {
    newHabit: "New Habit",
    editHabit: "Edit Habit",
    nameAndIcon: "Name and Icon",
    section: "Section",
    tags: "Tags",
    trackingType: "Tracking Type",
    unitOfMeasurement: "Unit of Measurement",
    targetType: "Target Type",
    targetValue: "Target",
    targetPlaceholder: "e.g., 2 or 1.5",
    namePlaceholder: "e.g., Morning Run"
  },
  typePicker: {
    binaryTitle: "Simple Checkbox",
    binaryDescription: "For habits that are either done or not done.",
    binaryExample: "Example: \"Make the bed\", \"Meditation\"",
    measurableTitle: "Number Input",
    measurableDescription: "For habits where you need to reach a goal.",
    measurableExample: "Example: \"Drink 2L of water\", \"Read 10 pages\""
  },
  targetType: {
    min: "At least",
    max: "No more than"
  },
  notes: {
    label: "Notes",
    placeholder: "Add notes to the habit..."
  },
  frequencyConfig: {
    title: "Frequency",
    byDays: "By Days",
    perWeek: "Per Week",
    perMonth: "Per Month",
    interval: "Interval",
    every: "Every"
  },
  habitItem: {
    dragToReorder: "Drag to reorder",
    collapse: "Collapse",
    settings: "Habit settings",
    delete: "Delete habit",
    section: "Section",
    tags: "Tags",
    noTag: "No tag",
    clickToEdit: "Click to edit",
    untitled: "Untitled",
    usedInHabit: "habit",
    usedInHabits: "habits"
  },
  measurableSettings: {
    unit: "Unit of measurement",
    targetType: "Target Type",
    target: "Target",
    placeholder: "e.g., 2 or 1.5"
  }
} as const;