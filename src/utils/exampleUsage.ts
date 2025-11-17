/**
 * Example Usage of Chart Utilities
 * 
 * This file demonstrates how to use the chart data processors and constants
 * in your chart components.
 */

import {
  // Data processors
  groupByEventType,
  groupByStatus,
  getEventTypeBreakdown,
  getStatusBreakdown,
  getYearlyBreakdown,
  getMonthlyBreakdown,
  getDailyBreakdown,
  getDateEventTypeMatrix,
  getHierarchicalData,
  getStatusProgressionFunnel,
  getMultiDimensionalData,
  
  // Constants
  eventTypeColors,
  statusColors,
  drillLevelColors,
  defaultChartColors,
  MONTH_NAMES,
  STATUS_PROGRESSION,
  
  // Helper functions
  getEventTypeColor,
  getStatusColor,
  getDrillLevelColor,
  getMonthName,
  formatDate,
  calculatePercentage,
  
  // Types
  EventItem,
  ChartDataPoint,
  StatusDrillState,
  DateDrillState,
  ChartConfig
} from './index';

// Example: Load and process event data for a Pie Chart
export function examplePieChartData(eventData: EventItem[]): ChartDataPoint[] {
  const processedData = groupByEventType(eventData);
  
  // Add colors to each data point
  return processedData.map(item => ({
    ...item,
    color: getEventTypeColor(item.category)
  }));
}

// Example: Process data for Status Drill-Down Chart
export function exampleStatusDrillDown(
  eventData: EventItem[],
  drillState: StatusDrillState
): ChartDataPoint[] {
  
  if (!drillState.selectedEventType) {
    // Level 1: Show all event types
    return getEventTypeBreakdown(eventData).map(item => ({
      ...item,
      color: getEventTypeColor(item.category)
    }));
  } else {
    // Level 2: Show status breakdown for selected event type
    return getStatusBreakdown(eventData, drillState.selectedEventType).map(item => ({
      ...item,
      color: getStatusColor(item.category)
    }));
  }
}

// Example: Process data for Date Hierarchy Chart
export function exampleDateHierarchy(
  eventData: EventItem[],
  drillState: DateDrillState
): ChartDataPoint[] {
  
  switch (drillState.level) {
    case 'year':
      return getYearlyBreakdown(eventData).map(item => ({
        ...item,
        color: getDrillLevelColor('year')
      }));
      
    case 'month':
      if (!drillState.selectedYear) return [];
      return getMonthlyBreakdown(eventData, drillState.selectedYear).map(item => ({
        ...item,
        color: getDrillLevelColor('month')
      }));
      
    case 'day':
      if (!drillState.selectedYear || !drillState.selectedMonth) return [];
      return getDailyBreakdown(
        eventData,
        drillState.selectedYear,
        drillState.selectedMonth
      ).map(item => ({
        ...item,
        color: getDrillLevelColor('day')
      }));
      
    default:
      return [];
  }
}

// Example: Get chart configuration
export function exampleChartConfig(): ChartConfig {
  return {
    title: 'Event Analysis',
    width: 700,
    height: 420,
    responsive: true,
    showLegend: true,
    showTooltip: true,
    animation: true,
    animationDuration: 750
  };
}

// Example: Format tooltip content
export function exampleTooltipFormatter(
  value: number,
  category: string,
  total: number
): string {
  const percentage = calculatePercentage(value, total);
  return `
    <strong>${category}</strong><br/>
    Count: ${value}<br/>
    Percentage: ${percentage}%
  `;
}

// Example: Using constants
export function exampleColorMapping() {
  return {
    eventTypeColors,
    statusColors,
    drillLevelColors,
    monthNames: MONTH_NAMES,
    statusProgression: STATUS_PROGRESSION
  };
}

// Example: Process funnel data
export function exampleFunnelChart(eventData: EventItem[]): ChartDataPoint[] {
  const funnelData = getStatusProgressionFunnel(eventData);
  
  // Add colors to funnel stages
  return funnelData.map((item, index) => ({
    ...item,
    color: defaultChartColors[index]
  }));
}

// Example: Process heatmap data
export function exampleHeatmap(eventData: EventItem[]) {
  return getDateEventTypeMatrix(eventData);
}

// Example: Process treemap data
export function exampleTreemap(eventData: EventItem[]) {
  return getHierarchicalData(eventData);
}

// Example: Process bubble chart data
export function exampleBubbleChart(eventData: EventItem[]) {
  return getMultiDimensionalData(eventData);
}
