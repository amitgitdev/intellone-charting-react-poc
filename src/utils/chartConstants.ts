/**
 * Chart Constants and Shared Types
 * 
 * This module provides shared constants, color palettes, and type definitions
 * used across all chart implementations (Telerik, ECharts, Highcharts).
 */

// ============================================================================
// Color Palettes
// ============================================================================

/**
 * Color palette for event types
 * Consistent colors across all chart implementations
 */
export const eventTypeColors: Record<string, string> = {
  'Incident': '#e74c3c',
  'Accident': '#f39c12',
  'Security': '#8e44ad',
  'Quality': '#3498db',
  'Other': '#95a5a6'
};

/**
 * Color palette for event statuses
 */
export const statusColors: Record<string, string> = {
  'Created': '#818485ff',
  'Investigation Started': '#f39c12',
  'Entry Completed': '#2ecc71',
  'Closed': '#27ae60',
  'Other': '#bdc3c7'
};

/**
 * Color palette for drill-down hierarchy levels
 */
export const drillLevelColors = {
  year: '#3498db',
  month: '#2ecc71',
  day: '#e74c3c'
};

/**
 * Default chart color palette
 * Used when specific colors are not defined
 */
export const defaultChartColors = [
  '#3498db', // Blue
  '#2ecc71', // Green
  '#e74c3c', // Red
  '#f39c12', // Orange
  '#9b59b6', // Purple
  '#1abc9c', // Turquoise
  '#34495e', // Dark Gray
  '#e67e22', // Carrot
  '#95a5a6', // Gray
  '#16a085'  // Dark Turquoise
];

/**
 * Severity/priority colors
 */
export const severityColors = {
  high: '#e74c3c',
  medium: '#f39c12',
  low: '#2ecc71',
  none: '#95a5a6'
};

/**
 * High potential indicator colors
 */
export const highPotentialColors = {
  highPotential: '#c0392b',
  normal: '#3498db'
};

// ============================================================================
// Drill-Down State Types
// ============================================================================

/**
 * State for Status Drill-Down (2 levels)
 * Level 1: Event Types
 * Level 2: Status breakdown for selected event type
 */
export interface StatusDrillState {
  selectedEventType: string | null;
}

/**
 * State for Date Hierarchy Drill-Down (3 levels)
 * Level 1: Years
 * Level 2: Months (for selected year)
 * Level 3: Days (for selected year and month)
 */
export interface DateDrillState {
  level: 'year' | 'month' | 'day';
  selectedYear?: string;
  selectedMonth?: string;
}

/**
 * Generic drill-down level
 */
export interface DrillDownLevel {
  id: string;
  name: string;
  data: Array<{
    name: string;
    value: number;
    drilldown?: string;
  }>;
}

// ============================================================================
// Chart Configuration Types
// ============================================================================

/**
 * Common chart configuration options
 */
export interface ChartConfig {
  title?: string;
  subtitle?: string;
  width?: number | string;
  height?: number | string;
  responsive?: boolean;
  showLegend?: boolean;
  showTooltip?: boolean;
  animation?: boolean;
  animationDuration?: number;
}

/**
 * Tooltip configuration
 */
export interface TooltipConfig {
  enabled: boolean;
  format?: string;
  showPercentage?: boolean;
  customFormatter?: (point: any) => string;
}

/**
 * Legend configuration
 */
export interface LegendConfig {
  enabled: boolean;
  position: 'top' | 'bottom' | 'left' | 'right';
  align?: 'start' | 'center' | 'end';
  layout?: 'horizontal' | 'vertical';
}

// ============================================================================
// Chart Data Types
// ============================================================================

/**
 * Standard data point for simple charts (pie, bar, donut)
 */
export interface SimpleDataPoint {
  name: string;
  value: number;
  color?: string;
}

/**
 * Data point with drill-down capability
 */
export interface DrillDownDataPoint extends SimpleDataPoint {
  drilldown?: string;
}

/**
 * Heatmap data point
 */
export interface HeatmapPoint {
  x: string | number;
  y: string | number;
  value: number;
  color?: string;
}

/**
 * Bubble chart data point
 */
export interface BubblePoint {
  x: string | number | Date;
  y: string | number;
  z: number; // size
  name?: string;
  color?: string;
  category?: string;
}

/**
 * Treemap data point
 */
export interface TreemapPoint {
  name: string;
  value: number;
  parent?: string;
  color?: string;
  colorValue?: number;
}

/**
 * Time series data point
 */
export interface TimeSeriesPoint {
  date: Date | string;
  value: number;
  category?: string;
}

// ============================================================================
// Utility Constants
// ============================================================================

/**
 * Month names for date formatting
 */
export const MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

/**
 * Full month names
 */
export const MONTH_NAMES_FULL = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

/**
 * Day names
 */
export const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/**
 * Status progression order (for funnel charts)
 */
export const STATUS_PROGRESSION = [
  'Created',
  'Entry Completed',
  'Investigation Started',
  'Closed'
];

/**
 * Default chart dimensions
 */
export const DEFAULT_CHART_SIZE = {
  width: 700,
  height: 420,
  minHeight: 300,
  maxHeight: 800
};

/**
 * Responsive breakpoints (in pixels)
 */
export const BREAKPOINTS = {
  mobile: 768,
  tablet: 1024,
  desktop: 1440
};

/**
 * Animation durations (in milliseconds)
 */
export const ANIMATION_DURATION = {
  fast: 300,
  normal: 750,
  slow: 1000
};

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Get color for event type
 */
export function getEventTypeColor(eventType: string): string {
  return eventTypeColors[eventType] || defaultChartColors[0];
}

/**
 * Get color for status
 */
export function getStatusColor(status: string): string {
  return statusColors[status] || statusColors.Other;
}

/**
 * Get color for drill level
 */
export function getDrillLevelColor(level: 'year' | 'month' | 'day'): string {
  return drillLevelColors[level];
}

/**
 * Format month name from month number
 */
export function getMonthName(monthNum: string | number, full: boolean = false): string {
  const num = typeof monthNum === 'string' ? Number.parseInt(monthNum) : monthNum;
  const index = num - 1;
  
  if (index < 0 || index > 11) return String(monthNum);
  
  return full ? MONTH_NAMES_FULL[index] : MONTH_NAMES[index];
}

/**
 * Format date for display
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

/**
 * Calculate percentage
 */
export function calculatePercentage(value: number, total: number, decimals: number = 1): string {
  if (total === 0) return '0.0';
  return ((value / total) * 100).toFixed(decimals);
}

/**
 * Get responsive chart size based on window width
 */
export function getResponsiveChartSize(): { width: number; height: number } {
  const windowWidth = typeof window !== 'undefined' ? window.innerWidth : 1024;
  
  if (windowWidth < BREAKPOINTS.mobile) {
    return { width: windowWidth - 48, height: 300 };
  } else if (windowWidth < BREAKPOINTS.tablet) {
    return { width: 600, height: 400 };
  } else {
    return { width: 700, height: 420 };
  }
}

/**
 * Debounce function for resize handlers
 */
export function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}
