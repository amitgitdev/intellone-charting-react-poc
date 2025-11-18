import { useState } from 'react';
import './App.css';
import { TelerikChartDemo } from './pages/TelerikChartDemo';
import { EChartsDemo } from './pages/EChartsDemo';
import { HighchartsDemo } from './pages/HighchartsDemo';
import { GridDemoPlaceholder } from './reports/GridDemo';

type View = 'home' | 'grid' | 'telerik' | 'echarts' | 'highcharts';

export default function App() {
  const [view, setView] = useState<View>('home');

  // Home/Landing Page
  if (view === 'home') {
    return (
      <div style={{ fontFamily: 'system-ui, sans-serif', minHeight: '100vh', background: '#f8f9fa' }}>
        {/* Header */}
        <div style={{ background: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', padding: '16px 24px' }}>
          <h1 style={{ margin: 0, fontSize: 24,color:'#111'  }}>📊 Chart Library Evaluation POC</h1>
          <p style={{ margin: '4px 0 0 0', color: '#666' }}>
            Comparing Telerik Kendo React, Apache ECharts & Highcharts
          </p>
        </div>

        {/* Main Content */}
        <div style={{ padding: '0px 48px 48px 48px', maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ marginBottom: 32, textAlign: 'center' }}>
            <h2 style={{ fontSize: 28, marginBottom: 12,color:'#111' }}>Choose a Chart Library</h2>
            <p style={{ color: '#666', fontSize: 16 }}>
              Explore interactive chart demonstrations with event data
            </p>
          </div>

          {/* Chart Library Cards */}
          <div style={{ 
            display: 'flex', 
            gap: 24,
            marginBottom: 32,
            justifyContent: 'center'
          }}>
            {/* Highcharts Card */}
            <div
              onClick={() => setView('highcharts')}
              style={{
                background: '#fff',
                borderRadius: 12,
                padding: 32,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                cursor: 'pointer',
                transition: 'all 0.3s',
                border: '2px solid transparent',
                flex: '1 1 300px',
                maxWidth: 350
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.15)';
                e.currentTarget.style.borderColor = '#8085e9';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                e.currentTarget.style.borderColor = 'transparent';
              }}
            >
              <div style={{ fontSize: 48, marginBottom: 16 }}>📈</div>
              <h3 style={{ margin: '0 0 8px 0', fontSize: 22, color: '#8085e9' }}>
                Highcharts
              </h3>
              <p style={{ color: '#666', marginBottom: 16, minHeight: 60 }}>
                Industry-standard charts with built-in drill-down and export features
              </p>
              <div style={{ 
                background: '#f5f3ff', 
                padding: '8px 12px', 
                borderRadius: 6, 
                fontSize: 14,
                color: '#6d28d9',
                fontWeight: 600,
                marginBottom: 12
              }}>
                10 Charts Available
              </div>
              <div style={{ fontSize: 14, color: '#666' }}>
                ✓ Pie, Bar, Donut<br/>
                ✓ Native Drill-Down Module<br/>
                ✓ Heatmap, Treemap, Funnel, Bubble
              </div>
            </div>

            {/* ECharts Card */}
            <div
              onClick={() => setView('echarts')}
              style={{
                background: '#fff',
                borderRadius: 12,
                padding: 32,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                cursor: 'pointer',
                transition: 'all 0.3s',
                border: '2px solid transparent',
                flex: '1 1 300px',
                maxWidth: 350
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.15)';
                e.currentTarget.style.borderColor = '#5470c6';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                e.currentTarget.style.borderColor = 'transparent';
              }}
            >
              <div style={{ fontSize: 48, marginBottom: 16 }}>📊</div>
              <h3 style={{ margin: '0 0 8px 0', fontSize: 22, color: '#5470c6' }}>
                Apache ECharts
              </h3>
              <p style={{ color: '#666', marginBottom: 16, minHeight: 60 }}>
                Open-source, highly flexible charting library with beautiful animations
              </p>
              <div style={{ 
                background: '#f0f5ff', 
                padding: '8px 12px', 
                borderRadius: 6, 
                fontSize: 14,
                color: '#1d4ed8',
                fontWeight: 600,
                marginBottom: 12
              }}>
                10 Charts Available
              </div>
              <div style={{ fontSize: 14, color: '#666' }}>
                ✓ Pie, Bar, Donut<br/>
                ✓ Manual Drill-Downs<br/>
                ✓ Heatmap, Treemap, Funnel, Bubble
              </div>
            </div>

            {/* Telerik Card */}
            <div
              onClick={() => setView('telerik')}
              style={{
                background: '#fff',
                borderRadius: 12,
                padding: 32,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                cursor: 'pointer',
                transition: 'all 0.3s',
                border: '2px solid transparent',
                flex: '1 1 300px',
                maxWidth: 350
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.15)';
                e.currentTarget.style.borderColor = '#ff6358';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                e.currentTarget.style.borderColor = 'transparent';
              }}
            >
              <div style={{ fontSize: 48, marginBottom: 16 }}>🎯</div>
              <h3 style={{ margin: '0 0 8px 0', fontSize: 22, color: '#ff6358' }}>
                Telerik Kendo React
              </h3>
              <p style={{ color: '#666', marginBottom: 16, minHeight: 60 }}>
                Enterprise-grade charting with extensive customization and built-in themes
              </p>
              <div style={{ 
                background: '#fff5f4', 
                padding: '8px 12px', 
                borderRadius: 6, 
                fontSize: 14,
                color: '#c92a2a',
                fontWeight: 600,
                marginBottom: 12
              }}>
                10 Charts Available
              </div>
              <div style={{ fontSize: 14, color: '#666' }}>
                ✓ Pie, Bar, Donut<br/>
                ✓ Drill-Down Reports<br/>
                ✓ Heatmap, Treemap, Funnel, Bubble
              </div>
            </div>
          </div>

          {/* Grid Demo Link */}
          <div style={{ textAlign: 'center', marginTop: 32 }}>
            <button
              onClick={() => setView('grid')}
              style={{
                padding: '12px 24px',
                borderRadius: 8,
                border: '2px solid #dee2e6',
                background: '#fff',
                color: '#495057',
                cursor: 'pointer',
                fontSize: 16,
                fontWeight: 500,
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#f8f9fa';
                e.currentTarget.style.borderColor = '#adb5bd';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#fff';
                e.currentTarget.style.borderColor = '#dee2e6';
              }}
            >
              📋 View Grid Demo
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Other views with back button
  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', minHeight: '100vh', background: '#f8f9fa' }}>
      {/* Header with back button */}
      <div style={{ background: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', padding: '16px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button
            onClick={() => setView('home')}
            style={{
              padding: '8px 16px',
              borderRadius: 6,
              border: '1px solid #dee2e6',
              background: '#fff',
              color: '#495057',
              cursor: 'pointer',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}
          >
            ← Back to Home
          </button>
          <div>
            <h1 style={{ margin: 0, fontSize: 24, color: '#111' }}>📊 Chart Library Evaluation POC</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div>
        {view === 'grid' && <GridDemoPlaceholder />}
        {view === 'telerik' && <TelerikChartDemo />}
        {view === 'echarts' && <EChartsDemo />}
        {view === 'highcharts' && <HighchartsDemo />}
      </div>
    </div>
  );
}

