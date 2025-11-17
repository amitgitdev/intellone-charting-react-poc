import ReactECharts from 'echarts-for-react';
import { useMemo } from 'react';
import eventList from '../../data/eventlist.json';

interface EventItem {
  id: number;
  eventRecordName: string;
  eventDate: string;
}

const data = eventList.data as EventItem[];

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function EChartsHeatmap() {
  const option = useMemo(() => {
    // Build month × event type matrix
    const matrix: Record<string, Record<string, number>> = {};
    const eventTypes = new Set<string>();
    const months = new Set<string>();

    data.forEach(item => {
      if (!item.eventDate) return;

      const date = new Date(item.eventDate);
      const year = date.getFullYear();
      const month = date.getMonth();
      const monthKey = `${monthNames[month]} ${year}`;
      const eventType = item.eventRecordName || 'Other';

      eventTypes.add(eventType);
      months.add(monthKey);

      if (!matrix[monthKey]) matrix[monthKey] = {};
      matrix[monthKey][eventType] = (matrix[monthKey][eventType] || 0) + 1;
    });

    // Sort months chronologically
    const sortedMonths = Array.from(months).sort((a, b) => {
      const [monthA, yearA] = a.split(' ');
      const [monthB, yearB] = b.split(' ');
      const yearDiff = Number(yearA) - Number(yearB);
      if (yearDiff !== 0) return yearDiff;
      return monthNames.indexOf(monthA) - monthNames.indexOf(monthB);
    });

    const sortedEventTypes = Array.from(eventTypes).sort();

    // Build heatmap data in [x, y, value] format
    const heatmapData: [number, number, number][] = [];
    let maxValue = 0;

    sortedMonths.forEach((month, xIndex) => {
      sortedEventTypes.forEach((eventType, yIndex) => {
        const value = matrix[month]?.[eventType] || 0;
        if (value > maxValue) maxValue = value;
        heatmapData.push([xIndex, yIndex, value]);
      });
    });

    return {
      title: {
        text: 'Event Heatmap: Monthly Activity by Type',
        left: 'center',
        textStyle: {
          fontSize: 18,
          fontWeight: 600
        }
      },
      tooltip: {
        position: 'top',
        formatter: (params: { data: [number, number, number] }) => {
          const [xIndex, yIndex, value] = params.data;
          return `<b>${sortedMonths[xIndex]}</b><br/>${sortedEventTypes[yIndex]}<br/>Count: <b>${value}</b>`;
        }
      },
      grid: {
        height: '65%',
        top: '15%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: sortedMonths,
        name: 'Month',
        nameLocation: 'middle',
        nameGap: 50,
        axisLabel: {
          rotate: -45,
          interval: 0,
          fontSize: 11
        },
        splitArea: {
          show: true
        }
      },
      yAxis: {
        type: 'category',
        data: sortedEventTypes,
        name: 'Event Type',
        nameLocation: 'middle',
        nameGap: 120,
        axisLabel: {
          fontSize: 11
        },
        splitArea: {
          show: true
        }
      },
      visualMap: {
        min: 0,
        max: maxValue,
        calculable: true,
        orient: 'horizontal',
        left: 'center',
        bottom: '5%',
        inRange: {
          color: ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39']
        },
        text: ['High', 'Low']
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
          name: 'Event Count',
          type: 'heatmap',
          data: heatmapData,
          label: {
            show: true,
            fontSize: 10,
            formatter: (params: { data: [number, number, number] }) => {
              const value = params.data[2];
              return value > 0 ? value.toString() : '';
            }
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
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
        <h4 style={{ margin: '0 0 10px 0', color: '#666' }}>Summary</h4>
        <p style={{ margin: 0, fontSize: 14, color: '#666' }}>
          Total events: {data.length} | 
          GitHub-style color scheme shows intensity of event activity | 
          Darker green indicates higher event counts for that month and type
        </p>
      </div>
    </div>
  );
}
