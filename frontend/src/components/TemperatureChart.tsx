import React, { useEffect, useRef } from 'react';
import Highcharts from 'highcharts';
import HighchartsMore from 'highcharts/highcharts-more';
import { WeatherData } from '../types/weathertypes';

HighchartsMore(Highcharts);

interface TemperatureChartProps {
  weatherData: WeatherData;
}

const TemperatureChart: React.FC<TemperatureChartProps> = ({ weatherData }) => {
  const chartContainer = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (chartContainer.current && weatherData) {
      const intervals = weatherData.data.timelines[0].intervals;
      
      const chartData = intervals.map(interval => ({
        date: new Date(interval.startTime).getTime(),
        min: interval.values.temperatureMin,
        max: interval.values.temperatureMax
      }));

      const chartOptions: Highcharts.Options = {
        chart: {
          type: 'arearange',
          zooming: {
            type: 'x'
          },
          height: 450,
        },
        title: {
          text: 'Temperature Range (Min, Max)'
        },
        xAxis: {
          type: 'datetime'
        },
        yAxis: {
          title: {
            text: 'Temperature (°F)'
          }
        },
        tooltip: {
          shared: true,
          valueSuffix: '°F'
        },
        legend: {
          enabled: false
        },
        series: [{
          name: 'Temperature',
          type: 'arearange',
          data: chartData.map(point => [point.date, point.min, point.max]),
          color: {
            linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
            stops: [
              [0, 'rgba(255, 151, 16, 1)'],  
              [1, 'rgba(30, 192, 251, 0.8)']  
            ]
          },
          fillOpacity: 0.6
        }] as Highcharts.SeriesOptionsType[]
      };

      Highcharts.chart(chartContainer.current, chartOptions);
    }
  }, [weatherData]);

  return <div ref={chartContainer} />;
};

export default TemperatureChart;