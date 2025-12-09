import { Card, CardContent } from '@/components/ui/card';
import { toPersianNumber } from '@/lib/persian';
import { Cloud, Sun, CloudRain, Snowflake, Wind, Droplets, Thermometer } from 'lucide-react';

interface WeatherData {
  temp: number;
  condition: 'sunny' | 'cloudy' | 'rainy' | 'snowy';
  humidity: number;
  wind: number;
}

const mockWeather: WeatherData = {
  temp: 8,
  condition: 'cloudy',
  humidity: 65,
  wind: 12,
};

const conditionIcons = {
  sunny: Sun,
  cloudy: Cloud,
  rainy: CloudRain,
  snowy: Snowflake,
};

const conditionLabels = {
  sunny: 'آفتابی',
  cloudy: 'ابری',
  rainy: 'بارانی',
  snowy: 'برفی',
};

const maintenanceTips = {
  sunny: 'هوا مناسب برای نظافت بیرونی و باغچه است',
  cloudy: 'بررسی پشت بام و ناودان‌ها پیشنهاد می‌شود',
  rainy: 'از نشتی آب در سقف و دیوارها اطمینان حاصل کنید',
  snowy: 'نمک‌پاشی محوطه و پارکینگ را فراموش نکنید',
};

export function WeatherWidget() {
  const Icon = conditionIcons[mockWeather.condition];

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/10">
              <Icon className="h-6 w-6 text-secondary" />
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="text-2xl font-bold">
                  {toPersianNumber(mockWeather.temp)}°
                </span>
                <span className="text-sm text-muted-foreground">
                  {conditionLabels[mockWeather.condition]}
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Droplets className="h-3 w-3" />
                  {toPersianNumber(mockWeather.humidity)}٪
                </span>
                <span className="flex items-center gap-1">
                  <Wind className="h-3 w-3" />
                  {toPersianNumber(mockWeather.wind)} کیلومتر
                </span>
              </div>
            </div>
          </div>
          <div className="text-left text-xs text-muted-foreground">
            <p>تهران</p>
            <p>امروز</p>
          </div>
        </div>

        {/* Maintenance Tip */}
        <div className="mt-3 rounded-lg bg-muted/50 p-2">
          <p className="text-xs text-muted-foreground">
            <span className="font-medium text-foreground">نکته نگهداری: </span>
            {maintenanceTips[mockWeather.condition]}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
