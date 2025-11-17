import ReactECharts from 'echarts-for-react';
import { useState, useMemo } from 'react';
import eventList from '../../data/eventlist.json';
import { statusColors } from '../../utils/chartConstants';

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

interface DrillState {
  level: 'severity' | 'notifiable' | 'status';
  isHighPotential: boolean | null;
  isNotifiable: boolean | null;
}

const data = eventList.data as EventItem[];

export function EChartsSeverityAnalysis() {
  const [drillState, setDrillState] = useState<DrillState>({
    level: 'severity',
    isHighPotential: null,
    isNotifiable: null
  });

  // Level 1: Severity data (High Potential vs Regular)
  const severityData = useMemo(() => {
    const highPotentialCount = data.filter(event => event.isHighPotential).length;
    const regularCount = data.length - highPotentialCount;

    return [
      {
        name: 'High Potential',
        value: highPotentialCount,
        itemStyle: { color: '#ff4444' }
      },
      {
        name: 'Regular Events',
        value: regularCount,
        itemStyle: { color: '#4CAF50' }
      }
    ];
  }, []);

  // Level 2: Notifiable data (Notifiable vs Non-Notifiable)
  const notifiableData = useMemo(() => {
    if (drillState.isHighPotential === null) return null;

    const filteredData = data.filter(event => 
      event.isHighPotential === drillState.isHighPotential
    );

    const notifiableCount = filteredData.filter(event => event.isNotifiable).length;
    const nonNotifiableCount = filteredData.length - notifiableCount;

    return [
      {
        name: 'Notifiable',
        value: notifiableCount,
        isNotifiable: true
      },
      {
        name: 'Non-Notifiable',
        value: nonNotifiableCount,
        isNotifiable: false
      }
    ].filter(item => item.value > 0);
  }, [drillState.isHighPotential]);

  // Level 3: Status data
  const statusData = useMemo(() => {
    if (drillState.isHighPotential === null || drillState.isNotifiable === null) return null;

    const filteredData = data.filter(event => {
      const matchesSeverity = event.isHighPotential === drillState.isHighPotential;
      const matchesNotifiable = event.isNotifiable === drillState.isNotifiable;
      return matchesSeverity && matchesNotifiable;
    });

    const statusCounts: Record<string, number> = {};
    filteredData.forEach(event => {
      const status = event.statusName || 'Other';
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    });

    return Object.entries(statusCounts).map(([status, count]) => ({
      name: status,
      value: count
    }));
  }, [drillState.isHighPotential, drillState.isNotifiable]);

  // Chart options
  const option = useMemo(() => {
    if (drillState.level === 'severity') {
      // Level 1: Pie chart
      return {
        title: {
          text: 'Events by Severity Level (Click to drill down)',
          left: 'center',
          textStyle: {
            fontSize: 18,
            fontWeight: 600
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: (params: { name: string; value: number; percent: number }) => {
            return `<b>${params.name}</b><br/>Count: ${params.value}<br/>Percentage: ${params.percent.toFixed(1)}%<br/><i>Click to see notifiable breakdown</i>`;
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
            name: 'Severity',
            type: 'pie',
            radius: '60%',
            center: ['50%', '50%'],
            data: severityData,
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
    } else if (drillState.level === 'notifiable') {
      // Level 2: Column chart
      const chartData = notifiableData || [];
      const severityLabel = drillState.isHighPotential ? 'High Potential' : 'Regular';

      return {
        title: {
          text: `${severityLabel} Events: Notifiable Status (Click to drill down)`,
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
            const param = params[0];
            return `<b>${param.name}</b><br/>Count: ${param.value}<br/><i>Click to see status breakdown</i>`;
          }
        },
        xAxis: {
          type: 'category',
          data: chartData.map(d => d.name),
          axisLabel: {
            rotate: 0
          }
        },
        yAxis: {
          type: 'value',
          name: 'Event Count'
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
            name: 'Events',
            type: 'bar',
            data: chartData.map(d => ({
              value: d.value,
              itemStyle: {
                color: '#5470c6'
              }
            })),
            barMaxWidth: 60,
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
    } else {
      // Level 3: Column chart
      const chartData = statusData || [];
      const severityLabel = drillState.isHighPotential ? 'High Potential' : 'Regular';
      const notifiableLabel = drillState.isNotifiable ? 'Notifiable' : 'Non-Notifiable';

      return {
        title: {
          text: `${severityLabel} ${notifiableLabel} Events: Status Distribution`,
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
            const param = params[0];
            return `<b>Status: ${param.name}</b><br/>Count: ${param.value}`;
          }
        },
        xAxis: {
          type: 'category',
          data: chartData.map(d => d.name),
          axisLabel: {
            rotate: -45,
            interval: 0
          }
        },
        yAxis: {
          type: 'value',
          name: 'Event Count'
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
            name: 'Events',
            type: 'bar',
            data: chartData.map(d => ({
              value: d.value,
              itemStyle: {
                color: statusColors[d.name] || statusColors.Other
              }
            })),
            barMaxWidth: 60,
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
    }
  }, [drillState, severityData, notifiableData, statusData]);

  // Handle chart click
  const onChartClick = (params: { name: string; data?: { isNotifiable?: boolean } }) => {
    if (drillState.level === 'severity') {
      const isHighPotential = params.name === 'High Potential';
      setDrillState({
        level: 'notifiable',
        isHighPotential,
        isNotifiable: null
      });
    } else if (drillState.level === 'notifiable') {
      const isNotifiable = params.data?.isNotifiable ?? params.name === 'Notifiable';
      setDrillState({
        ...drillState,
        level: 'status',
        isNotifiable
      });
    }
  };

  // Handle back navigation
  const handleBack = () => {
    if (drillState.level === 'notifiable') {
      setDrillState({
        level: 'severity',
        isHighPotential: null,
        isNotifiable: null
      });
    } else if (drillState.level === 'status') {
      setDrillState({
        ...drillState,
        level: 'notifiable',
        isNotifiable: null
      });
    }
  };

  // Breadcrumb component
  const renderBreadcrumb = () => {
    const parts = ['All Events'];
    
    if (drillState.isHighPotential !== null) {
      parts.push(drillState.isHighPotential ? 'High Potential' : 'Regular Events');
    }
    
    if (drillState.isNotifiable !== null) {
      parts.push(drillState.isNotifiable ? 'Notifiable' : 'Non-Notifiable');
    }

    return (
      <div style={{ marginBottom: 16, fontSize: 14, color: '#666' }}>
        {parts.map((part, index) => (
          <span key={index}>
            {index > 0 && ' > '}
            <span style={{ fontWeight: index === parts.length - 1 ? 600 : 400 }}>
              {part}
            </span>
          </span>
        ))}
      </div>
    );
  };

  return (
    <div>
      {renderBreadcrumb()}
      
      {drillState.level !== 'severity' && (
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
            ← Back to {drillState.level === 'notifiable' ? 'Severity Levels' : 'Notifiable Status'}
          </button>
        </div>
      )}
      
      <ReactECharts 
        option={option} 
        style={{ height: 500, width: '100%', cursor: drillState.level === 'status' ? 'default' : 'pointer' }}
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
        {drillState.level === 'severity' ? (
          <p style={{ margin: 0, fontSize: 14, color: '#666' }}>
            Total events: {data.length} | 
            High potential: {severityData[0].value} ({((severityData[0].value / data.length) * 100).toFixed(1)}%) | 
            Click on any segment to see notifiable breakdown
          </p>
        ) : drillState.level === 'notifiable' ? (
          <p style={{ margin: 0, fontSize: 14, color: '#666' }}>
            {drillState.isHighPotential ? 'High Potential' : 'Regular'} events: {notifiableData?.reduce((sum, d) => sum + d.value, 0) || 0} | 
            Click on any bar to see status breakdown
          </p>
        ) : (
          <p style={{ margin: 0, fontSize: 14, color: '#666' }}>
            {drillState.isHighPotential ? 'High Potential' : 'Regular'} {drillState.isNotifiable ? 'Notifiable' : 'Non-Notifiable'} events: {statusData?.reduce((sum, d) => sum + d.value, 0) || 0} | 
            Drill-down complete (status level)
          </p>
        )}
      </div>
    </div>
  );
}
