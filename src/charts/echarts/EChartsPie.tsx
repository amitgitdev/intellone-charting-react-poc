import ReactECharts from 'echarts-for-react';
import { useMemo } from 'react';
import eventRecord from '../../data/eventrecord.json';
import { eventTypeColors } from '../../utils/chartConstants';

interface EventRecordItem {
  eventRecordName: string;
  eventCount: number;
  totalNumberOfEvents: number;
}

const data = eventRecord as EventRecordItem[];

export function EChartsPie() {
  const option = useMemo(() => {
    const chartData = data.map(item => ({
      name: item.eventRecordName,
      value: item.eventCount,
      itemStyle: {
        color: eventTypeColors[item.eventRecordName] || eventTypeColors.Other
      }
    }));

    return {
      title: {
        text: 'Events by Category',
        left: 'center',
        textStyle: {
          fontSize: 18,
          fontWeight: 600
        }
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b}: <b>{c}</b> events<br/>({d}%)'
      },
      legend: {
        orient: 'horizontal',
        bottom: 0,
        left: 'center'
      },
      toolbox: {
        feature: {
          saveAsImage: { 
            title: 'Save as Image',
            pixelRatio: 2
          }
        },
        right: 20,
        top: 10
      },
      series: [
        {
          name: 'Events',
          type: 'pie',
          radius: '60%',
          center: ['50%', '50%'],
          data: chartData,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          },
          label: {
            show: true,
            formatter: '{b}: {c}'
          }
        }
      ]
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
        <h4 style={{ margin: '0 0 10px 0', color: '#666' }}>About This Chart</h4>
        <p style={{ margin: 0, fontSize: 14, color: '#666' }}>
          This pie chart visualizes the distribution of events across different categories.
          Each slice represents the count and percentage of a specific event type.
        </p>
      </div>
    </div>
  );
}
