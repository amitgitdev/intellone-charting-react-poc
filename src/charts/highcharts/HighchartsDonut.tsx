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

export function HighchartsDonut() {
  const chartOptions = useMemo(() => {
    const chartData = data.map(item => ({
      name: item.eventRecordName,
      y: item.eventCount,
      color: eventTypeColors[item.eventRecordName] || eventTypeColors.Other
    }));

    return {
      chart: {
        type: 'pie',
        height: 420,
        backgroundColor: 'white'
      },
      title: {
        text: 'Events by Category (Donut)',
        style: {
          fontSize: '18px',
          fontWeight: '600'
        }
      },
      tooltip: {
        pointFormat: '<b>{point.y}</b> events<br/>({point.percentage:.1f}%)'
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          innerSize: '60%',  // This creates the donut effect
          dataLabels: {
            enabled: true,
            format: '<b>{point.name}</b>: {point.y}',
            style: {
              fontSize: '12px'
            }
          },
          showInLegend: true
        }
      },
      legend: {
        align: 'center',
        verticalAlign: 'bottom',
        layout: 'horizontal'
      },
      series: [{
        name: 'Events',
        colorByPoint: true,
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
          This donut chart is similar to the pie chart but with a hollow center,
          providing a modern visualization of event distribution across categories.
        </p>
      </div>
    </div>
  );
}
