import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import 'highcharts/modules/treemap';
import 'highcharts/modules/exporting';
import 'highcharts/modules/export-data';
import 'highcharts/modules/offline-exporting';
import { useMemo } from 'react';
import eventList from '../../data/eventlist.json';
import { eventTypeColors } from '../../utils/chartConstants';

interface EventItem {
  id: number;
  eventRecordName: string;
  orgStructurePath: string;
}

const data = eventList.data as EventItem[];

export function HighchartsTreemap() {
  const chartOptions = useMemo(() => {
    // Build hierarchical structure: Organization → Event Type
    const orgEventCounts: Record<string, Record<string, number>> = {};

    data.forEach(item => {
      const org = item.orgStructurePath || 'Unknown';
      const eventType = item.eventRecordName || 'Other';

      if (!orgEventCounts[org]) orgEventCounts[org] = {};
      orgEventCounts[org][eventType] = (orgEventCounts[org][eventType] || 0) + 1;
    });

    // Convert to Highcharts treemap format
    const treemapData: { 
      id?: string; 
      name: string; 
      value?: number; 
      parent?: string; 
      color?: string;
    }[] = [];

    // Add organizations as parent nodes
    Object.keys(orgEventCounts).forEach(org => {
      treemapData.push({
        id: org,
        name: org
      });
    });

    // Add event types as child nodes
    Object.entries(orgEventCounts).forEach(([org, eventTypes]) => {
      Object.entries(eventTypes).forEach(([eventType, count]) => {
        treemapData.push({
          id: `${org}-${eventType}`,
          name: `${eventType} (${count})`,
          value: count,
          parent: org,
          color: eventTypeColors[eventType] || eventTypeColors.Other
        });
      });
    });

    return {
      chart: {
        height: 600,
        backgroundColor: 'white'
      },
      title: {
        text: 'Event Distribution: Organization & Type Hierarchy',
        style: {
          fontSize: '18px',
          fontWeight: '600'
        }
      },
      subtitle: {
        text: 'Rectangle size represents event count'
      },
      colorAxis: {
        minColor: '#e3f2fd',
        maxColor: '#1976d2'
      },
      tooltip: {
        useHTML: true,
        pointFormatter: function() {
          const point = this as { name: string; value?: number; parent?: string };
          if (point.value) {
            return `<b>${point.name}</b><br/>Events: <b>${point.value}</b>`;
          }
          return `<b>${point.name}</b><br/>Organization`;
        }
      },
      plotOptions: {
        treemap: {
          layoutAlgorithm: 'squarified',
          dataLabels: {
            enabled: true,
            style: {
              fontSize: '11px',
              fontWeight: 'normal',
              textOutline: '1px contrast'
            },
            formatter: function() {
              const point = this.point as { name: string; value?: number };
              // Only show label if there's enough space (value > threshold)
              if (point.value && point.value > 3) {
                return point.name;
              }
              return point.value ? point.name : `<b>${point.name}</b>`;
            }
          },
          levels: [{
            level: 1,
            dataLabels: {
              enabled: true,
              style: {
                fontSize: '14px',
                fontWeight: 'bold'
              }
            },
            borderWidth: 3,
            borderColor: '#ffffff'
          }]
        }
      },
      series: [{
        type: 'treemap',
        layoutAlgorithm: 'squarified',
        alternateStartingDirection: true,
        data: treemapData,
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
          This treemap visualizes the hierarchical relationship between organizations and 
          event types. Rectangle size represents the event count, with larger areas indicating 
          higher event volumes. The color coding helps distinguish different event types.
        </p>
      </div>
    </div>
  );
}
