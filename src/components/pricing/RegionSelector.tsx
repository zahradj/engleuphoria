
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Globe, Building, CreditCard } from "lucide-react";

interface RegionSelectorProps {
  selectedRegion: 'algeria' | 'international';
  onRegionChange: (region: 'algeria' | 'international') => void;
  detectedLocation?: string;
  autoDetected?: boolean;
}

export const RegionSelector: React.FC<RegionSelectorProps> = ({
  selectedRegion,
  onRegionChange,
  detectedLocation,
  autoDetected
}) => {
  return (
    <Card className="mb-8">
      <CardContent className="pt-6">
        <div className="text-center mb-6">
          <h3 className="text-lg font-semibold mb-2 flex items-center justify-center gap-2">
            <Globe className="h-5 w-5" />
            Choose Your Region
          </h3>
          {autoDetected && detectedLocation && (
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
              <MapPin className="h-4 w-4" />
              <span>Detected location: {detectedLocation}</span>
              <Badge variant="outline" className="text-xs">Auto-detected</Badge>
            </div>
          )}
          <p className="text-sm text-gray-500 mt-2">
            Prices vary by region for accessibility and fairness
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            variant={selectedRegion === 'algeria' ? 'default' : 'outline'}
            onClick={() => onRegionChange('algeria')}
            className="flex items-center gap-2 px-6 py-3"
            size="lg"
          >
            <span className="text-lg">🇩🇿</span>
            <div className="text-left">
              <div className="font-semibold">Algeria</div>
              <div className="text-xs opacity-80">DZD • BaridiMob • CIB</div>
            </div>
          </Button>
          
          <Button
            variant={selectedRegion === 'international' ? 'default' : 'outline'}
            onClick={() => onRegionChange('international')}
            className="flex items-center gap-2 px-6 py-3"
            size="lg"
          >
            <span className="text-lg">🇪🇺</span>
            <div className="text-left">
              <div className="font-semibold">International</div>
              <div className="text-xs opacity-80">EUR • Bank Transfer • SEPA</div>
            </div>
          </Button>
        </div>
        
        {selectedRegion === 'international' && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
              <Building className="h-4 w-4" />
              Banking Information for Payments
            </h4>
            <div className="space-y-2 text-sm text-blue-800">
              <div><strong>Bank:</strong> Banking Circle S.A.</div>
              <div><strong>Address:</strong> 2, Boulevard de la Foire L-1528 LUXEMBOURG</div>
              <div><strong>IBAN:</strong> LU574080000024260839</div>
              <div><strong>BIC:</strong> BCIRLULL</div>
              <div><strong>Beneficiary:</strong> Fatima zahra Djaanine</div>
            </div>
          </div>
        )}
        
        <div className="mt-4 text-center">
          <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Safe & Secure Payment</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>30-Day Refund Policy</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
