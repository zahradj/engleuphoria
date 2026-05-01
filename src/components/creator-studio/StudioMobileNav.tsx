import React, { useState } from 'react';
import { Map, Palette, Library, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { useCreator, CreatorStep } from './CreatorContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';

const NAV: Array<{ key: CreatorStep; tKey: string; icon: React.ElementType; emoji: string }> = [
  { key: 'blueprint', tKey: 'nav.blueprint', icon: Map, emoji: '🗺️' },
  { key: 'slide-builder', tKey: 'nav.slide_studio', icon: Palette, emoji: '🎨' },
  { key: 'library', tKey: 'nav.master_library', icon: Library, emoji: '📚' },
];

export const StudioMobileNav: React.FC = () => {
  const { currentStep, setCurrentStep } = useCreator();
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { t } = useTranslation();
  const [signingOut, setSigningOut] = useState(false);

  const handleLogout = async () => {
    if (signingOut) return;
    setSigningOut(true);
    try {
      await signOut();
      navigate('/login', { replace: true });
    } catch (err) {
      console.error('Logout error:', err);
      toast.error('Sign out failed — redirecting anyway.');
      navigate('/login', { replace: true });
    }
  };

  return (
    <nav className="md:hidden fixed bottom-0 start-0 end-0 z-50 bg-slate-950 border-t border-slate-800 flex items-center justify-around px-2 py-1 safe-area-pb">
      {NAV.map((item) => {
        const Icon = item.icon;
        const active = currentStep === item.key;
        const label = t(item.tKey);
        return (
          <button
            key={item.key}
            onClick={() => { setCurrentStep(item.key); navigate(`/content-creator/${item.key}`); }}
            className={cn(
              'flex flex-col items-center gap-0.5 px-3 py-2 rounded-lg text-[10px] font-medium transition-colors min-w-[60px]',
              active
                ? 'text-amber-300'
                : 'text-slate-400 active:text-white'
            )}
          >
            <Icon className={cn('h-5 w-5', active ? 'text-amber-300' : 'text-slate-500')} />
            <span className="truncate max-w-[64px]">{label}</span>
          </button>
        );
      })}
      <div className="flex flex-col items-center gap-0.5 px-2 py-2 min-w-[52px]">
        <LanguageSwitcher variant="ghost" size="sm" align="end" compact className="h-auto p-1 text-slate-400" />
      </div>
      <button
        onClick={handleLogout}
        disabled={signingOut}
        className="flex flex-col items-center gap-0.5 px-3 py-2 rounded-lg text-[10px] font-medium text-slate-400 active:text-white min-w-[60px] disabled:opacity-50"
      >
        <LogOut className="h-5 w-5 text-slate-500" />
        <span>{signingOut ? '…' : t('nav.logout')}</span>
      </button>
    </nav>
  );
};
