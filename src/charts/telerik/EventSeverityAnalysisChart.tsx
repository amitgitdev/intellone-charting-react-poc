import { useState, useMemo } from 'react';
import { Chart, ChartSeries, ChartSeriesItem, ChartTitle, ChartLegend, ChartTooltip, ChartCategoryAxis, ChartCategoryAxisItem, ChartValueAxis, ChartValueAxisItem } from '@progress/kendo-react-charts';
import eventList from '../../data/eventlist.json';
import { color } from 'highcharts';

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

type DrillLevel = 'severity' | 'notifiable' | 'status';

interface DrillState {
  level: DrillLevel;
  selectedSeverity?: 'High Potential' | 'Regular';
  selectedNotifiable?: 'Notifiable' | 'Non-notifiable';
}

const data = eventList.data as EventItem[];

// Color scheme for different categories
const severityColors = {
  'High Potential': '#e74c3c',
  'Regular': '#3498db'
};

const notifiableColors = {
  'Notifiable': '#f39c12',
  'Non-notifiable': '#95a5a6'
};

const statusColors = {
  'Created': '#ecf0f1',
  'Investigation Started': '#f39c12',
  'Entry Completed': '#2ecc71',
  'Closed': '#27ae60',
  'Other': '#bdc3c7'
};

export function EventSeverityAnalysisChart() {
  const [drillState, setDrillState] = useState<DrillState>({ level: 'severity' });

  // Process data based on current drill level
  const chartData = useMemo(() => {
    const processedData: Record<string, number> = {};

    if (drillState.level === 'severity') {
      // Level 1: High Potential vs Regular
      data.forEach(item => {
        const key = item.isHighPotential ? 'High Potential' : 'Regular';
        processedData[key] = (processedData[key] || 0) + 1;
      });

      return Object.entries(processedData).map(([category, value]) => ({
        category,
        value,
        color: severityColors[category as keyof typeof severityColors]
      }));
    }

    if (drillState.level === 'notifiable') {
      // Level 2: Notifiable vs Non-notifiable within selected severity
      const filteredData = data.filter(item => {
        const severity = item.isHighPotential ? 'High Potential' : 'Regular';
        return severity === drillState.selectedSeverity;
      });

      filteredData.forEach(item => {
        const key = item.isNotifiable ? 'Notifiable' : 'Non-notifiable';
        processedData[key] = (processedData[key] || 0) + 1;
      });

      return Object.entries(processedData).map(([category, value]) => ({
        category,
        value,
        color: notifiableColors[category as keyof typeof notifiableColors]
      }));
    }

    if (drillState.level === 'status') {
      // Level 3: Status distribution within selected severity and notifiable category
      const filteredData = data.filter(item => {
        const severity = item.isHighPotential ? 'High Potential' : 'Regular';
        const notifiable = item.isNotifiable ? 'Notifiable' : 'Non-notifiable';
        return severity === drillState.selectedSeverity && 
               notifiable === drillState.selectedNotifiable;
      });

      filteredData.forEach(item => {
        const key = item.statusName || 'Other';
        processedData[key] = (processedData[key] || 0) + 1;
      });

      return Object.entries(processedData).map(([category, value]) => ({
        category,
        value,
        color: statusColors[category as keyof typeof statusColors] || statusColors.Other
      }));
    }

    return [];
  }, [drillState]);

  // Handle chart click for drill-down
  const handleChartClick = (e: { point?: { category?: string | number | Date } }) => {
    if (!e.point || !e.point.category) return;
    
    const category = String(e.point.category);

    if (drillState.level === 'severity') {
      setDrillState({
        level: 'notifiable',
        selectedSeverity: category as 'High Potential' | 'Regular'
      });
    } else if (drillState.level === 'notifiable') {
      setDrillState({
        level: 'status',
        selectedSeverity: drillState.selectedSeverity,
        selectedNotifiable: category as 'Notifiable' | 'Non-notifiable'
      });
    }
  };

  // Handle back navigation
  const handleBack = () => {
    if (drillState.level === 'status') {
      setDrillState({
        level: 'notifiable',
        selectedSeverity: drillState.selectedSeverity
      });
    } else if (drillState.level === 'notifiable') {
      setDrillState({ level: 'severity' });
    }
  };

  // Generate title and breadcrumb
  const getTitle = () => {
    switch (drillState.level) {
      case 'severity':
        return 'Event Severity Analysis';
      case 'notifiable':
        return `${drillState.selectedSeverity} Events - Notifiable Status`;
      case 'status': {
        return `${drillState.selectedSeverity} ${drillState.selectedNotifiable} Events - Status Distribution`;
      }
      default:
        return 'Event Severity Analysis';
    }
  };

  const getBreadcrumb = () => {
    const parts = ['Severity'];
    if (drillState.selectedSeverity) {
      parts.push(drillState.selectedSeverity);
    }
    if (drillState.selectedNotifiable) {
      parts.push(drillState.selectedNotifiable);
    }
    return parts.join(' > ');
  };

  // Get chart type based on level
  const getChartType = () => {
    return drillState.level === 'severity' ? 'pie' : 'column';
  };

  return (
    <div style={{ maxWidth: 900, height: 750, padding: '20px', margin: '0 auto' }}>
      {/* Header with navigation */}
      <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
        {drillState.level !== 'severity' && (
          <button
            onClick={handleBack}
            style={{
              padding: '8px 16px',
              borderRadius: 4,
              border: '1px solid #ccc',
              background: '#f5f5f5',
              cursor: 'pointer',
              color: '#111',
            }}
          >
            ← Back
          </button>
        )}
        <div>
          <h3 style={{ margin: 0 }}>{getTitle()}</h3>
          <p style={{ margin: '5px 0 0 0', color: '#666', fontSize: '14px' }}>
            {getBreadcrumb()} 
            {drillState.level !== 'status' && ' (Click segments/bars to drill down)'}
          </p>
        </div>
      </div>

      {/* Chart */}
      <Chart 
        style={{ height: '450px', cursor: drillState.level !== 'status' ? 'pointer' : 'default' }}
        onSeriesClick={drillState.level !== 'status' ? handleChartClick : undefined}
      >
        <ChartTitle text={getTitle()} />
        <ChartLegend position="bottom" orientation="horizontal" />
        
        {getChartType() === 'column' && (
          <>
            <ChartCategoryAxis>
              <ChartCategoryAxisItem 
                categories={chartData.map(item => item.category)}
                labels={{ rotation: 0 }}
              />
            </ChartCategoryAxis>
            
            <ChartValueAxis>
              <ChartValueAxisItem 
                labels={{ format: '{0}' }}
                title={{ text: 'Number of Events' }}
              />
            </ChartValueAxis>
          </>
        )}

        <ChartSeries>
          <ChartSeriesItem
            type={getChartType() as 'pie' | 'column'}
            data={getChartType() === 'pie' ? chartData : chartData.map(item => item.value)}
            field={getChartType() === 'pie' ? 'value' : undefined}
            categoryField={getChartType() === 'pie' ? 'category' : undefined}
            colorField={getChartType() === 'pie' ? 'color' : undefined}
            color={getChartType() === 'column' ? chartData[0]?.color : undefined}
            name="Events"
            labels={{
              visible: true,
              content: getChartType() === 'pie' 
                ? (e: { category: string; value: number; percentage: number }) => `${e.category}\n${e.value} (${e.percentage.toFixed(1)}%)`
                : (e: { category: string; value: number }) => `${e.value}`
            }}
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
                {drillState.level !== 'status' && (
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
      <div style={{ marginTop: '20px', padding: '15px', background: '#f8f9fa', borderRadius: '4px', color:'#111' }}>
        <h4 style={{ margin: '0 0 10px 0' }}>Summary</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
          <div >
            <strong>Current View:</strong> {(() => {
              switch (drillState.level) {
                case 'severity': return 'Severity Categories';
                case 'notifiable': return 'Notifiable Status';
                case 'status': return 'Status Distribution';
                default: return 'Unknown';
              }
            })()}
          </div>
          <div>
            <strong>Total Events:</strong> {chartData.reduce((s, d) => s + d.value, 0)}
          </div>
          <div>
            <strong>Categories:</strong> {chartData.length}
          </div>
          {drillState.selectedSeverity && (
            <div>
              <strong>Severity:</strong> {drillState.selectedSeverity}
            </div>
          )}
          {drillState.selectedNotifiable && (
            <div>
              <strong>Notifiable:</strong> {drillState.selectedNotifiable}
            </div>
          )}
        </div>
        
        {/* Risk Analysis Insights */}
        {drillState.level === 'severity' && (
          <div style={{ marginTop: '15px', padding: '10px', background: '#fff3cd', borderRadius: '4px', textAlign: 'left' }}>
            <strong>Risk Analysis:</strong>
            <ul style={{ margin: '5px 0', paddingLeft: '20px', textAlign: 'left' }}>
              <li>High Potential events require immediate attention and thorough investigation</li>
              <li>Monitor the ratio of High Potential to Regular events for risk trends</li>
              <li>Notifiable events may require regulatory reporting</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}