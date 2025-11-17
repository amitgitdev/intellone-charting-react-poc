import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import 'highcharts/modules/heatmap';
import 'highcharts/modules/exporting';
import 'highcharts/modules/export-data';
import 'highcharts/modules/offline-exporting';
import { useMemo } from 'react';
import eventList from '../../data/eventlist.json';

interface EventItem {
  id: number;
  eventRecordName: string;
  eventDate: string;
}

const data = eventList.data as EventItem[];

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function HighchartsHeatmap() {
  const chartOptions = useMemo(() => {
    // Build month × event type matrix
    const matrix: Record<string, Record<string, number>> = {};
    const eventTypes = new Set<string>();
    const months = new Set<string>();

    data.forEach(item => {
      if (!item.eventDate) return;

      const date = new Date(item.eventDate);
      const year = date.getFullYear();
      const month = date.getMonth();
      const monthKey = `${monthNames[month]} ${year}`;
      const eventType = item.eventRecordName || 'Other';

      eventTypes.add(eventType);
      months.add(monthKey);

      if (!matrix[monthKey]) matrix[monthKey] = {};
      matrix[monthKey][eventType] = (matrix[monthKey][eventType] || 0) + 1;
    });

    // Sort months chronologically
    const sortedMonths = Array.from(months).sort((a, b) => {
      const [monthA, yearA] = a.split(' ');
      const [monthB, yearB] = b.split(' ');
      const yearDiff = Number(yearA) - Number(yearB);
      if (yearDiff !== 0) return yearDiff;
      return monthNames.indexOf(monthA) - monthNames.indexOf(monthB);
    });

    const sortedEventTypes = Array.from(eventTypes).sort();

    // Build heatmap data in [x, y, value] format
    const heatmapData: [number, number, number][] = [];
    let maxValue = 0;

    sortedMonths.forEach((month, xIndex) => {
      sortedEventTypes.forEach((eventType, yIndex) => {
        const value = matrix[month]?.[eventType] || 0;
        if (value > maxValue) maxValue = value;
        heatmapData.push([xIndex, yIndex, value]);
      });
    });

    return {
      chart: {
        type: 'heatmap',
        height: 500,
        backgroundColor: 'white',
        marginTop: 60,
        marginBottom: 100
      },
      title: {
        text: 'Event Heatmap: Monthly Activity by Type',
        style: {
          fontSize: '18px',
          fontWeight: '600'
        }
      },
      subtitle: {
        text: 'Darker colors indicate higher event counts'
      },
      xAxis: {
        categories: sortedMonths,
        title: {
          text: 'Month'
        },
        labels: {
          rotation: -45,
          style: {
            fontSize: '11px'
          }
        }
      },
      yAxis: {
        categories: sortedEventTypes,
        title: {
          text: 'Event Type'
        },
        reversed: false
      },
      colorAxis: {
        min: 0,
        max: maxValue,
        stops: [
          [0, '#f0f0f0'],
          [0.25, '#c6e48b'],
          [0.5, '#7bc96f'],
          [0.75, '#239a3b'],
          [1, '#196127']
        ]
      },
      legend: {
        align: 'right',
        layout: 'vertical',
        margin: 0,
        verticalAlign: 'top',
        y: 25,
        symbolHeight: 280
      },
      tooltip: {
        formatter: function() {
          const point = this.point as { x: number; y: number; value: number };
          const month = sortedMonths[point.x];
          const eventType = sortedEventTypes[point.y];
          return `<b>${month}</b><br/>${eventType}: <b>${point.value}</b> events`;
        }
      },
      plotOptions: {
        heatmap: {
          dataLabels: {
            enabled: true,
            color: '#000000',
            style: {
              fontSize: '10px',
              fontWeight: 'normal',
              textOutline: 'none'
            },
            formatter: function() {
              const value = this.point.value;
              return value && value > 0 ? String(value) : '';
            }
          }
        }
      },
      series: [{
        type: 'heatmap',
        name: 'Event Count',
        borderWidth: 1,
        borderColor: '#ffffff',
        data: heatmapData,
        dataLabels: {
          enabled: true
        }
      }],
      credits: {
        enabled: false
      },
      exporting: {
        enabled: true,
        buttons: {
          contextButton: {
            menuItems: ['downloadPNG', 'downloadJPEG', 'downloadPDF', 'downloadSVG', 'separator', 'downloadCSV', 'downloadXLS']
          }
        }
      }
    } as Highcharts.Options;
  }, []);

  return (
    <div>
      <HighchartsReact
        highcharts={Highcharts}
        options={chartOptions}
      />
      <div
        style={{
          marginTop: 24,
          padding: 15,
          background: '#f5f5f5',
          borderRadius: 4
        }}
      >
        <h4 style={{ margin: '0 0 10px 0', color: '#666' }}>About This Chart</h4>
        <p style={{ margin: 0, fontSize: 14, color: '#666' }}>
          This heatmap visualizes event distribution across time (months) and event types. 
          Darker green colors indicate higher event counts. The GitHub-style color scheme 
          provides an intuitive view of activity patterns.
        </p>
      </div>
    </div>
  );
}
