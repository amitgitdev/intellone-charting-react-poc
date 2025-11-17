import { useState } from 'react';
import { HighchartsPie } from '../charts/highcharts/HighchartsPie';
import { HighchartsBar } from '../charts/highcharts/HighchartsBar';
import { HighchartsDonut } from '../charts/highcharts/HighchartsDonut';
import { HighchartsStatusDrillDown } from '../charts/highcharts/HighchartsStatusDrillDown';
import { HighchartsDateHierarchy } from '../charts/highcharts/HighchartsDateHierarchy';
import { HighchartsSeverityAnalysis } from '../charts/highcharts/HighchartsSeverityAnalysis';
import { HighchartsHeatmap } from '../charts/highcharts/HighchartsHeatmap';
import { HighchartsTreemap } from '../charts/highcharts/HighchartsTreemap';
import { HighchartsFunnel } from '../charts/highcharts/HighchartsFunnel';
import { HighchartsBubble } from '../charts/highcharts/HighchartsBubble';

type HighchartsChartType = 
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

export function HighchartsDemo() {
  const [selectedChart, setSelectedChart] = useState<HighchartsChartType>('Pie Chart');

  const charts: HighchartsChartType[] = [
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
        <h1 style={{ marginTop: 0, marginBottom: 8, color: '#111' }}>Highcharts</h1>
        <p style={{ color: '#666', margin: 0 }}>
          Interactive chart demonstrations using Highcharts
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
              background: selectedChart === chart ? '#7cb5ec' : '#f5f5f5',
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
        {selectedChart === 'Pie Chart' && <HighchartsPie />}
        {selectedChart === 'Bar Chart' && <HighchartsBar />}
        {selectedChart === 'Donut Chart' && <HighchartsDonut />}
        {selectedChart === 'Status Drill-Down' && <HighchartsStatusDrillDown />}
        {selectedChart === 'Date Hierarchy' && <HighchartsDateHierarchy />}
        {selectedChart === 'Severity Analysis' && <HighchartsSeverityAnalysis />}
        {selectedChart === 'Heatmap' && <HighchartsHeatmap />}
        {selectedChart === 'Treemap' && <HighchartsTreemap />}
        {selectedChart === 'Funnel' && <HighchartsFunnel />}
        {selectedChart === 'Bubble' && <HighchartsBubble />}
      </div>
    </div>
  );
}
