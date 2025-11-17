import { useState, useMemo } from 'react';
import { Chart, ChartSeries, ChartSeriesItem, ChartTitle, ChartLegend, ChartTooltip, ChartCategoryAxis, ChartCategoryAxisItem, ChartValueAxis, ChartValueAxisItem } from '@progress/kendo-react-charts';
import eventList from '../../data/eventlist.json';
import { Color } from '@progress/kendo-drawing';

interface EventItem {
  id: number;
  eventRecordName: string;
  statusName: string;
  title: string;
  eventDate: string;
  eventManagerFullName: string;
}

type DrillLevel = 'year' | 'month' | 'day';

interface DrillState {
  level: DrillLevel;
  selectedYear?: string;
  selectedMonth?: string;
}

const data = eventList.data as EventItem[];

// Color palette for different levels
const levelColors = {
  year: '#3498db',
  month: '#2ecc71', 
  day: '#e74c3c'
};

export function EventDateHierarchyChart() {
  const [drillState, setDrillState] = useState<DrillState>({ level: 'year' });

  // Helper function to format month names
  const getMonthName = (monthNum: string) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                   'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[parseInt(monthNum) - 1] || monthNum;
  };

  // Process data based on current drill level
  const chartData = useMemo(() => {
    const processedData: Record<string, number> = {};

    data.forEach(item => {
      if (!item.eventDate) return;
      
      const date = new Date(item.eventDate);
      const year = date.getFullYear().toString();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');

      let key: string;
      
      if (drillState.level === 'year') {
        key = year;
      } else if (drillState.level === 'month') {
        if (drillState.selectedYear === year) {
          key = `${getMonthName(month)} ${year}`;
        } else {
          return; // Skip if not in selected year
        }
      } else if (drillState.selectedYear === year && 
          drillState.selectedMonth === month) {
        key = `${getMonthName(month)} ${day}, ${year}`;
      } else {
        return; // Skip if not in selected year/month
      }

      processedData[key] = (processedData[key] || 0) + 1;
    });

    // Convert to chart format and sort
    const chartArray = Object.entries(processedData)
      .map(([category, value]) => ({
        category,
        value,
        color: levelColors[drillState.level]
      }))
      .sort((a, b) => {
        // Sort by date logic
        if (drillState.level === 'year') {
          return parseInt(a.category) - parseInt(b.category);
        } else if (drillState.level === 'month') {
          const aMonth = a.category.split(' ')[0];
          const bMonth = b.category.split(' ')[0];
          const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                         'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          return months.indexOf(aMonth) - months.indexOf(bMonth);
        } else {
          // For days, sort by day number
          const aDay = parseInt(a.category.split(' ')[1].replace(',', ''));
          const bDay = parseInt(b.category.split(' ')[1].replace(',', ''));
          return aDay - bDay;
        }
      });

    return chartArray;
  }, [drillState]);

  // Handle chart click for drill-down
  const handleChartClick = (e: { point?: { category?: string | number | Date } }) => {
    if (!e.point || !e.point.category) return;
    
    const category = String(e.point.category);

    if (drillState.level === 'year') {
      setDrillState({
        level: 'month',
        selectedYear: category
      });
    } else if (drillState.level === 'month') {
      const monthName = category.split(' ')[0];
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                     'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const monthNum = (months.indexOf(monthName) + 1).toString().padStart(2, '0');
      
      setDrillState({
        level: 'day',
        selectedYear: drillState.selectedYear,
        selectedMonth: monthNum
      });
    }
  };

  // Handle back navigation
  const handleBack = () => {
    if (drillState.level === 'day') {
      setDrillState({
        level: 'month',
        selectedYear: drillState.selectedYear
      });
    } else if (drillState.level === 'month') {
      setDrillState({ level: 'year' });
    }
  };

  // Generate title and breadcrumb
  const getTitle = () => {
    switch (drillState.level) {
      case 'year':
        return 'Events by Year';
      case 'month':
        return `Events by Month - ${drillState.selectedYear}`;
      case 'day': {
        const monthName = getMonthName(drillState.selectedMonth || '01');
        return `Events by Day - ${monthName} ${drillState.selectedYear}`;
      }
      default:
        return 'Events by Date';
    }
  };

  const getBreadcrumb = () => {
    const parts = ['Years'];
    if (drillState.selectedYear) {
      parts.push(drillState.selectedYear);
    }
    if (drillState.selectedMonth) {
      parts.push(getMonthName(drillState.selectedMonth));
    }
    return parts.join(' > ');
  };

  return (
    <div style={{ maxWidth: 900, height: 600, padding: '20px', margin: '0 auto' }}>
      {/* Header with navigation */}
      <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '15px',cursor: drillState.level !== 'day' ? 'pointer' : 'default'  }}>
        {drillState.level !== 'year' && (
          <button
            onClick={handleBack}
            style={{
              padding: '8px 16px',
              borderRadius: 4,
              border: '1px solid #ccc',
              background: '#f5f5f5',
              cursor: 'pointer',
              color: '#111'
            }}
          >
            ← Back
          </button>
        )}
        <div>
          <h3 style={{ margin: 0 }}>{getTitle()}</h3>
          <p style={{ margin: '5px 0 0 0', color: '#666', fontSize: '14px' }}>
            {getBreadcrumb()} 
            {drillState.level !== 'day' && ' (Click bars to drill down)'}
          </p>
        </div>
      </div>

      {/* Chart */}
      <Chart 
        style={{ height: '450px', cursor: drillState.level !== 'day' ? 'pointer' : 'default' }}
        onSeriesClick={drillState.level !== 'day' ? handleChartClick : undefined}
      >
        <ChartTitle text={getTitle()} />
        <ChartLegend visible={false} />
        
        <ChartCategoryAxis>
          <ChartCategoryAxisItem 
            categories={chartData.map(item => item.category)}
            labels={{ 
              rotation: drillState.level === 'day' ? -45 : 0,
              step: drillState.level === 'day' ? 1 : undefined
            }}
          />
        </ChartCategoryAxis>
        
        <ChartValueAxis>
          <ChartValueAxisItem 
            labels={{ format: '{0}' }}
            title={{ text: 'Number of Events' }}
          />
        </ChartValueAxis>

        <ChartSeries>
          <ChartSeriesItem
            type="column"
            data={chartData.map(item => item.value)}
            name="Events"
            color={levelColors[drillState.level]}
            tooltip={{
              visible: true
            }}
          />
        </ChartSeries>

        <ChartTooltip 
          render={({ point }: { point: { value: number; category: string | number | Date } }) => {
            if (!point) return null;
            const value = point.value;
            const category = String(point.category);
            const total = chartData.reduce((s, d) => s + d.value, 0);
            const pct = ((value / total) * 100).toFixed(1);
            
            return (
              <div style={{ 
                padding: '8px 12px', 
                background: 'white', 
                border: '1px solid #ccc', 
                borderRadius: '4px',
                fontSize: '12px',
                color: '#0e0e0eff'
              }}>
                <strong>{category}</strong><br/>
                Events: {value}<br/>
                Percentage: {pct}%
                {drillState.level !== 'day' && (
                  <div style={{ marginTop: '4px', fontStyle: 'italic', color: '#666' }}>
                    Click to drill down
                  </div>
                )}
              </div>
            );
          }}
        />
      </Chart>

      {/* Summary Information */}
      <div style={{ marginTop: '20px', padding: '15px', background: '#f8f9fa', borderRadius: '4px' }}>
        <h4 style={{ margin: '0 0 10px 0', color: '#111 !important' }}>Summary</h4>
        <div style={{ display: 'flex', gap: '30px' }}>
          <p style={{ margin: 0, color: '#111' }}>
            <strong>Current View:</strong> {(() => {
              switch (drillState.level) {
                case 'year': return 'Yearly';
                case 'month': return 'Monthly';
                case 'day': return 'Daily';
                default: return 'Unknown';
              }
            })()} breakdown
          </p>
          <p style={{ margin: 0, color: '#111' }}>
            <strong>Total Events:</strong> {chartData.reduce((s, d) => s + d.value, 0)}
          </p>
          <p style={{ margin: 0, color: '#111' }}>
            <strong>Time Periods:</strong> {chartData.length}
          </p>
        </div>
      </div>
    </div>
  );
}