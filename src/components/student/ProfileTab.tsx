import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Camera, MapPin, Clock, Globe, Loader2, Check } from "lucide-react";
import { useStudentLevel } from '@/hooks/useStudentLevel';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import i18n from '@/lib/i18n';
import { toast } from 'sonner';

interface ProfileTabProps {
  studentName: string;
}

type LanguageCode = 'en' | 'es' | 'ar' | 'fr' | 'tr' | 'it';

const LANGUAGES: { code: LanguageCode; flag: string; nativeName: string }[] = [
  { code: 'en', flag: '🇬🇧', nativeName: 'English' },
  { code: 'es', flag: '🇪🇸', nativeName: 'Español' },
  { code: 'fr', flag: '🇫🇷', nativeName: 'Français' },
  { code: 'ar', flag: '🇸🇦', nativeName: 'العربية' },
  { code: 'tr', flag: '🇹🇷', nativeName: 'Türkçe' },
  { code: 'it', flag: '🇮🇹', nativeName: 'Italiano' },
];

const HUB_PROFILE_COLORS: Record<string, {
  iconColor: string;
  avatarBorder: string;
  avatarGradient: string;
  badgeBg: string;
  badgeText: string;
  buttonGradient: string;
}> = {
  playground: {
    iconColor: 'text-orange-500',
    avatarBorder: 'border-orange-300',
    avatarGradient: 'bg-gradient-to-r from-amber-500 to-orange-500',
    badgeBg: 'bg-orange-50',
    badgeText: 'text-orange-700',
    buttonGradient: 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600',
  },
  academy: {
    iconColor: 'text-indigo-500',
    avatarBorder: 'border-indigo-300',
    avatarGradient: 'bg-gradient-to-r from-indigo-500 to-purple-500',
    badgeBg: 'bg-indigo-50',
    badgeText: 'text-indigo-700',
    buttonGradient: 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600',
  },
  professional: {
    iconColor: 'text-emerald-500',
    avatarBorder: 'border-emerald-300',
    avatarGradient: 'bg-gradient-to-r from-emerald-500 to-teal-500',
    badgeBg: 'bg-emerald-50',
    badgeText: 'text-emerald-700',
    buttonGradient: 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600',
  },
};

export const ProfileTab = ({ studentName }: ProfileTabProps) => {
  const { studentLevel } = useStudentLevel();
  const { user } = useAuth();
  const { t } = useTranslation();
  const hubId = studentLevel || 'playground';
  const colors = HUB_PROFILE_COLORS[hubId] || HUB_PROFILE_COLORS.playground;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [fullName, setFullName] = useState(studentName);
  const [email, setEmail] = useState('');
  const [language, setLanguage] = useState<LanguageCode>(
    (i18n.language?.substring(0, 2) as LanguageCode) || 'en'
  );
  const [memberSince, setMemberSince] = useState<string | null>(null);

  // Load profile from DB
  useEffect(() => {
    if (!user?.id) return;
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from('users')
        .select('full_name, email, preferred_language, created_at')
        .eq('id', user.id)
        .maybeSingle();
      if (cancelled) return;
      if (error) {
        console.error('Error loading profile:', error);
        setLoading(false);
        return;
      }
      if (data) {
        setFullName(data.full_name || studentName);
        setEmail(data.email || '');
        if (data.preferred_language) {
          setLanguage(data.preferred_language as LanguageCode);
        }
        if (data.created_at) {
          const d = new Date(data.created_at);
          setMemberSince(d.toLocaleDateString(undefined, { month: 'short', year: 'numeric' }));
        }
      }
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [user?.id, studentName]);

  const handleLanguagePreview = (next: LanguageCode) => {
    setLanguage(next);
    // Live preview — switch UI immediately, persistence happens on Save
    i18n.changeLanguage(next);
  };

  const handleSave = async () => {
    if (!user?.id) return;
    if (!fullName.trim()) {
      toast.error(t('common.error', 'Error'), {
        description: t('sd.profile.nameRequired', 'Full name is required'),
      });
      return;
    }
    setSaving(true);
    try {
      const { error } = await supabase
        .from('users')
        .update({
          full_name: fullName.trim(),
          preferred_language: language,
        })
        .eq('id', user.id);
      if (error) throw error;
      toast.success(t('sd.profile.saved', 'Profile updated'));
    } catch (e: any) {
      console.error('Error saving profile:', e);
      toast.error(t('sd.profile.saveError', 'Could not save profile'), {
        description: e?.message,
      });
    } finally {
      setSaving(false);
    }
  };

  const initial = (fullName || studentName || '?').charAt(0).toUpperCase();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className={cn('h-5 w-5', colors.iconColor)} />
            {t('sd.profile.title', 'Your Profile')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="flex flex-col md:flex-row items-start gap-6">
              <div className="relative shrink-0">
                <Avatar className={cn('h-24 w-24 border-4', colors.avatarBorder)}>
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback className={cn(colors.avatarGradient, 'text-white text-2xl font-bold')}>
                    {initial}
                  </AvatarFallback>
                </Avatar>
                <Button size="sm" variant="outline" className="absolute -bottom-2 -right-2" disabled>
                  <Camera className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex-1 w-full space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">{t('sd.profile.fullName', 'Full Name')}</Label>
                    <Input
                      id="name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder={t('sd.profile.fullNamePlaceholder', 'Your full name')}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">{t('sd.profile.email', 'Email')}</Label>
                    <Input id="email" value={email} readOnly className="bg-muted" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="language" className="flex items-center gap-1.5">
                    <Globe className={cn('h-3.5 w-3.5', colors.iconColor)} />
                    {t('sd.profile.dashboardLanguage', 'Dashboard language')}
                  </Label>
                  <Select value={language} onValueChange={(v) => handleLanguagePreview(v as LanguageCode)}>
                    <SelectTrigger id="language" className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {LANGUAGES.map((lang) => (
                        <SelectItem key={lang.code} value={lang.code}>
                          <span className="flex items-center gap-2">
                            <span aria-hidden>{lang.flag}</span>
                            <span>{lang.nativeName}</span>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-1.5">
                    {t('sd.profile.dashboardLanguageHelp', 'Translates the dashboard interface only. Lessons stay in English.')}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>{t('sd.profile.englishLevel', 'English Level')}</Label>
                    <Badge variant="outline" className={cn('mt-2', colors.badgeBg, colors.badgeText)}>
                      A2 - Elementary
                    </Badge>
                  </div>
                  <div>
                    <Label>{t('sd.profile.currentCourse', 'Current Course')}</Label>
                    <Badge variant="outline" className={cn('mt-2', colors.badgeBg, colors.badgeText)}>
                      General English A2
                    </Badge>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>Algeria, UTC+1</span>
                  </div>
                  {memberSince && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{t('sd.profile.memberSince', 'Member since')} {memberSince}</span>
                    </div>
                  )}
                </div>

                <Button onClick={handleSave} disabled={saving} className={colors.buttonGradient}>
                  {saving ? (
                    <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> {t('sd.profile.saving', 'Saving...')}</>
                  ) : (
                    <><Check className="h-4 w-4 mr-2" /> {t('sd.profile.save', 'Save Changes')}</>
                  )}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
