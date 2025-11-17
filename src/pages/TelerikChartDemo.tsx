import { useState } from 'react';
import { EventRecordPieChart } from '../charts/telerik/EventRecordPieChart';
import { EventRecordBarChart } from '../charts/telerik/EventRecordBarChart';
import { EventRecordDonutChart } from '../charts/telerik/EventRecordDonutChart';
import { EventStatusDrillDownChart } from '../charts/telerik/EventStatusDrillDownChart';
import { EventDateHierarchyChart } from '../charts/telerik/EventDateHierarchyChart';
import { EventSeverityAnalysisChart } from '../charts/telerik/EventSeverityAnalysisChart';
import { TelerikHeatmap } from '../charts/telerik/TelerikHeatmap';

import { TelerikFunnel } from '../charts/telerik/TelerikFunnel';
import { TelerikBubble } from '../charts/telerik/TelerikBubble';

type TelerikChartType = 
  | 'Pie Chart' 
  | 'Bar Chart' 
  | 'Donut Chart' 
  | 'Status Drill-Down' 
  | 'Date Hierarchy' 
  | 'Severity Analysis'
  | 'Heatmap'
  | 'Funnel'
  | 'Bubble';

export function TelerikChartDemo() {
  const [selectedChart, setSelectedChart] = useState<TelerikChartType>('Pie Chart');

  const charts: TelerikChartType[] = [
    'Pie Chart',
    'Bar Chart',
    'Donut Chart',
    'Status Drill-Down',
    'Date Hierarchy',
    'Severity Analysis',
    'Heatmap',
    'Funnel',
    'Bubble'
  ];

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', padding: 24 }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ marginTop: 0, marginBottom: 8 , color: '#111' }}>Telerik Kendo React Charts</h1>
        <p style={{ color: '#666', margin: 0 }}>
          Interactive chart demonstrations using Telerik Kendo React
        </p>
      </div>

      <nav style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        {charts.map((chart) => (
          <button
            key={chart}
            onClick={() => setSelectedChart(chart)}
            style={{
              padding: '8px 16px',
              borderRadius: 4,
              border: '1px solid #ccc',
              background: selectedChart === chart ? '#ff6358' : '#f5f5f5',
              color: selectedChart === chart ? '#fff' : '#111',
              cursor: 'pointer',
              fontWeight: selectedChart === chart ? 600 : 400,
              transition: 'all 0.2s'
            }}
          >
            {chart}
          </button>
        ))}
      </nav>

      <div style={{ 
        background: '#fff', 
        borderRadius: 8, 
        padding: 24, 
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)' 
      }}>
        {selectedChart === 'Pie Chart' && <EventRecordPieChart />}
        {selectedChart === 'Bar Chart' && <EventRecordBarChart />}
        {selectedChart === 'Donut Chart' && <EventRecordDonutChart />}
        {selectedChart === 'Status Drill-Down' && <EventStatusDrillDownChart />}
        {selectedChart === 'Date Hierarchy' && <EventDateHierarchyChart />}
        {selectedChart === 'Severity Analysis' && <EventSeverityAnalysisChart />}
        {selectedChart === 'Heatmap' && <TelerikHeatmap />}
        {selectedChart === 'Funnel' && <TelerikFunnel />}
        {selectedChart === 'Bubble' && <TelerikBubble />}
      </div>
    </div>
  );
}
