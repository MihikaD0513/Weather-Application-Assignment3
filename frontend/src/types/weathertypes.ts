export type WeatherData = {
    data: {
        timelines: {
          timestep: string;
          startTime: string;
          endTime: string;
          intervals: Array<{
            startTime: string;
            values: {
              temperature: number;
              temperatureMin: number;
              temperatureMax: number;
              temperatureApparent: number;
              weatherCode: number;
              windSpeed: number;
              windDirection: number;
              humidity: number;
              pressureSurfaceLevel: number;
              visibility: number;
              cloudCover: number;
              sunriseTime: string;
              sunsetTime: string;
              precipitationProbability: number;
              
            };
          }>;
        }[];
      };
      city: string;
      state: string;
      latitude: number;
      longitude: number;
};
  
export type Location = {
    lat: number;
    lng: number;
};

export type Favorite = {
    _id: string;
    city: string;
    state: string;
    createdAt: string;
  };
  