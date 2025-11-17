import ReactECharts from 'echarts-for-react';
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

export function EChartsBubble() {
  const option = useMemo(() => {
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
    const seriesMap: Record<string, [string, number, number][]> = {};

    Object.entries(dateEventMap).forEach(([date, eventTypeData]) => {
      Object.entries(eventTypeData).forEach(([eventType, counts]) => {
        if (!seriesMap[eventType]) seriesMap[eventType] = [];
        
        seriesMap[eventType].push([
          date,
          eventTypeIndexMap[eventType],
          counts.count
        ]);
      });
    });

    // Convert to ECharts series format
    const series = Object.entries(seriesMap).map(([eventType, bubbles]) => ({
      name: eventType,
      type: 'scatter',
      data: bubbles,
      symbolSize: (val: [string, number, number]) => {
        // Scale bubble size based on count
        return Math.sqrt(val[2]) * 8;
      },
      itemStyle: {
        color: eventTypeColors[eventType] || eventTypeColors.Other,
        opacity: 0.7
      },
      emphasis: {
        focus: 'series',
        itemStyle: {
          opacity: 1,
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }));

    return {
      title: {
        text: 'Event Distribution: Date × Type × Count',
        subtext: 'Bubble size represents event count. Zoom to explore specific time periods.',
        left: 'center',
        textStyle: {
          fontSize: 18,
          fontWeight: 600
        }
      },
      legend: {
        orient: 'vertical',
        right: 10,
        top: 'middle',
        type: 'scroll',
        pageIconSize: 12,
        pageTextStyle: {
          fontSize: 10
        }
      },
      grid: {
        left: '10%',
        right: '20%',
        bottom: '15%',
        containLabel: true
      },
      tooltip: {
        formatter: (params: { seriesName: string; value: [string, number, number] }) => {
          const [date, , count] = params.value;
          return `<b>${params.seriesName}</b><br/>Date: ${date}<br/>Events: <b>${count}</b>`;
        }
      },
      xAxis: {
        type: 'time',
        name: 'Date',
        nameLocation: 'middle',
        nameGap: 30,
        axisLabel: {
          formatter: '{yyyy}-{MM}-{dd}',
          rotate: -45
        },
        splitLine: {
          show: true,
          lineStyle: {
            type: 'dashed'
          }
        }
      },
      yAxis: {
        type: 'category',
        data: eventTypes,
        name: 'Event Type',
        nameLocation: 'middle',
        nameGap: 80,
        axisLabel: {
          fontSize: 11
        },
        splitLine: {
          show: true,
          lineStyle: {
            type: 'dashed'
          }
        }
      },
      toolbox: {
        feature: {
          dataZoom: {
            title: {
              zoom: 'Zoom',
              back: 'Reset'
            }
          },
          saveAsImage: { 
            title: 'Save as Image',
            pixelRatio: 2
          },
          restore: {
            title: 'Restore'
          }
        },
        right: 20,
        top: 10
      },
      dataZoom: [
        {
          type: 'slider',
          xAxisIndex: 0,
          filterMode: 'none',
          height: 20,
          bottom: 30
        },
        {
          type: 'inside',
          xAxisIndex: 0,
          filterMode: 'none'
        }
      ],
      series
    };
  }, []);

  return (
    <div>
      <ReactECharts 
        option={option} 
        style={{ height: 500, width: '100%' }}
        opts={{ renderer: 'canvas' }}
      />
      
      <div
        style={{
          marginTop: 24,
          padding: 15,
          background: '#f5f5f5',
          borderRadius: 4
        }}
      >
        <h4 style={{ margin: '0 0 10px 0', color: '#666' }}>Summary</h4>
        <p style={{ margin: 0, fontSize: 14, color: '#666' }}>
          Total events: {data.length} | 
          Bubble size indicates event count on each date | 
          Use zoom controls to explore specific time periods
        </p>
      </div>
    </div>
  );
}
