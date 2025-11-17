import ReactECharts from 'echarts-for-react';
import { useState, useMemo } from 'react';
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

export function EChartsStatusDrillDown() {
  const [selectedEventType, setSelectedEventType] = useState<string | null>(null);

  // Calculate main chart data (Event Types)
  const mainChartData = useMemo(() => {
    const eventTypeCounts: Record<string, number> = {};

    data.forEach(item => {
      const eventType = item.eventRecordName || 'Other';
      eventTypeCounts[eventType] = (eventTypeCounts[eventType] || 0) + 1;
    });

    return Object.entries(eventTypeCounts).map(([eventType, count]) => ({
      name: eventType,
      value: count,
      itemStyle: {
        color: eventTypeColors[eventType] || eventTypeColors.Other
      }
    }));
  }, []);

  // Calculate drill-down data (Status for selected event type)
  const drillDownData = useMemo(() => {
    if (!selectedEventType) return null;

    const filteredEvents = data.filter(item => item.eventRecordName === selectedEventType);
    const statusCounts: Record<string, number> = {};

    filteredEvents.forEach(item => {
      const status = item.statusName || 'Other';
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    });

    return Object.entries(statusCounts).map(([status, count]) => ({
      name: status,
      value: count,
      itemStyle: {
        color: statusColors[status] || statusColors.Other
      }
    }));
  }, [selectedEventType]);

  // Chart options
  const option = useMemo(() => {
    const chartData = selectedEventType ? (drillDownData || []) : mainChartData;
    const title = selectedEventType 
      ? `${selectedEventType}: Status Breakdown` 
      : 'Events by Record Type (Click to drill down)';

    return {
      title: {
        text: title,
        left: 'center',
        textStyle: {
          fontSize: 18,
          fontWeight: 600
        }
      },
      tooltip: {
        trigger: 'item',
        formatter: (params: { name: string; value: number; percent: number }) => {
          const hint = !selectedEventType ? '<br/><i>Click to see status breakdown</i>' : '';
          return `<b>${params.name}</b><br/>Count: ${params.value}<br/>Percentage: ${params.percent.toFixed(1)}%${hint}`;
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
          }
        },
        right: 20,
        top: 10
      },
      series: [
        {
          name: selectedEventType ? 'Status' : 'Event Types',
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
  }, [selectedEventType, mainChartData, drillDownData]);

  // Handle chart click
  const onChartClick = (params: { name: string }) => {
    if (!selectedEventType) {
      setSelectedEventType(params.name);
    }
  };

  // Handle back button
  const handleBack = () => {
    setSelectedEventType(null);
  };

  return (
    <div>
      {selectedEventType && (
        <div style={{ marginBottom: 16 }}>
          <button
            onClick={handleBack}
            style={{
              padding: '8px 16px',
              borderRadius: 4,
              border: '1px solid #ccc',
              background: '#fff',
              cursor: 'pointer',
              fontSize: 14,
              color: '#111'
            }}
          >
            ← Back to Event Types
          </button>
        </div>
      )}
      
      <ReactECharts 
        option={option} 
        style={{ height: 500, width: '100%', cursor: selectedEventType ? 'default' : 'pointer' }}
        opts={{ renderer: 'canvas' }}
        onEvents={{
          click: onChartClick
        }}
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
        {selectedEventType ? (
          <p style={{ margin: 0, fontSize: 14, color: '#666' }}>
            Showing status distribution for <strong>{selectedEventType}</strong> events. 
            Total events: {drillDownData?.reduce((sum, d) => sum + d.value, 0) || 0}
          </p>
        ) : (
          <p style={{ margin: 0, fontSize: 14, color: '#666' }}>
            Total events: {data.length} | 
            Event types: {mainChartData.length} | 
            Click on any segment to see status breakdown
          </p>
        )}
      </div>
    </div>
  );
}
