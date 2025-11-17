import ReactECharts from 'echarts-for-react';
import { useState, useMemo } from 'react';
import eventList from '../../data/eventlist.json';
import { drillLevelColors } from '../../utils/chartConstants';

interface EventItem {
  id: number;
  eventRecordName: string;
  statusName: string;
  title: string;
  eventDate: string;
  eventManagerFullName: string;
}

interface DrillState {
  level: 'year' | 'month' | 'day';
  selectedYear: number | null;
  selectedMonth: number | null;
}

const data = eventList.data as EventItem[];

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function EChartsDateHierarchy() {
  const [drillState, setDrillState] = useState<DrillState>({
    level: 'year',
    selectedYear: null,
    selectedMonth: null
  });

  // Calculate year data
  const yearData = useMemo(() => {
    const yearCounts: Record<number, number> = {};

    data.forEach(item => {
      const date = new Date(item.eventDate);
      const year = date.getFullYear();
      yearCounts[year] = (yearCounts[year] || 0) + 1;
    });

    return Object.entries(yearCounts)
      .map(([year, count]) => ({
        name: year,
        value: count
      }))
      .sort((a, b) => parseInt(a.name) - parseInt(b.name));
  }, []);

  // Calculate month data for selected year
  const monthData = useMemo(() => {
    if (!drillState.selectedYear) return null;

    const monthCounts: Record<number, number> = {};
    const filteredData = data.filter(item => {
      const date = new Date(item.eventDate);
      return date.getFullYear() === drillState.selectedYear;
    });

    filteredData.forEach(item => {
      const date = new Date(item.eventDate);
      const month = date.getMonth();
      monthCounts[month] = (monthCounts[month] || 0) + 1;
    });

    return Object.entries(monthCounts)
      .map(([month, count]) => ({
        name: monthNames[parseInt(month)],
        value: count,
        monthIndex: parseInt(month)
      }))
      .sort((a, b) => a.monthIndex - b.monthIndex);
  }, [drillState.selectedYear]);

  // Calculate day data for selected month
  const dayData = useMemo(() => {
    if (!drillState.selectedYear || drillState.selectedMonth === null) return null;

    const dayCounts: Record<number, number> = {};
    const filteredData = data.filter(item => {
      const date = new Date(item.eventDate);
      return date.getFullYear() === drillState.selectedYear && 
             date.getMonth() === drillState.selectedMonth;
    });

    filteredData.forEach(item => {
      const date = new Date(item.eventDate);
      const day = date.getDate();
      dayCounts[day] = (dayCounts[day] || 0) + 1;
    });

    return Object.entries(dayCounts)
      .map(([day, count]) => ({
        name: day,
        value: count
      }))
      .sort((a, b) => parseInt(a.name) - parseInt(b.name));
  }, [drillState.selectedYear, drillState.selectedMonth]);

  // Chart options
  const option = useMemo(() => {
    let chartData;
    let xAxisName;
    let title;
    let color;

    if (drillState.level === 'year') {
      chartData = yearData;
      xAxisName = 'Year';
      title = 'Events by Year (Click to drill down)';
      color = drillLevelColors.level1;
    } else if (drillState.level === 'month') {
      chartData = monthData || [];
      xAxisName = 'Month';
      title = `Events in ${drillState.selectedYear} by Month (Click to drill down)`;
      color = drillLevelColors.level2;
    } else {
      chartData = dayData || [];
      xAxisName = 'Day';
      title = `Events in ${monthNames[drillState.selectedMonth!]} ${drillState.selectedYear} by Day`;
      color = drillLevelColors.level3;
    }

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
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        },
        formatter: (params: { name: string; value: number }[]) => {
          const param = params[0];
          const hint = drillState.level !== 'day' ? '<br/><i>Click to drill down</i>' : '';
          return `<b>${xAxisName}: ${param.name}</b><br/>Count: ${param.value}${hint}`;
        }
      },
      xAxis: {
        type: 'category',
        data: chartData.map(d => d.name),
        name: xAxisName,
        nameLocation: 'middle',
        nameGap: 30,
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
              color: color
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
  }, [drillState, yearData, monthData, dayData]);

  // Handle chart click
  const onChartClick = (params: { name: string; dataIndex: number }) => {
    if (drillState.level === 'year') {
      setDrillState({
        level: 'month',
        selectedYear: parseInt(params.name),
        selectedMonth: null
      });
    } else if (drillState.level === 'month' && monthData) {
      const monthIndex = monthData[params.dataIndex].monthIndex;
      setDrillState({
        ...drillState,
        level: 'day',
        selectedMonth: monthIndex
      });
    }
  };

  // Handle back navigation
  const handleBack = () => {
    if (drillState.level === 'month') {
      setDrillState({
        level: 'year',
        selectedYear: null,
        selectedMonth: null
      });
    } else if (drillState.level === 'day') {
      setDrillState({
        ...drillState,
        level: 'month',
        selectedMonth: null
      });
    }
  };

  // Breadcrumb component
  const renderBreadcrumb = () => {
    const parts = ['All Years'];
    
    if (drillState.selectedYear) {
      parts.push(drillState.selectedYear.toString());
    }
    
    if (drillState.selectedMonth !== null) {
      parts.push(monthNames[drillState.selectedMonth]);
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
      
      {drillState.level !== 'year' && (
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
            ← Back to {drillState.level === 'month' ? 'Years' : 'Months'}
          </button>
        </div>
      )}
      
      <ReactECharts 
        option={option} 
        style={{ height: 500, width: '100%', cursor: drillState.level === 'day' ? 'default' : 'pointer' }}
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
        {drillState.level === 'year' ? (
          <p style={{ margin: 0, fontSize: 14, color: '#666' }}>
            Total events: {data.length} | 
            Year range: {yearData[0]?.name} - {yearData[yearData.length - 1]?.name} | 
            Click on any bar to see monthly breakdown
          </p>
        ) : drillState.level === 'month' ? (
          <p style={{ margin: 0, fontSize: 14, color: '#666' }}>
            Events in {drillState.selectedYear}: {monthData?.reduce((sum, d) => sum + d.value, 0) || 0} | 
            Click on any bar to see daily breakdown
          </p>
        ) : (
          <p style={{ margin: 0, fontSize: 14, color: '#666' }}>
            Events in {monthNames[drillState.selectedMonth!]} {drillState.selectedYear}: {dayData?.reduce((sum, d) => sum + d.value, 0) || 0} | 
            Drill-down complete (day level)
          </p>
        )}
      </div>
    </div>
  );
}
