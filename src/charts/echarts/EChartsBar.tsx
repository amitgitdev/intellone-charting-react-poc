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

export function EChartsBar() {
  const option = useMemo(() => {
    const categories = data.map(item => item.eventRecordName);
    const values = data.map(item => item.eventCount);
    const colors = data.map(item => eventTypeColors[item.eventRecordName] || eventTypeColors.Other);

    const total = data.reduce((sum, item) => sum + item.eventCount, 0);

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
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        },
        formatter: (params: { name: string; value: number }[]) => {
          const value = params[0].value;
          const percentage = ((value / total) * 100).toFixed(1);
          return `${params[0].name}<br/><b>${value}</b> events (${percentage}%)`;
        }
      },
      toolbox: {
        feature: {
          saveAsImage: { 
            title: 'Save as Image',
            pixelRatio: 2
          },
          dataView: { 
            title: 'View Data',
            readOnly: true
          }
        },
        right: 20,
        top: 10
      },
      xAxis: {
        type: 'category',
        data: categories,
        name: 'Event Category',
        nameLocation: 'middle',
        nameGap: 50,
        axisLabel: {
          rotate: -45,
          fontSize: 12
        }
      },
      yAxis: {
        type: 'value',
        name: 'Event Count',
        minInterval: 1
      },
      series: [
        {
          name: 'Events',
          type: 'bar',
          data: values.map((value, index) => ({
            value,
            itemStyle: {
              color: colors[index]
            }
          })),
          label: {
            show: false
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
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
          This column chart displays event counts by category, making it easy to compare
          the relative frequency of different event types.
        </p>
      </div>
    </div>
  );
}
