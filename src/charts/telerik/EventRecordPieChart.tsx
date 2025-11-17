import { Chart, ChartSeries, ChartSeriesItem, ChartTitle, ChartLegend, ChartTooltip, ChartArea } from '@progress/kendo-react-charts';
import eventRecords from '../../data/eventrecord.json';

interface EventRecordItem {
  eventRecordName: string;
  eventCount: number;
  totalNumberOfEvents: number;
}

const data = eventRecords as EventRecordItem[];

export function EventRecordPieChart() {
  return (
    <div style={{ maxWidth: 700, height: 420, margin: '0 auto' }}>
      <Chart style={{ height: '100%' }} >
        <ChartTitle text="Events by Category" position='top' />
        <ChartLegend position="bottom" orientation="horizontal" margin-top={60} />
        <ChartArea background='white' margin={30} />
        <ChartSeries>
          <ChartSeriesItem
            type="pie"
            data={data}
            field="eventCount"
            categoryField="eventRecordName"
            padding={0}
            labels={{
              visible: false,
              background: 'transparent',
              content: (e) => `${e.category}: ${e.dataItem.eventCount}`
            }}
            tooltip={{
              visible: true
            }}
          />
        </ChartSeries>
        <ChartTooltip 
          render={({ point }: { point: any }) => {
            if (!point) return null;
            const value = point.value;
            const category = point.category;
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
