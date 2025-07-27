import { useState, useEffect } from 'react';
import { StudentPackagePurchase } from '@/types/pricing';
import { lessonPricingService } from '@/services/lessonPricingService';

interface PackageValidationResult {
  hasActivePackages: boolean;
  packages: StudentPackagePurchase[];
  totalCredits: number;
  loading: boolean;
  refresh: () => Promise<void>;
}

export const usePackageValidation = (studentId: string | null): PackageValidationResult => {
  const [packages, setPackages] = useState<StudentPackagePurchase[]>([]);
  const [loading, setLoading] = useState(true);

  const loadPackages = async () => {
    if (!studentId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await lessonPricingService.getStudentPackages(studentId);
      setPackages(data);
    } catch (error) {
      console.error('Error loading packages for validation:', error);
      setPackages([]);
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
    loading,
    refresh: loadPackages
  };
};