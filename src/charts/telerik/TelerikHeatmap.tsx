import { useMemo } from 'react';
import {
  Chart,
  ChartSeries,
  ChartSeriesItem,
  ChartTitle,
  ChartLegend,
  ChartTooltip,
  ChartXAxis,
  ChartXAxisItem,
  ChartYAxis,
  ChartYAxisItem,
  ChartArea
} from '@progress/kendo-react-charts';

import eventList from '../../data/eventlist.json';
import 'hammerjs';

interface EventItem {
  id: number;
  eventRecordName: string;
  eventDate: string;
}

const data = eventList.data as EventItem[];

interface HeatmapPoint {
  x: string;
  y: string;
  value: number;
}

export function TelerikHeatmap() {
  const heatmapData = useMemo(() => {
    const matrix: Record<string, Record<string, number>> = {};
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    // Limit to a 4-year window (2015-2018)
     const filteredData = data; // data.filter(item => {
    //   if (!item.eventDate) return false;
    //   const year = new Date(item.eventDate).getFullYear();
    //   return year >= 2015 && year <= 2018;
    // });

    for (const item of filteredData) {
      if (!item.eventDate) continue;

      const date = new Date(item.eventDate);
      const year = date.getFullYear();
      const month = date.getMonth();
      const monthKey = `${monthNames[month]} ${year}`;
      const eventType = item.eventRecordName || 'Other';

      if (!matrix[monthKey]) {
        matrix[monthKey] = {};
      }
      matrix[monthKey][eventType] = (matrix[monthKey][eventType] || 0) + 1;
    }

    const allMonths = Object.keys(matrix).sort((a, b) => {
      const [monthA, yearA] = a.split(' ');
      const [monthB, yearB] = b.split(' ');
      const yearDiff = Number.parseInt(yearA) - Number.parseInt(yearB);
      if (yearDiff !== 0) return yearDiff;
      return monthNames.indexOf(monthA) - monthNames.indexOf(monthB);
    });

    const allEventTypes = Array.from(
      new Set(filteredData.map(d => d.eventRecordName || 'Other'))
    );

    // Only keep months that actually have events
    const monthsWithData = allMonths.filter(month => {
      const total = Object.values(matrix[month] || {}).reduce(
        (sum, c) => sum + c,
        0
      );
      return total > 0;
    });

    // Build full matrix including zero-value cells (for even spacing)
    const points: HeatmapPoint[] = [];
    let maxValue = 0;
    for (const month of monthsWithData) {
      for (const event of allEventTypes) {
        const value = matrix[month]?.[event] ?? 0;
        if (value > maxValue) maxValue = value;
        points.push({ x: month, y: event, value });
      }
    }

    // Pre-compute color ranges for heat intensity (GitHub-style green scale)
    const colorRanges = maxValue === 0 ? [] : [
      { from: 0, to: 0, color: '#f0f0f0' },
      { from: 1, to: Math.max(1, Math.round(maxValue * 0.25)), color: '#c6e48b' },
      { from: Math.round(maxValue * 0.25) + 1, to: Math.round(maxValue * 0.5), color: '#7bc96f' },
      { from: Math.round(maxValue * 0.5) + 1, to: Math.round(maxValue * 0.75), color: '#239a3b' },
      { from: Math.round(maxValue * 0.75) + 1, to: maxValue, color: '#196127' }
    ];

    return {
      points,
      months: monthsWithData,
      eventTypes: allEventTypes,
      colorRanges,
      maxValue
    };
  }, []);


  console.log('Raw Data', heatmapData.points.map(p => [
              heatmapData.months.indexOf(p.x),
              heatmapData.eventTypes.indexOf(p.y),
              p.value
            ]));

  return (
    <div style={{ maxWidth: 1200, height: 550, margin: '0 auto', padding: 0 }}>
      <Chart 
        style={{ height: 500, width: '100%' }}
      >
        <ChartTitle text="Event Heatmap: Monthly Activity by Type (2015-2018)" />
        <ChartLegend visible={false} />
        <ChartArea 
          background="" 
          margin={{ left: 120, right: 40, top: 60, bottom: 100 }}
          
          
        />

        <ChartXAxis>
          <ChartXAxisItem
            labels={{
              rotation: -45,
              padding: 0,
              skip: 0,
              step: 1,
              content: (e: { value: number }) => heatmapData.months[e.value] || ''
            }}
            majorGridLines={{ visible: false }}
            line={{ visible: false }}
          />
        </ChartXAxis>

        <ChartYAxis>
          <ChartYAxisItem
            labels={{
              padding: 0,
              skip: 0,
              step: 1,
              content: (e: { value: number }) => heatmapData.eventTypes[e.value] || ''
            }}
            majorGridLines={{ visible: true }}
            line={{ visible: false }}
          />
        </ChartYAxis>

        <ChartSeries>
          <ChartSeriesItem
            type="heatmap"
            data={heatmapData.points.map(p => [
              heatmapData.months.indexOf(p.x),
              heatmapData.eventTypes.indexOf(p.y),
              p.value
            ])}
            border={{ width: 1 }}
            color="#216e39"
            labels={{
              visible: true,
              color: '#090909ff',
              font: '10px Arial',
              content: (e: { value?: unknown }) => {
                if (Array.isArray(e.value) && e.value.length >= 3) {
                  const v = Number(e.value[2]) || 0;
                  return v > 0 ? String(v) : '';
                }
                if (typeof e.value === 'number') {
                  return e.value > 0 ? String(e.value) : '';
                }
                return '';
              }
            }}
          />
        </ChartSeries>

        <ChartTooltip
          render={({ point }: { point?: { value?: unknown; dataItem?: unknown } }) => {
            if (!point) return null;
            const raw = Array.isArray(point.dataItem) ? point.dataItem : (Array.isArray(point.value) ? point.value : undefined);
            if (!raw || raw.length < 3) return null;
            const monthIndex = Number(raw[0]);
            const eventIndex = Number(raw[1]);
            const count = Number(raw[2]) || 0;
            const month = heatmapData.months[monthIndex];
            const eventType = heatmapData.eventTypes[eventIndex];
            if (!month || !eventType) return null;
            return (
              <div style={{ padding: '8px 12px', background: 'white', border: '1px solid #ccc', borderRadius: '4px' }}>
                <strong>{month}</strong><br />
                {eventType}: <strong>{count}</strong> events
              </div>
            );
          }}
        />
      </Chart>

       <div
        style={{
          marginTop: 30,
          padding: 15,
          background: '#f5f5f5',
          borderRadius: 4
        }}>
        <h4 style={{ margin: '0 0 10px 0', color: '#666' }}>About This Heatmap</h4>
        <p style={{ margin: 0, fontSize: 14, color: '#666' }}>
          This heatmap shows event distribution across time (months) and event 
          types. Darker colors indicate higher event counts.
        </p>
      </div>
    </div>
  );
}
