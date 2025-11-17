import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import 'highcharts/highcharts-more';
import 'highcharts/modules/exporting';
import 'highcharts/modules/export-data';
import 'highcharts/modules/offline-exporting';
import { useMemo } from 'react';
import eventList from '../../data/eventlist.json';
import { eventTypeColors } from '../../utils/chartConstants';

interface EventItem {
  id: number;
  eventRecordName: string;
  eventDate: string;
  isHighPotential: boolean;
}

const data = eventList.data as EventItem[];

export function HighchartsBubble() {
  const chartOptions = useMemo(() => {
    // Group events by date and type
    const dateEventMap: Record<string, Record<string, { count: number; highPotential: number }>> = {};

    data.forEach(item => {
      if (!item.eventDate) return;
      
      const date = new Date(item.eventDate).toISOString().split('T')[0];
      const eventType = item.eventRecordName || 'Other';

      if (!dateEventMap[date]) dateEventMap[date] = {};
      if (!dateEventMap[date][eventType]) {
        dateEventMap[date][eventType] = { count: 0, highPotential: 0 };
      }

      dateEventMap[date][eventType].count += 1;
      if (item.isHighPotential) {
        dateEventMap[date][eventType].highPotential += 1;
      }
    });

    // Get unique event types
    const eventTypes = Array.from(new Set(data.map(d => d.eventRecordName || 'Other'))).sort();
    const eventTypeIndexMap: Record<string, number> = {};
    eventTypes.forEach((type, index) => {
      eventTypeIndexMap[type] = index;
    });

    // Build series data grouped by event type
    const seriesMap: Record<string, { x: number; y: number; z: number; highPotential: boolean }[]> = {};

    Object.entries(dateEventMap).forEach(([date, eventTypeData]) => {
      Object.entries(eventTypeData).forEach(([eventType, counts]) => {
        if (!seriesMap[eventType]) seriesMap[eventType] = [];
        
        seriesMap[eventType].push({
          x: new Date(date).getTime(),
          y: eventTypeIndexMap[eventType],
          z: counts.count,
          highPotential: counts.highPotential > 0
        });
      });
    });

    // Convert to Highcharts series format
    const series = Object.entries(seriesMap).map(([eventType, bubbles]) => ({
      name: eventType,
      data: bubbles,
      color: eventTypeColors[eventType] || eventTypeColors.Other,
      marker: {
        fillOpacity: 0.7
      }
    }));

    return {
      chart: {
        type: 'bubble',
        height: 500,
        backgroundColor: 'white',
        zoomType: 'xy'
      },
      title: {
        text: 'Event Distribution: Date × Type × Count',
        style: {
          fontSize: '18px',
          fontWeight: '600'
        }
      },
      subtitle: {
        text: 'Bubble size represents event count. Zoom to explore specific time periods.'
      },
      xAxis: {
        type: 'datetime',
        title: {
          text: 'Date'
        },
        gridLineWidth: 1
      },
      yAxis: {
        categories: eventTypes,
        title: {
          text: 'Event Type'
        },
        gridLineWidth: 1
      },
      legend: {
        enabled: true,
        align: 'right',
        verticalAlign: 'middle',
        layout: 'vertical'
      },
      tooltip: {
        useHTML: true,
        headerFormat: '<table>',
        pointFormat: '<tr><th colspan="2"><b>{series.name}</b></th></tr>' +
                     '<tr><th>Date:</th><td>{point.x:%Y-%m-%d}</td></tr>' +
                     '<tr><th>Events:</th><td><b>{point.z}</b></td></tr>',
        footerFormat: '</table>',
        followPointer: true
      },
      plotOptions: {
        bubble: {
          minSize: 8,
          maxSize: 50,
          dataLabels: {
            enabled: false
          }
        }
      },
      series: series,
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
          This bubble chart visualizes three dimensions: time (X-axis), event type (Y-axis), 
          and event count (bubble size). Each bubble is colored by event type. Use zoom 
          functionality to explore specific time periods in detail.
        </p>
      </div>
    </div>
  );
}
