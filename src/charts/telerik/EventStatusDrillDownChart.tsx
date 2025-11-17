import { useState, useMemo } from 'react';
import { Chart, ChartSeries, ChartSeriesItem, ChartTitle, ChartLegend, ChartTooltip } from '@progress/kendo-react-charts';
import eventList from '../../data/eventlist.json';

interface EventItem {
  id: number;
  eventRecordName: string;
  statusName: string;
  title: string;
  eventDate: string;
  eventManagerFullName: string;
}



const data = eventList.data as EventItem[];

// Define colors for different event types and statuses
const eventTypeColors = {
  'Incident': '#e74c3c',
  'Accident': '#f39c12',
  'Security': '#8e44ad',
  'Quality': '#3498db',
  'Other': '#95a5a6'
};

const statusColors = {
  'Created': '#ecf0f1',
  'Investigation Started': '#f39c12',
  'Entry Completed': '#2ecc71',
  'Closed': '#27ae60',
  'Other': '#bdc3c7'
};

export function EventStatusDrillDownChart() {
  const [selectedEventType, setSelectedEventType] = useState<string | null>(null);

  // Process data for main chart (Event Record Types)
  const mainChartData = useMemo(() => {
    const eventTypeCounts = data.reduce((acc, item) => {
      const eventType = item.eventRecordName || 'Other';
      acc[eventType] = (acc[eventType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(eventTypeCounts).map(([eventType, count]) => ({
      category: eventType,
      value: count,
      color: eventTypeColors[eventType as keyof typeof eventTypeColors] || eventTypeColors.Other
    }));
  }, []);

  // Process data for drill-down chart (Status breakdown for selected event type)
  const drillDownData = useMemo(() => {
    if (!selectedEventType) return null;

    const filteredEvents = data.filter(item => item.eventRecordName === selectedEventType);
    const statusCounts = filteredEvents.reduce((acc, item) => {
      const status = item.statusName || 'Other';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(statusCounts).map(([status, count]) => ({
      category: status,
      value: count,
      color: statusColors[status as keyof typeof statusColors] || statusColors.Other
    }));
  }, [selectedEventType]);

  const handleChartClick = (e: { point?: { category?: string | number | Date } }) => {
    if (!selectedEventType && e.point && e.point.category) {
      setSelectedEventType(String(e.point.category));
    }
  };

  const handleBackClick = () => {
    setSelectedEventType(null);
  };

  return (
    <div style={{ maxWidth: 800, height: 500, padding: '20px', margin: '0 auto' }}>
      <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
        {selectedEventType && (
          <button
            onClick={handleBackClick}
            style={{
              padding: '8px 16px',
              borderRadius: 4,
              border: '1px solid #f7ebebff',
              background: '#300303ff',
              cursor: 'pointer'
            }}
          >
            ← Back to Event Types
          </button>
        )}
        <h3 style={{ margin: 0 }}>
          {selectedEventType 
            ? `Status Distribution for ${selectedEventType} Events` 
            : 'Event Record Types (Click to drill down)'
          }
        </h3>
      </div>

      <Chart 
        style={{ height: '400px', cursor: selectedEventType ? 'default' : 'pointer' }}
        onSeriesClick={selectedEventType ? undefined : handleChartClick}
      >
        <ChartTitle 
          text={selectedEventType 
            ? `${selectedEventType}: Status Breakdown` 
            : "Events by Record Type"
          } 
        />
        <ChartLegend position="bottom" orientation="horizontal" />
        
        <ChartSeries>
          <ChartSeriesItem
            type="pie"
            data={selectedEventType ? (drillDownData || []) : mainChartData}
            field="value"
            categoryField="category"
            colorField="color"
            labels={{
              visible: false,
              content: (e: { category: string; value: number; percentage: number }) => `${e.category}\n${e.value} (${e.percentage.toFixed(1)}%)`
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
            const category = point.category;
            const total = selectedEventType 
              ? drillDownData?.reduce((s, d) => s + d.value, 0) || 0
              : mainChartData.reduce((s, d) => s + d.value, 0);
            const pct = ((value / total) * 100).toFixed(1);
            
            return (
              <div style={{ 
                padding: '8px 12px', 
                background: 'white', 
                border: '1px solid #230404ff', 
                borderRadius: '4px',
                fontSize: '12px',
                color: '#0e0e0eff'
              }}>
                <strong>{String(category)}</strong><br/>
                Count: {value}<br/>
                Percentage: {pct}%
                {!selectedEventType && (
                  <div style={{ marginTop: '4px', fontStyle: 'italic', color: '#666' }}>
                    Click to see status breakdown
                  </div>
                )}
              </div>
            );
          }}
        />
      </Chart>

      {/* Summary Information */}
      <div style={{ marginTop: '20px', padding: '15px', background: '#f8f9fa', borderRadius: '4px' }}>
        <h4 style={{ margin: '0 0 10px 0' }}>Summary</h4>
        {selectedEventType ? (
          <p style={{ margin: 0 }}>
            Showing status distribution for <strong>{selectedEventType}</strong> events. 
            Total events: {drillDownData?.reduce((s, d) => s + d.value, 0) || 0}
          </p>
        ) : (
          <p style={{ margin: 0 }}>
            Total events: {data.length} | 
            Event types: {mainChartData.length} | 
            Click on any segment to see status breakdown
          </p>
        )}
      </div>
    </div>
  );
}