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

export function EChartsDonut() {
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
        text: 'Events by Category (Donut)',
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
          radius: ['40%', '70%'], // Inner and outer radius for donut effect
          center: ['50%', '50%'],
          avoidLabelOverlap: false,
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
          },
          labelLine: {
            show: true
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
          This donut chart is similar to the pie chart but with a hollow center,
          providing a modern visualization of event distribution across categories.
        </p>
      </div>
    </div>
  );
}
