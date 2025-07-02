
export interface RegionConfig {
  name: string;
  flag: string;
  currency: string;
  description: string;
  paymentMethods: string[];
}

export const getRegionConfig = (region: 'algeria' | 'international'): RegionConfig => {
  const configs: Record<string, RegionConfig> = {
    algeria: {
      name: 'Algeria',
      flag: '🇩🇿',
      currency: 'DZD',
      description: 'Specialized pricing for Algerian students',
      paymentMethods: ['BaridiMob', 'CIB Bank']
    },
    international: {
      name: 'International',
      flag: '🌍',
      currency: 'EUR',
      description: 'International pricing in Euros',
      paymentMethods: ['Bank Transfer', 'SEPA']
    }
  };

  return configs[region] || configs.international;
};

export const detectUserRegion = async (): Promise<'algeria' | 'international'> => {
  try {
    // In production, this could use IP geolocation or user preferences
    // For now, default to Algeria as the primary market
    return 'algeria';
  } catch (error) {
    console.error('Failed to detect user region:', error);
    return 'algeria';
  }
};
