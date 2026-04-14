import { useState, useEffect } from 'react';
import { StudentPackagePurchase } from '@/types/pricing';
import { lessonPricingService } from '@/services/lessonPricingService';
import { bookingValidationService } from '@/services/bookingValidationService';

interface PackageValidationResult {
  hasActivePackages: boolean;
  packages: StudentPackagePurchase[];
  totalCredits: number;
  trialAvailable: boolean;
  loading: boolean;
  refresh: () => Promise<void>;
}

export const usePackageValidation = (studentId: string | null): PackageValidationResult => {
  const [packages, setPackages] = useState<StudentPackagePurchase[]>([]);
  const [trialAvailable, setTrialAvailable] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadPackages = async () => {
    if (!studentId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const [data, isTrialEligible] = await Promise.all([
        lessonPricingService.getStudentPackages(studentId),
        bookingValidationService.isEligibleForTrial(studentId),
      ]);
      setPackages(data);
      setTrialAvailable(isTrialEligible);
    } catch (error) {
      console.error('Error loading packages for validation:', error);
      setPackages([]);
      setTrialAvailable(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPackages();
  }, [studentId]);

  const hasActivePackages = packages.some(pkg => pkg.lessons_remaining > 0);
  const totalCredits = packages.reduce((sum, pkg) => sum + pkg.lessons_remaining, 0);

  return {
    hasActivePackages,
    packages,
    totalCredits,
    trialAvailable,
    loading,
    refresh: loadPackages
  };
};
