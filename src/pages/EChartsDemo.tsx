import { useState } from 'react';
import { EChartsPie } from '../charts/echarts/EChartsPie';
import { EChartsBar } from '../charts/echarts/EChartsBar';
import { EChartsDonut } from '../charts/echarts/EChartsDonut';
import { EChartsStatusDrillDown } from '../charts/echarts/EChartsStatusDrillDown';
import { EChartsDateHierarchy } from '../charts/echarts/EChartsDateHierarchy';
import { EChartsSeverityAnalysis } from '../charts/echarts/EChartsSeverityAnalysis';
import { EChartsHeatmap } from '../charts/echarts/EChartsHeatmap';
import { EChartsFunnel } from '../charts/echarts/EChartsFunnel';
import { EChartsBubble } from '../charts/echarts/EChartsBubble';
import { EChartsTreemap } from '../charts/echarts/EChartsTreemap';

type EChartsChartType = 
  | 'Pie Chart' 
  | 'Bar Chart' 
  | 'Donut Chart' 
  | 'Status Drill-Down' 
  | 'Date Hierarchy' 
  | 'Severity Analysis'
  | 'Heatmap'
  | 'Treemap'
  | 'Funnel'
  | 'Bubble';

export function EChartsDemo() {
  const [selectedChart, setSelectedChart] = useState<EChartsChartType>('Pie Chart');

  const charts: EChartsChartType[] = [
    'Pie Chart',
    'Bar Chart',
    'Donut Chart',
    'Status Drill-Down',
    'Date Hierarchy',
    'Severity Analysis',
    'Heatmap',
    'Treemap',
    'Funnel',
    'Bubble'
  ];

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', padding: 24 }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ marginTop: 0, marginBottom: 8, color: '#111' }}>Apache ECharts</h1>
        <p style={{ color: '#666', margin: 0 }}>
          Interactive chart demonstrations using Apache ECharts
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
              background: selectedChart === chart ? '#5470c6' : '#f5f5f5',
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
        {selectedChart === 'Pie Chart' && <EChartsPie />}
        {selectedChart === 'Bar Chart' && <EChartsBar />}
        {selectedChart === 'Donut Chart' && <EChartsDonut />}
        {selectedChart === 'Status Drill-Down' && <EChartsStatusDrillDown />}
        {selectedChart === 'Date Hierarchy' && <EChartsDateHierarchy />}
        {selectedChart === 'Severity Analysis' && <EChartsSeverityAnalysis />}
        {selectedChart === 'Heatmap' && <EChartsHeatmap />}
        {selectedChart === 'Treemap' && <EChartsTreemap />}
        {selectedChart === 'Funnel' && <EChartsFunnel />}
        {selectedChart === 'Bubble' && <EChartsBubble />}
      </div>
    </div>
  );
}
