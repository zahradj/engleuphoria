
export interface LocationInfo {
  country: string;
  countryCode: string;
  region: 'algeria' | 'international';
  currency: string;
  detected: boolean;
}

export const detectUserLocation = async (): Promise<LocationInfo> => {
  try {
    // Try to detect location using IP geolocation
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    
    const isAlgeria = data.country_code === 'DZ';
    
    return {
      country: data.country_name || 'Unknown',
      countryCode: data.country_code || 'XX',
      region: isAlgeria ? 'algeria' : 'international',
      currency: isAlgeria ? 'DZD' : 'USD',
      detected: true
    };
  } catch (error) {
    console.log('Location detection failed, defaulting to international');
    return {
      country: 'Unknown',
      countryCode: 'XX',
      region: 'international',
      currency: 'USD',
      detected: false
    };
  }
};

export const getRegionConfig = (region: 'algeria' | 'international') => {
  if (region === 'algeria') {
    return {
      flag: '🇩🇿',
      name: 'Algeria',
      currency: 'DZD',
      paymentMethods: ['BaridiMob', 'CIB', 'Cash'],
      description: 'Special pricing for Algerian students'
    };
  }
  
  return {
    flag: '🌍',
    name: 'International',
    currency: 'USD',
    paymentMethods: ['Stripe', 'PayPal', 'Credit Card'],
    description: 'International pricing'
  };
};
