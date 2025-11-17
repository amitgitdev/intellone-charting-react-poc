import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import 'highcharts/modules/drilldown';
import 'highcharts/modules/exporting';
import 'highcharts/modules/export-data';
import 'highcharts/modules/offline-exporting';
import { useMemo } from 'react';
import eventList from '../../data/eventlist.json';

interface EventItem {
  id: number;
  eventRecordName: string;
  statusName: string;
  title: string;
  eventDate: string;
  eventManagerFullName: string;
  isHighPotential: boolean;
  isNotifiable: boolean;
}

const data = eventList.data as EventItem[];

const severityColors = {
  'High Potential': '#e74c3c',
  'Regular': '#3498db'
};

const notifiableColors = {
  'Notifiable': '#f39c12',
  'Non-notifiable': '#95a5a6'
};

const statusColors = {
  'Created': '#111313ff',
  'Investigation Started': '#f39c12',
  'Entry Completed': '#2ecc71',
  'Closed': '#27ae60',
  'Other': '#bdc3c7'
};

export function HighchartsSeverityAnalysis() {
  const chartOptions = useMemo(() => {
    // Level 1: Severity (High Potential vs Regular)
    const severityCounts: Record<string, number> = {};
    const severityToNotifiable: Record<string, Record<string, number>> = {};
    const notifiableToStatus: Record<string, Record<string, number>> = {};

    data.forEach(item => {
      const severity = item.isHighPotential ? 'High Potential' : 'Regular';
      const notifiable = item.isNotifiable ? 'Notifiable' : 'Non-notifiable';
      const status = item.statusName || 'Other';

      // Severity level
      severityCounts[severity] = (severityCounts[severity] || 0) + 1;

      // Notifiable level
      if (!severityToNotifiable[severity]) severityToNotifiable[severity] = {};
      severityToNotifiable[severity][notifiable] = (severityToNotifiable[severity][notifiable] || 0) + 1;

      // Status level
      const notifiableKey = `${severity}|${notifiable}`;
      if (!notifiableToStatus[notifiableKey]) notifiableToStatus[notifiableKey] = {};
      notifiableToStatus[notifiableKey][status] = (notifiableToStatus[notifiableKey][status] || 0) + 1;
    });

    // Main series (Severity - Pie Chart)
    const mainSeriesData = Object.entries(severityCounts).map(([severity, count]) => ({
      name: severity,
      y: count,
      color: severityColors[severity as keyof typeof severityColors],
      drilldown: `severity-${severity}`
    }));

    // Drill-down level 1: Notifiable (Column Chart)
    const notifiableDrilldownSeries: Highcharts.SeriesDrilldownOptions[] = [];
    Object.entries(severityToNotifiable).forEach(([severity, notifiableCounts]) => {
      const notifiableData = Object.entries(notifiableCounts).map(([notifiable, count]) => ({
        name: notifiable,
        y: count,
        color: notifiableColors[notifiable as keyof typeof notifiableColors],
        drilldown: `notifiable-${severity}|${notifiable}`
      }));

      notifiableDrilldownSeries.push({
        type: 'column',
        name: `${severity} - Notifiable Status`,
        id: `severity-${severity}`,
        data: notifiableData
      });
    });

    // Drill-down level 2: Status (Column Chart)
    const statusDrilldownSeries: Highcharts.SeriesDrilldownOptions[] = [];
    Object.entries(notifiableToStatus).forEach(([notifiableKey, statusCounts]) => {
      const [severity, notifiable] = notifiableKey.split('|');
      const statusData = Object.entries(statusCounts).map(([status, count]) => ({
        name: status,
        y: count,
        color: statusColors[status as keyof typeof statusColors] || statusColors.Other
      }));

      statusDrilldownSeries.push({
        type: 'column',
        name: `${severity} - ${notifiable} - Status Distribution`,
        id: `notifiable-${notifiableKey}`,
        data: statusData
      });
    });

    const allDrilldownSeries = [...notifiableDrilldownSeries, ...statusDrilldownSeries];

    return {
      chart: {
        type: 'pie',
        height: 500,
        backgroundColor: 'white',
        events: {
          drilldown: function() {
            // Switch to column chart when drilling down
            this.update({
              chart: {
                type: 'pie'
              }
            }, false);
          },
          drillup: function(e: { seriesOptions?: { _levelNumber?: number } }) {
            // Switch back to pie chart at top level
            if (!e.seriesOptions || e.seriesOptions._levelNumber === 0) {
              this.update({
                chart: {
                  type: 'pie'
                }
              }, false);
            }
          }
        }
      },
      title: {
        text: 'Event Severity Analysis',
        style: {
          fontSize: '18px',
          fontWeight: '600'
        }
      },
      subtitle: {
        text: 'Click to drill down: Severity → Notifiable Status → Event Status'
      },
      xAxis: {
        type: 'category',
        title: {
          text: 'Category'
        }
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Event Count'
        },
        allowDecimals: false
      },
      legend: {
        enabled: true,
        align: 'center',
        verticalAlign: 'bottom'
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
        },
        column: {
          cursor: 'pointer',
          dataLabels: {
            enabled: false
          }
        }
      },
      tooltip: {
        headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
        pointFormat: '<b>{point.name}</b>: {point.y} events<br/>({point.percentage:.1f}%)'
      },
      series: [{
        name: 'Severity Levels',
        colorByPoint: true,
        data: mainSeriesData
      }],
      drilldown: {
        breadcrumbs: {
          position: {
            align: 'right'
          },
          showFullPath: true
        },
        series: allDrilldownSeries
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
          This 3-level drill-down chart analyzes event severity. Start with a pie chart showing 
          High Potential vs Regular events, then drill down to see notifiable status, and finally 
          view the complete status breakdown. The chart type automatically switches from pie to 
          column as you drill down.
        </p>
      </div>
    </div>
  );
}
