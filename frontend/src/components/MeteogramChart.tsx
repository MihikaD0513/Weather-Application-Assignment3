import React, { useEffect, useRef } from 'react';
import Highcharts from 'highcharts';
import HighchartsMore from 'highcharts/highcharts-more';
import HighchartsWindbarb from 'highcharts/modules/windbarb';
import { WeatherData } from '../types/weathertypes';

HighchartsMore(Highcharts);
HighchartsWindbarb(Highcharts);

interface MeteogramChartProps {
  weatherData: WeatherData;
}

class MeteogramChart {
  chart: Highcharts.Chart;

  constructor(chart: Highcharts.Chart) {
    this.chart = chart;
  }

  Arrow(): void {
    const xAxis = this.chart.xAxis[0];
    const min = xAxis.min || 0;
    const max = xAxis.max || 0;

    for (let pos = min, i = 0; pos <= max + 36e5; pos += 36e5, i += 1) {
      const isLast = pos === max + 36e5;
      const x = Math.round(xAxis.toPixels(pos)) + (isLast ? 0.5 : -0.5);

      const resolution = (this.chart.options.chart as any).resolution;
      const isLong = resolution > 36e5 ? pos % resolution === 0 : i % 2 === 0;

      this.chart.renderer
        .path([
          'M',
          x,
          this.chart.plotTop + this.chart.plotHeight + (isLong ? 0 : 28),
          'L',
          x,
          this.chart.plotTop + this.chart.plotHeight + 32,
          'Z'
        ] as any)
        .attr({
          stroke: (this.chart.options.chart as any).plotBorderColor,
          'stroke-width': 1
        })
        .add();
    }

    const windbarbs = this.chart.get('windbarbs');
    if (windbarbs) {
      const offset = 4;
      (windbarbs as any).markerGroup.attr({
        translateX: (windbarbs as any).markerGroup.translateX + offset
      });
    }
  }
}

const MeteogramChartComponent: React.FC<MeteogramChartProps> = ({ weatherData }) => {
  const chartContainer = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (chartContainer.current && weatherData) {
      const hourlyData = weatherData.data.timelines.find(
        timeline => timeline.timestep === '1h'
      )?.intervals || [];

      if (hourlyData.length === 0) {
        console.error('Hourly weather data is unavailable.');
        return;
      }

      const temperatureSeries = hourlyData.map(interval => [
        new Date(interval.startTime).getTime(),
        interval.values.temperature
      ]);

      const humiditySeries = hourlyData.map(interval => [
        new Date(interval.startTime).getTime(),
        interval.values.humidity
      ]);

      const pressureSeries = hourlyData.map(interval => [
        new Date(interval.startTime).getTime(),
        interval.values.pressureSurfaceLevel
      ]);

      const windData = hourlyData
        .map((interval, idx) => 
          idx % 2 === 0 
            ? {
                x: new Date(interval.startTime).getTime(),
                value: interval.values.windSpeed,
                direction: interval.values.windDirection,
                pointInterval: 2 * 36e5
              }
            : null
        )
        .filter(Boolean);

      const formattedDateTime = hourlyData.map(interval => {
        const date = new Date(interval.startTime);
        return date.toLocaleString('en-GB', {
          weekday: 'long',
          day: '2-digit',
          month: 'short',
          hour: 'numeric',
          minute: '2-digit',
          hour12: false
        });
      });

      const chartOptions: Highcharts.Options = {
        chart: {
          marginTop: 50,
          marginBottom: 70,
          marginRight: 40,
          marginLeft: 50,
          plotBorderWidth: 1,
          alignTicks: false,
          zooming: {
            type: 'x'
          },
          height: 450,
          scrollablePlotArea: {
            minWidth: 620
          }
        },

        title: {
          text: 'Hourly Weather Forecast',
          align: 'center',
          style: {
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }
        },

        tooltip: {
          shared: true,
          useHTML: true,
          formatter: function(this: Highcharts.TooltipFormatterContextObject) {
            if (!this.points) return '';
            
            const idx = this.points[0].point.index;
            const formattedTime = formattedDateTime[idx];
            let tooltipHTML = `<small>${formattedTime}</small><br>`;

            this.points.forEach(point => {
              const series = point.series;
              const colorDot = `<span style="display:inline-block; width:6px; height:6px; border-radius:50%; background-color:${series.color}; margin-right:5px;"></span>`;
              const suffix = (series as any).tooltipOptions.valueSuffix || '';

              if (series.options.type === 'windbarb') {
                tooltipHTML += `${colorDot}${series.name}: <b>${(point.point as any).value}${suffix}</b><br>`;
              } else {
                tooltipHTML += `${colorDot}${series.name}: <b>${point.y}${suffix}</b><br>`;
              }
            });
            return tooltipHTML;
          }
        },

        xAxis: [{
          type: 'datetime',
          tickInterval: 2 * 36e5,
          minorTickInterval: 36e5,
          gridLineColor: 'rgba(128, 128, 128, 0.1)',
          gridLineWidth: 1,
          minPadding: 0,
          maxPadding: 0,
          offset: 30,
          crosshair: true,
          labels: { 
            format: '{value:%H}'
          }
        }, {
          linkedTo: 0,
          type: 'datetime',
          tickInterval: 24 * 3600 * 1000,
          labels: {
            format: '{value:<span style="font-size: 12px; font-weight: bold">%a</span> %b %e}',
            align: 'left',
            x: 3,
            y: 8
          },
          opposite: true
        }],

        yAxis: [{
          title: { text: '' },
          labels: {
            format: '{value}°',
            style: { fontSize: '10px' },
            x: -3
          },
          plotLines: [{ value: 0, color: '#BBBBBB', width: 1, zIndex: 2 }],
          maxPadding: 0.3,
          minRange: 15,
          min: 0,
          max: 135,
          tickInterval: 15,
          gridLineColor: 'rgba(128, 128, 128, 0.1)'
        }, {
          title: { text: '' },
          labels: { 
            enabled: false
          },
          opposite: true,
          min: 0,
          max: 140,
          tickInterval: 10,
          gridLineWidth: 0
        }, {
          title: {
            text: 'inHg',
            align: 'high',
            rotation: 0,
            x: -20,
            style: { 
              fontSize: '10px',
              color: '#FFA500'
            }
          },
          labels: {
            style: { 
              fontSize: '8px',
              color: '#FFA500'
            },
            y: 2,
            x: 3
          },
          opposite: true,
          gridLineWidth: 0,
          min: 0,
          max: 58,
          tickInterval: 29
        }],

        legend: { enabled: false },

        plotOptions: {
          series: {
            pointPlacement: 'between'
          }
        },

        series: [{
          name: 'Temperature',
          type: 'line',
          data: temperatureSeries,
          marker: { enabled: false },
          color: '#FF3333',
          negativeColor: '#48AFE8',
          tooltip: { valueSuffix: '°F' },
          yAxis: 0,
          zIndex: 3
        }, {
          name: 'Humidity',
          type: 'column',
          data: humiditySeries,
          color: '#61c8ff',
          tooltip: { valueSuffix: '%' },
          pointWidth: 7,
          yAxis: 1,
          zIndex: 1
        }, {
          name: 'Pressure',
          type: 'line',
          data: pressureSeries,
          dashStyle: 'ShortDash',
          color: '#FFA500',
          tooltip: { valueSuffix: ' inHg' },
          yAxis: 2,
          zIndex: 2
        }, {
          name: 'Wind',
          type: 'windbarb',
          id: 'windbarbs',
          data: windData,
          color: Highcharts.getOptions().colors?.[1] || '#000000',
          lineWidth: 1.5,
          vectorLength: 12,
          yOffset: -15,
          tooltip: { valueSuffix: ' m/s' }
        }] as any
      };

      const chart = Highcharts.chart(chartContainer.current, chartOptions);
      const meteogram = new MeteogramChart(chart);
      meteogram.Arrow();
    }
  }, [weatherData]);

  return <div ref={chartContainer} />;
};

export default MeteogramChartComponent;