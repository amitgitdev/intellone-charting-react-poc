import { useMemo } from 'react';
import { Chart, ChartSeries, ChartSeriesItem, ChartTitle, ChartLegend, ChartTooltip } from '@progress/kendo-react-charts';
import eventList from '../../data/eventlist.json';
import { eventTypeColors } from '../../utils/chartConstants';

interface EventItem {
  id: number;
  eventRecordName: string;
  orgStructurePath: string;
}

const data = eventList.data as EventItem[];

interface TreemapDataPoint {
  name: string;
  value: number;
  color?: string;
}

export function TelerikTreemap() {
  // Process data for treemap: Organization > Event Type hierarchy
  const treemapData = useMemo(() => {
    const orgEventCounts: Record<string, Record<string, number>> = {};
    
    // Build hierarchical structure
    for (const item of data) {
      const org = item.orgStructurePath || 'Unknown';
      const eventType = item.eventRecordName || 'Other';
      
      if (!orgEventCounts[org]) {
        orgEventCounts[org] = {};
      }
      
      orgEventCounts[org][eventType] = (orgEventCounts[org][eventType] || 0) + 1;
    }
    
    // Convert to flat structure for treemap
    const treemapPoints: TreemapDataPoint[] = [];
    
    for (const [org, eventTypes] of Object.entries(orgEventCounts)) {
      for (const [eventType, count] of Object.entries(eventTypes)) {
        treemapPoints.push({
          name: `${org}\n${eventType}`,
          value: count,
          color: eventTypeColors[eventType] || '#95a5a6'
        });
      }
    }
    
    // Sort by value descending
    return treemapPoints.sort((a, b) => b.value - a.value);
  }, []);

  return (
    <div style={{ maxWidth: 1000, height: 600, margin: '0 auto' }}>
      <Chart style={{ height: '100%' }}>
        <ChartTitle text="Event Distribution: Organization & Type Hierarchy" />
        <ChartLegend visible={false} />
        
        <ChartSeries>
          <ChartSeriesItem
            type="treemap"
            data={treemapData}
            field="value"
            categoryField="name"
            colorField="color"
            labels={{
              visible: true,
              format: '{0}',
              color: '#fff',
              background: 'transparent',
              content: (e: { category: string; value: number }) => {
                // Only show label if value is significant
                if (e.value > 3) {
                  const parts = e.category.split('\n');
                  return `${parts[1] || parts[0]}\n${e.value}`;
                }
                return '';
              }
            }}
          />
        </ChartSeries>
        
        <ChartTooltip
          render={({ point }: { point: { category: string; value: number } }) => {
            if (!point) return null;
            const parts = point.category.split('\n');
            const org = parts[0];
            const eventType = parts[1] || parts[0];
            const count = point.value;
            
            return (
              <div style={{ padding: '8px 12px', background: 'white', border: '1px solid #ccc', borderRadius: '4px' }}>
                <strong>Organization:</strong> {org}<br/>
                <strong>Event Type:</strong> {eventType}<br/>
                <strong>Count:</strong> {count} events
              </div>
            );
          }}
        />
      </Chart>
      
      <div style={{ marginTop: 20, padding: 15, background: '#f8f9fa', borderRadius: 4 }}>
        <h4 style={{ margin: '0 0 10px 0' }}>About This Treemap</h4>
        <p style={{ margin: 0, fontSize: 14, color: '#666' }}>
          This treemap visualizes the hierarchical distribution of events across organizations and event types. 
          Larger rectangles represent higher event counts. Colors indicate different event types.
        </p>
      </div>
    </div>
  );
}
