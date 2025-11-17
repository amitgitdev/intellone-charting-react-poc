import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import 'highcharts/modules/exporting';
import 'highcharts/modules/export-data';
import 'highcharts/modules/offline-exporting';
import { useMemo } from 'react';
import eventRecord from '../../data/eventrecord.json';
import { eventTypeColors } from '../../utils/chartConstants';

interface EventRecordItem {
  eventRecordName: string;
  eventCount: number;
  totalNumberOfEvents: number;
}

const data = eventRecord as EventRecordItem[];

export function HighchartsBar() {
  const chartOptions = useMemo(() => {
    const categories = data.map(item => item.eventRecordName);
    const chartData = data.map(item => ({
      y: item.eventCount,
      color: eventTypeColors[item.eventRecordName] || eventTypeColors.Other
    }));

    const total = data.reduce((sum, item) => sum + item.eventCount, 0);

    return {
      chart: {
        type: 'column',
        height: 420,
        backgroundColor: 'white'
      },
      title: {
        text: 'Events by Category',
        style: {
          fontSize: '18px',
          fontWeight: '600'
        }
      },
      xAxis: {
        categories: categories,
        title: {
          text: 'Event Category'
        },
        labels: {
          rotation: -45,
          style: {
            fontSize: '12px'
          }
        }
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Event Count'
        },
        allowDecimals: false
      },
      tooltip: {
        pointFormatter: function() {
          const percentage = ((this.y || 0) / total * 100).toFixed(1);
          return `<b>${this.y}</b> events (${percentage}%)`;
        }
      },
      plotOptions: {
        column: {
          colorByPoint: true,
          dataLabels: {
            enabled: false
          }
        }
      },
      legend: {
        enabled: false
      },
      series: [{
        name: 'Events',
        data: chartData
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
          This column chart displays event counts by category, making it easy to compare
          the relative frequency of different event types.
        </p>
      </div>
    </div>
  );
}
