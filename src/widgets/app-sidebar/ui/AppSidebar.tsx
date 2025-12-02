import { CheckSquare, User } from '@/shared/assets/icons/system';
import { useNavigate, useLocation } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '../../../components/ui/avatar';
import { Tooltip, TooltipContent, TooltipTrigger } from '../../../components/ui/tooltip';
import { Button } from '../../../components/ui/button';
import { ThemeToggle } from '@/features/theme-switcher';
import { LanguageToggle } from '@/features/language-switcher';
import { useTranslation } from 'react-i18next';

/**
 * Боковое меню приложения
 * Статичная панель шириной 50px с навигацией и профилем
 */
export function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation('app');

  // Проверка активной страницы
  const isTrackerActive = location.pathname === '/';

  return (
    <aside className="fixed left-0 top-0 h-screen w-[50px] bg-bg-primary border-r border-border-default flex flex-col items-center z-20">
      {/* Аватарка профиля пользователя */}
      <div className="pt-4">
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="cursor-pointer">
              <Avatar className="w-9 h-9">
                <AvatarImage src="" alt={t('app.profile')} />
                <AvatarFallback className="bg-bg-secondary">
                  <User className="w-5 h-5 text-text-secondary" />
                </AvatarFallback>
              </Avatar>
            </div>
          </TooltipTrigger>
          <TooltipContent side="right" sideOffset={8}>
            {t('app.profile')}
          </TooltipContent>
        </Tooltip>
      </div>

      {/* Иконка трекера привычек */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={isTrackerActive ? 'ghostActive' : 'ghost'}
            size="icon"
            onClick={() => navigate('/')}
            className="mt-4"
            aria-label={t('app.habitTracker')}
          >
            <CheckSquare className="w-5 h-5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right" sideOffset={8}>
          {t('app.habitTracker')}
        </TooltipContent>
      </Tooltip>

      {/* Spacer - отталкивает переключатели вниз */}
      <div className="flex-1" />

      {/* Переключатель языка */}
      <div className="pb-2">
        <LanguageToggle />
      </div>

      {/* Переключатель темы */}
      <div className="pb-4">
        <ThemeToggle />
      </div>
    </aside>
  );
}