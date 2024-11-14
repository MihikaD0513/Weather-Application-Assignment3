export interface WeatherInfo {
    name: string;
    path: string;
  }
  
  export const weatherCodeMap: { [key: number]: WeatherInfo } = {
    1000: {
      name: "Clear",
      path: "/images/clear_day.svg"
    },
    1100: {
      name: "Mostly Clear",
      path: "/images/mostly_clear_day.svg"
    },
    1101: {
      name: "Partly Cloudy",
      path: "/images/partly_cloudy_day.svg"
    },
    1102: {
      name: "Mostly Cloudy",
      path: "/images/mostly_cloudy.svg"
    },
    1001: {
      name: "Cloudy",
      path: "/images/cloudy.svg"
    },
    2000: {
      name: "Fog",
      path: "/images/fog.svg"
    },
    2100: {
      name: "Light Fog",
      path: "/images/fog_light.svg"
    },
    4000: {
      name: "Drizzle",
      path: "/images/drizzle.svg"
    },
    4001: {
      name: "Rain",
      path: "/images/rain.svg"
    },
    4200: {
      name: "Light Rain",
      path: "/images/rain_light.svg"
    },
    4201: {
      name: "Heavy Rain",
      path: "/images/rain_heavy.svg"
    },
    5000: {
      name: "Snow",
      path: "/images/snow.svg"
    },
    5001: {
      name: "Flurries",
      path: "/images/flurries.svg"
    },
    5100: {
      name: "Light Snow",
      path: "/images/snow_light.svg"
    },
    5101: {
      name: "Heavy Snow",
      path: "/images/snow_heavy.svg"
    },
    6000: {
      name: "Freezing Drizzle",
      path: "/images/freezing_drizzle.svg"
    },
    6001: {
      name: "Freezing Rain",
      path: "/images/freezing_rain.svg"
    },
    6200: {
      name: "Light Freezing Rain",
      path: "/images/freezing_rain_light.svg"
    },
    6201: {
      name: "Heavy Freezing Rain",
      path: "/images/freezing_rain_heavy.svg"
    },
    7000: {
      name: "Ice Pellets",
      path: "/images/ice_pellets.svg"
    },
    7101: {
      name: "Heavy Ice Pellets",
      path: "/images/ice_pellets_heavy.svg"
    },
    7102: {
      name: "Light Ice Pellets",
      path: "/images/ice_pellets_light.svg"
    },
    8000: {
      name: "Thunderstorm",
      path: "/images/thunderstorm.svg"
    }
  };
  
  export const getWeatherInfo = (code: number): WeatherInfo => {
    return weatherCodeMap[code] || weatherCodeMap[0]; 
  };
  
  export const getWeatherName = (code: number): string => {
    return getWeatherInfo(code).name;
  };

  export const getWeatherPath = (code: number): string => {
    return getWeatherInfo(code).path;
  };