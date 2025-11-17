import { useMemo } from 'react';
import { Chart, ChartSeries, ChartSeriesItem, ChartTitle, ChartLegend, ChartTooltip, ChartXAxis, ChartXAxisItem, ChartYAxis, ChartYAxisItem } from '@progress/kendo-react-charts';
import eventList from '../../data/eventlist.json';
import { eventTypeColors, highPotentialColors } from '../../utils/chartConstants';

interface EventItem {
  id: number;
  eventRecordName: string;
  eventDate: string;
  isHighPotential: boolean;
}

const data = eventList.data as EventItem[];

interface BubbleDataPoint {
  x: number; // Date as timestamp
  y: number; // Event type index
  size: number;
  category: string;
  date: string;
  eventType: string;
  count: number;
  isHighPotential: boolean;
  color: string;
}

export function TelerikBubble() {
  // Process data for bubble chart: Date x Event Type with size = count
  const bubbleData = useMemo(() => {
    const dateEventMap: Record<string, Record<string, { count: number; highPotential: number }>> = {};
    
    // Group by date and event type
    for (const item of data) {
      if (!item.eventDate) continue;
      const date = new Date(item.eventDate).toISOString().split('T')[0];
      const eventType = item.eventRecordName || 'Other';
      
      if (!dateEventMap[date]) {
        dateEventMap[date] = {};
      }
      
      if (!dateEventMap[date][eventType]) {
        dateEventMap[date][eventType] = { count: 0, highPotential: 0 };
      }
      
      dateEventMap[date][eventType].count += 1;
      if (item.isHighPotential) {
        dateEventMap[date][eventType].highPotential += 1;
      }
    }
    
    // Get unique event types
    const eventTypes = Array.from(new Set(data.map(d => d.eventRecordName || 'Other')));
    const eventTypeIndexMap: Record<string, number> = {};
    eventTypes.forEach((type, index) => {
      eventTypeIndexMap[type] = index;
    });
    
    // Convert to bubble format
    const bubbles: BubbleDataPoint[] = [];
    for (const [date, eventTypeData] of Object.entries(dateEventMap)) {
      for (const [eventType, counts] of Object.entries(eventTypeData)) {
        const hasHighPotential = counts.highPotential > 0;
        bubbles.push({
          x: new Date(date).getTime(),
          y: eventTypeIndexMap[eventType],
          size: counts.count * 100, // Scale up for visibility
          category: `${eventType} - ${date}`,
          date,
          eventType,
          count: counts.count,
          isHighPotential: hasHighPotential,
          color: hasHighPotential 
            ? highPotentialColors.highPotential 
            : (eventTypeColors[eventType] || '#3498db')
        });
      }
    }
    
    return {
      bubbles,
      eventTypes,
      minDate: Math.min(...bubbles.map(b => b.x)),
      maxDate: Math.max(...bubbles.map(b => b.x))
    };
  }, []);

  return (
    <div style={{ maxWidth: 1100, height: 600, margin: '0 auto' }}>
      <Chart style={{ height: '100%' }}>
        <ChartTitle text="Event Bubble Chart: Timeline vs Event Type" />
        <ChartLegend visible={true} position="bottom" />
        
        <ChartXAxis>
          <ChartXAxisItem 
            type="date"
            labels={{
              rotation: -45,
              format: 'MMM yyyy'
            }}
            min={new Date(bubbleData.minDate)}
            max={new Date(bubbleData.maxDate)}
          />
        </ChartXAxis>
        
        <ChartYAxis>
          <ChartYAxisItem 
            categories={bubbleData.eventTypes}
            labels={{
              content: (e: { value: number }) => bubbleData.eventTypes[e.value] || ''
            }}
          />
        </ChartYAxis>
        
        <ChartSeries>
          <ChartSeriesItem
            type="bubble"
            data={bubbleData.bubbles}
            xField="x"
            yField="y"
            sizeField="size"
            categoryField="category"
            colorField="color"
            labels={{
              visible: false
            }}
            opacity={0.7}
          />
        </ChartSeries>
        
        <ChartTooltip
          render={({ point }: { point: { dataItem: BubbleDataPoint } }) => {
            if (!point?.dataItem) return null;
            const bubble = point.dataItem;
            
            return (
              <div style={{ padding: '8px 12px', background: 'white', color: '#111', border: '1px solid #111', borderRadius: '4px' }}>
                <strong>{bubble.eventType}</strong><br/>
                Date: {bubble.date}<br/>
                Events: <strong>{bubble.count}</strong><br/>
                {bubble.isHighPotential && (
                  <span style={{ color: '#c0392b', fontWeight: 'bold' }}>⚠️ High Potential</span>
                )}
              </div>
            );
          }}
        />
      </Chart>
      
      <div style={{ marginTop: 20, padding: 15, background: '#f8f9fa', borderRadius: 4 }}>
        <h4 style={{ margin: '0 0 10px 0',color: '#111' }}>About This Bubble Chart</h4>
        <p style={{ margin: '0 0 10px 0', fontSize: 14, color: '#666' }}>
          This bubble chart shows events across time (X-axis) and event types (Y-axis). 
          Bubble size represents the number of events. Red bubbles indicate high-potential events.
        </p>
        <div style={{ display: 'flex', gap: 20, fontSize: 13 }}>
          <div>
            <span style={{ 
              display: 'inline-block', 
              width: 12, 
              height: 12, 
              background: highPotentialColors.highPotential, 
              borderRadius: '50%',
              marginRight: 6,
              
            }}></span>
            <span style={{ color: '#111' }}>High Potential Events</span>
          </div>
          <div>
            <span style={{ 
              display: 'inline-block', 
              width: 12, 
              height: 12, 
              background: '#3498db', 
              borderRadius: '50%',
              marginRight: 6
            }}></span>
            <span style={{ color: '#111' }}>Normal Events</span>
          </div>
        </div>
      </div>
    </div>
  );
}
