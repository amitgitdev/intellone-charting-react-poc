import { useMemo } from 'react';
import { Chart, ChartSeries, ChartSeriesItem, ChartTitle, ChartLegend, ChartTooltip } from '@progress/kendo-react-charts';
import eventList from '../../data/eventlist.json';
import { statusColors } from '../../utils/chartConstants';

interface EventItem {
  id: number;
  statusName: string;
}

const data = eventList.data as EventItem[];

interface FunnelDataPoint {
  category: string;
  value: number;
  color: string;
}

export function TelerikFunnel() {
  // Process data for funnel: Status progression
  const funnelData = useMemo(() => {
    const statusOrder = [
      'Created',
      'Entry Completed',
      'Investigation Started',
      'Closed'
    ];
    
    const statusCounts: Record<string, number> = {};
    
    for (const item of data) {
      const status = item.statusName || 'Unknown';
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    }
    
    // Build funnel in order
    const funnelPoints: FunnelDataPoint[] = statusOrder
      .filter(status => statusCounts[status] > 0)
      .map(status => ({
        category: status,
        value: statusCounts[status],
        color: statusColors[status] || '#95a5a6'
      }));
    
    // Calculate conversion rates
    const total = funnelPoints[0]?.value || 1;
    const withRates = funnelPoints.map((point, index) => {
      const percentage = ((point.value / total) * 100).toFixed(1);
      const conversionFromPrevious = index > 0 
        ? ((point.value / funnelPoints[index - 1].value) * 100).toFixed(1)
        : '100.0';
      
      return {
        ...point,
        percentage,
        conversionFromPrevious
      };
    });
    
    return withRates;
  }, []);

  return (
    <div style={{ maxWidth: 800, height: 600, margin: '0 auto' }}>
      <Chart style={{ height: '100%' }}>
        <ChartTitle text="Event Status Progression Funnel" />
        <ChartLegend position="bottom" />
        
        <ChartSeries>
          <ChartSeriesItem
            type="funnel"
            data={funnelData}
            field="value"
            categoryField="category"
            colorField="color"
            dynamicHeight={true}
            dynamicSlope={true}
            labels={{
              visible: true,
              background: 'transparent',
              color: '#111',
              font: '14px Arial, sans-serif',
              content: (e: { category: string; value: number; percentage: number }) => {
                return `${e.category}\n${e.value} events`;
              }
            }}
          />
        </ChartSeries>
        
        <ChartTooltip
          render={({ point }: { point: { category: string; value: number; dataItem: { percentage: string; conversionFromPrevious: string } } }) => {
            if (!point) return null;
            const { category, value, dataItem } = point;
            
            return (
              <div style={{ padding: '8px 12px', background: 'white', color: '#111', border: '1px solid #111', borderRadius: '4px' }}>
                <strong>{category}</strong><br/>
                Events: <strong>{value}</strong><br/>
                Of Total: <strong>{dataItem.percentage}%</strong><br/>
                {dataItem.conversionFromPrevious !== '100.0' && (
                  <>Conversion: <strong>{dataItem.conversionFromPrevious}%</strong></>
                )}
              </div>
            );
          }}
        />
      </Chart>
      
      <div style={{ marginTop: 20, padding: 15, background: '#f8f9fa', borderRadius: 4 }}>
        <h4 style={{ margin: '0 0 10px 0',color: '#111' }}>About This Funnel</h4>
        <p style={{ margin: '0 0 10px 0', fontSize: 14, color: '#666' }}>
          This funnel chart shows the progression of events through different status stages, 
          from creation to closure. Each stage shows the number of events and conversion rate.
        </p>
        <div style={{ fontSize: 13, color: '#666' }}>
          {funnelData.map((point, index) => (
            <div key={point.category} style={{ marginBottom: 4 }}>
              <strong>{point.category}:</strong> {point.value} events ({point.percentage}% of total)
              {index > 0 && ` - ${point.conversionFromPrevious}% conversion from previous stage`}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
