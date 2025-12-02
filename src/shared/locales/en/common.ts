export default {
  common: {
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    edit: "Edit",
    close: "Close",
    confirm: "Confirm",
    back: "Back",
    next: "Next",
    apply: "Apply",
    search: "Search",
    filter: "Filter",
    sort: "Sort",
    add: "Add",
    remove: "Remove",
    clear: "Clear",
    reset: "Reset",
    loading: "Loading...",
    error: "Error",
    success: "Success",
    warning: "Warning",
    info: "Info",
    month: "Month",
    year: "Year",
  },
  
  // Склонения и множественные формы
  plurals: {
    // Дни
    day_one: "day",
    day_other: "days",
    
    // Разы
    time_one: "time",
    time_other: "times",
    
    // Привычки
    habit_one: "habit",
    habit_other: "habits",
    
    // Напоминания
    reminder_one: "reminder",
    reminder_other: "reminders",
    
    // Фразы для частоты
    timesPerWeek_one: "time per week",
    timesPerWeek_other: "times per week",
    
    timesPerMonth_one: "time per month",
    timesPerMonth_other: "times per month",
    
    // Единицы измерения
    unit_разы_one: "time",
    unit_разы_other: "times",
    
    unit_штуки_one: "piece",
    unit_штуки_other: "pieces",
    
    unit_баллы_one: "point",
    unit_баллы_other: "points",
    
    unit_минуты_one: "minute",
    unit_минуты_other: "minutes",
    
    unit_часы_one: "hour",
    unit_часы_other: "hours",
    
    unit_шаги_one: "step",
    unit_шаги_other: "steps",
    
    unit_километры_one: "kilometer",
    unit_километры_other: "kilometers",
    
    unit_метры_one: "meter",
    unit_метры_other: "meters",
    
    unit_подходы_one: "set",
    unit_подходы_other: "sets",
    
    unit_калории_one: "calorie",
    unit_калории_other: "calories",
    
    unit_килограммы_one: "kilogram",
    unit_килограммы_other: "kilograms",
    
    unit_граммы_one: "gram",
    unit_граммы_other: "grams",
    
    unit_стаканы_one: "glass",
    unit_стаканы_other: "glasses",
    
    unit_литры_one: "liter",
    unit_литры_other: "liters",
    
    unit_милилитры_one: "milliliter",
    unit_милилитры_other: "milliliters",
    
    unit_порции_one: "serving",
    unit_порции_other: "servings",
    
    unit_чашки_one: "cup",
    unit_чашки_other: "cups",
    
    unit_страницы_one: "page",
    unit_страницы_other: "pages",
    
    unit_слова_one: "word",
    unit_слова_other: "words",
    
    unit_главы_one: "chapter",
    unit_главы_other: "chapters",
    
    unit_задачи_one: "task",
    unit_задачи_other: "tasks",
  },
  
  weekdays: {
    full: {
      monday: "Monday",
      tuesday: "Tuesday",
      wednesday: "Wednesday",
      thursday: "Thursday",
      friday: "Friday",
      saturday: "Saturday",
      sunday: "Sunday",
    },
    short: {
      monday: "Mon",
      tuesday: "Tue",
      wednesday: "Wed",
      thursday: "Thu",
      friday: "Fri",
      saturday: "Sat",
      sunday: "Sun",
    },
    shortest: {
      monday: "Mo",
      tuesday: "Tu",
      wednesday: "We",
      thursday: "Th",
      friday: "Fr",
      saturday: "Sa",
      sunday: "Su",
    },
  },
  
  months: {
    short: {
      january: "Jan",
      february: "Feb",
      march: "Mar",
      april: "Apr",
      may: "May",
      june: "Jun",
      july: "Jul",
      august: "Aug",
      september: "Sep",
      october: "Oct",
      november: "Nov",
      december: "Dec"
    },
    full: {
      january: "January",
      february: "February",
      march: "March",
      april: "April",
      may: "May",
      june: "June",
      july: "July",
      august: "August",
      september: "September",
      october: "October",
      november: "November",
      december: "December"
    }
  },
  
  frequency: {
    daily: "Daily",
    weekly: "Weekly",
    monthly: "Monthly",
    custom: "Custom",
    timesPerWeek: "times per week",
    timesPerMonth: "times per month",
    specificDays: "Specific days",
    everyNDays: "Every N days",
    type: "Frequency Type",
    target: "Target"
  },
  
  notifications: {
    permission: {
      title: "Enable Notifications",
      description: "Get reminders for your habits to stay on track",
      enable: "Enable Notifications",
      dismiss: "Not Now"
    },
    granted: "Notifications enabled",
    denied: "Notifications blocked",
    default: "Notifications not configured"
  }
} as const;