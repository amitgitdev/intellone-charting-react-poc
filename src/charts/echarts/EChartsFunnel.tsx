import ReactECharts from 'echarts-for-react';
import { useMemo } from 'react';
import eventList from '../../data/eventlist.json';
import { statusColors } from '../../utils/chartConstants';

interface EventItem {
  id: number;
  statusName: string;
}

const data = eventList.data as EventItem[];

export function EChartsFunnel() {
  const option = useMemo(() => {
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
        value: statusCounts[status],
        itemStyle: {
          color: statusColors[status] || '#95a5a6'
        }
      }));

    const total = funnelData[0]?.value || 1;

    return {
      title: {
        text: 'Event Status Progression',
        subtext: 'Status flow and conversion rates',
        left: 'center',
        textStyle: {
          fontSize: 18,
          fontWeight: 600
        }
      },
      tooltip: {
        trigger: 'item',
        formatter: (params: { name: string; value: number; dataIndex: number }) => {
          const percentage = ((params.value / total) * 100).toFixed(1);
          
          let conversionText = '';
          if (params.dataIndex > 0) {
            const previousValue = funnelData[params.dataIndex - 1].value;
            const conversion = ((params.value / previousValue) * 100).toFixed(1);
            conversionText = `<br/>Conversion from previous: ${conversion}%`;
          }
          
          return `<b>${params.name}</b><br/>` +
                 `Events: ${params.value}<br/>` +
                 `${percentage}% of total${conversionText}`;
        }
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
          },
          dataView: {
            title: 'Data View',
            readOnly: true
          }
        },
        right: 20,
        top: 10
      },
      series: [
        {
          name: 'Status Progression',
          type: 'funnel',
          left: '10%',
          top: '15%',
          bottom: '15%',
          width: '80%',
          min: 0,
          max: total,
          minSize: '0%',
          maxSize: '100%',
          sort: 'descending',
          gap: 2,
          label: {
            show: true,
            position: 'inside',
            formatter: '{b}: {c}',
            fontSize: 12
          },
          labelLine: {
            length: 10,
            lineStyle: {
              width: 1,
              type: 'solid'
            }
          },
          itemStyle: {
            borderColor: '#fff',
            borderWidth: 1
          },
          emphasis: {
            label: {
              fontSize: 14,
              fontWeight: 'bold'
            }
          },
          data: funnelData
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
        <h4 style={{ margin: '0 0 10px 0', color: '#666' }}>Summary</h4>
        <p style={{ margin: 0, fontSize: 14, color: '#666' }}>
          Total events: {data.length} | 
          Funnel width represents the number of events at each stage | 
          Shows progression from creation to closure
        </p>
      </div>
    </div>
  );
}
