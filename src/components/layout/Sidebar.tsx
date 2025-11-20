import { GoalIcon, BarChart3, Settings, Calendar, LayoutDashboard, Close } from '../icons';

interface SidebarProps {
  currentSection: string;
  onSectionChange: (section: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ currentSection, onSectionChange, isOpen, onClose }: SidebarProps) {
  const dashboardSection = { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard, disabled: true };
  
  const sections = [
    { id: 'habits', name: 'Трекер привычек', icon: GoalIcon },
    { id: 'analytics', name: 'Аналитика', icon: BarChart3, disabled: true },
    { id: 'calendar', name: 'Календарь', icon: Calendar, disabled: true },
  ];

  return (
    <aside 
      className={`fixed left-0 top-0 w-64 border-r border-gray-200 bg-white h-screen z-50 flex flex-col transition-transform duration-300 shadow-xl ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
        {/* Logo/Brand */}
        <div className="px-6 py-8 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center">
                <GoalIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-gray-900">Habits</h2>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-colors"
            >
              <Close className="w-5 h-5" />
            </button>
          </div>
        </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6">
        {/* Dashboard section */}
        <div className="mb-6">
          <button
            onClick={() => !dashboardSection.disabled && onSectionChange(dashboardSection.id)}
            disabled={dashboardSection.disabled}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              currentSection === dashboardSection.id
                ? 'bg-gray-900 text-white'
                : dashboardSection.disabled
                ? 'text-gray-300 cursor-not-allowed'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <dashboardSection.icon className="w-5 h-5" />
            <span>{dashboardSection.name}</span>
          </button>
        </div>
        
        {/* Other sections */}
        <div className="space-y-1">
          {sections.map((section) => {
            const Icon = section.icon;
            const isActive = currentSection === section.id;
            const isDisabled = section.disabled;

            return (
              <button
                key={section.id}
                onClick={() => !isDisabled && onSectionChange(section.id)}
                disabled={isDisabled}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive
                    ? 'bg-gray-900 text-white'
                    : isDisabled
                    ? 'text-gray-300 cursor-not-allowed'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{section.name}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Settings at bottom */}
      <div className="px-4 py-6 border-t border-gray-200">
        <button
          disabled
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 cursor-not-allowed"
        >
          <Settings className="w-5 h-5" />
          <span>Настройки</span>
        </button>
      </div>
    </aside>
  );
}
