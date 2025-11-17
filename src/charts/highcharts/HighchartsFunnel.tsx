import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import 'highcharts/modules/funnel';
import 'highcharts/modules/exporting';
import 'highcharts/modules/export-data';
import 'highcharts/modules/offline-exporting';
import { useMemo } from 'react';
import eventList from '../../data/eventlist.json';
import { statusColors } from '../../utils/chartConstants';

interface EventItem {
  id: number;
  statusName: string;
}

const data = eventList.data as EventItem[];

export function HighchartsFunnel() {
  const chartOptions = useMemo(() => {
    // Status progression order for funnel
    const statusOrder = [
      'Created',
      'Entry Completed',
      'Investigation Started',
      'Closed'
    ];

    const statusCounts: Record<string, number> = {};

    data.forEach(item => {
      const status = item.statusName || 'Unknown';
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    });

    // Build funnel data
    const funnelData = statusOrder
      .filter(status => statusCounts[status] > 0)
      .map(status => ({
        name: status,
        y: statusCounts[status],
        color: statusColors[status] || '#95a5a6'
      }));

    return {
      chart: {
        type: 'funnel',
        height: 500,
        backgroundColor: 'white'
      },
      title: {
        text: 'Event Status Progression',
        style: {
          fontSize: '18px',
          fontWeight: '600'
        }
      },
      subtitle: {
        text: 'Status flow and conversion rates'
      },
      plotOptions: {
        funnel: {
          dataLabels: {
            enabled: true,
            format: '<b>{point.name}</b>: {point.y}',
            softConnector: true,
            style: {
              fontSize: '12px',
              fontWeight: 'normal'
            }
          },
          center: ['50%', '50%'],
          neckWidth: '30%',
          neckHeight: '25%',
          width: '80%'
        }
      },
      legend: {
        enabled: true,
        align: 'center',
        verticalAlign: 'bottom'
      },
      tooltip: {
        pointFormatter: function() {
          const point = this as { y: number; name: string };
          const total = funnelData[0]?.y || 1;
          const percentage = ((point.y / total) * 100).toFixed(1);
          
          // Find index for conversion rate
          const index = funnelData.findIndex(d => d.name === point.name);
          let conversionText = '';
          if (index > 0) {
            const previousValue = funnelData[index - 1].y;
            const conversion = ((point.y / previousValue) * 100).toFixed(1);
            conversionText = `<br/>Conversion from previous: ${conversion}%`;
          }
          
          return `<b>${point.y}</b> events<br/>` +
                 `${percentage}% of total${conversionText}`;
        }
      },
      series: [{
        name: 'Status Progression',
        data: funnelData
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
          This funnel chart shows the event status progression from creation to closure. 
          The width of each stage represents the number of events, making it easy to identify 
          drop-off points and conversion rates between stages.
        </p>
      </div>
    </div>
  );
}
