import { Chart, ChartSeries, ChartSeriesItem, ChartTitle, ChartLegend, ChartTooltip, ChartArea, ChartCategoryAxis, ChartCategoryAxisItem, ChartValueAxis, ChartValueAxisItem } from '@progress/kendo-react-charts';
import eventRecords from '../../data/eventrecord.json';

interface EventRecordItem {
  eventRecordName: string;
  eventCount: number;
  totalNumberOfEvents: number;
}

interface TooltipPoint {
  value: number;
  categoryIndex: number;
}

const data = eventRecords as EventRecordItem[];

export function EventRecordBarChart() {
  return (
    <div style={{ maxWidth: 700, height: 420, margin: '0 auto' }}>
      <Chart style={{ height: '100%' }} >
        <ChartTitle text="Events by Category" position='top' />
        <ChartLegend position="bottom" orientation="horizontal" />
        <ChartArea background='white' margin={30} />
        <ChartCategoryAxis>
          <ChartCategoryAxisItem 
            categories={data.map(item => item.eventRecordName)}
            labels={{ rotation: -45 }}
          />
        </ChartCategoryAxis>
        <ChartValueAxis>
          <ChartValueAxisItem 
            labels={{ format: '{0}' }}
            title={{ text: 'Event Count' }}
          />
        </ChartValueAxis>
        <ChartSeries>
          <ChartSeriesItem
            type="column"
            data={data.map(item => item.eventCount)}
            name="Event Count"
            color="#007acc"
            tooltip={{
              visible: true
            }}
          />
        </ChartSeries>
        <ChartTooltip 
          render={({ point }: { point: TooltipPoint }) => {
            if (!point) return null;
            const value = point.value;
            const categoryIndex = point.categoryIndex;
            const category = data[categoryIndex]?.eventRecordName || 'Unknown';
            const total = data.reduce((s, d) => s + d.eventCount, 0);
            const pct = ((value / total) * 100).toFixed(2);
            return (
              <span style={{ fontSize: 10 }}>
                {category}: <strong>{value}</strong> ({pct}%)
              </span>
            );
          }}
        />
      </Chart>
    </div>
  );
}