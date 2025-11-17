import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import 'highcharts/modules/drilldown';
import 'highcharts/modules/exporting';
import 'highcharts/modules/export-data';
import 'highcharts/modules/offline-exporting';
import { useMemo } from 'react';
import eventList from '../../data/eventlist.json';
import { eventTypeColors, statusColors } from '../../utils/chartConstants';

interface EventItem {
  id: number;
  eventRecordName: string;
  statusName: string;
  title: string;
  eventDate: string;
  eventManagerFullName: string;
}

const data = eventList.data as EventItem[];

export function HighchartsStatusDrillDown() {
  const chartOptions = useMemo(() => {
    // Calculate event type counts
    const eventTypeCounts: Record<string, number> = {};
    const eventTypeToStatus: Record<string, Record<string, number>> = {};

    data.forEach(item => {
      const eventType = item.eventRecordName || 'Other';
      const status = item.statusName || 'Other';

      eventTypeCounts[eventType] = (eventTypeCounts[eventType] || 0) + 1;

      if (!eventTypeToStatus[eventType]) {
        eventTypeToStatus[eventType] = {};
      }
      eventTypeToStatus[eventType][status] = (eventTypeToStatus[eventType][status] || 0) + 1;
    });

    // Prepare main series data
    const mainSeriesData = Object.entries(eventTypeCounts).map(([eventType, count]) => ({
      name: eventType,
      y: count,
      color: eventTypeColors[eventType] || eventTypeColors.Other,
      drilldown: eventType
    }));

    // Prepare drill-down series
    const drilldownSeries = Object.entries(eventTypeToStatus).map(([eventType, statusCounts]) => ({
      name: `${eventType} - Status Breakdown`,
      id: eventType,
      data: Object.entries(statusCounts).map(([status, count]) => ({
        name: status,
        y: count,
        color: statusColors[status] || statusColors.Other
      }))
    }));

    return {
      chart: {
        type: 'pie',
        height: 500,
        backgroundColor: 'white'
      },
      title: {
        text: 'Events by Record Type (Click to drill down)',
        style: {
          fontSize: '18px',
          fontWeight: '600'
        }
      },
      subtitle: {
        text: 'Click on slices to see status breakdown'
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
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
      tooltip: {
        headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
        pointFormat: '<b>{point.name}</b>: {point.y} events<br/>({point.percentage:.1f}%)'
      },
      series: [{
        name: 'Event Types',
        colorByPoint: true,
        data: mainSeriesData
      }],
      drilldown: {
        breadcrumbs: {
          position: {
            align: 'right'
          },
          showFullPath: false
        },
        series: drilldownSeries
      },
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
          This drill-down chart shows event distribution by type. Click on any slice to 
          see the status breakdown for that event type. Use the breadcrumb navigation 
          to return to the main view.
        </p>
      </div>
    </div>
  );
}
