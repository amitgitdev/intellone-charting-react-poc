/**
 * Chart Data Processing Utilities
 * 
 * This module provides data transformation functions for processing
 * event data into chart-compatible formats for Telerik, ECharts, and Highcharts.
 */

// ============================================================================
// Type Definitions
// ============================================================================

export interface EventItem {
  id: number;
  title: string;
  eventRecordId: number;
  eventRecordName: string;
  eventDate: string;
  locationLat?: number;
  locationLng?: number;
  eventManagerFullName: string;
  orgStructureId: string;
  orgStructurePath: string;
  isHighPotential: boolean;
  isNotifiable: boolean;
  statusId: number;
  statusName: string;
}

export interface ChartDataPoint {
  category: string;
  value: number;
  color?: string;
}

export interface HeatmapDataPoint {
  x: string | number;
  y: string | number;
  value: number;
}

export interface TreemapDataPoint {
  name: string;
  value: number;
  parent?: string;
  color?: string;
}

export interface BubbleDataPoint {
  x: string | number | Date;
  y: string | number;
  z: number; // bubble size
  name?: string;
  color?: string;
}

// ============================================================================
// Data Processing Functions
// ============================================================================

/**
 * Group events by event type (eventRecordName)
 * Used for: Pie Charts, Donut Charts
 */
export function groupByEventType(data: EventItem[]): ChartDataPoint[] {
  const counts: Record<string, number> = {};
  
  for (const item of data) {
    const eventType = item.eventRecordName || 'Other';
    counts[eventType] = (counts[eventType] || 0) + 1;
  }
  
  return Object.entries(counts).map(([category, value]) => ({
    category,
    value
  }));
}

/**
 * Group events by status
 * Used for: Bar Charts, Status analysis
 */
export function groupByStatus(data: EventItem[]): ChartDataPoint[] {
  const counts: Record<string, number> = {};
  
  for (const item of data) {
    const status = item.statusName || 'Unknown';
    counts[status] = (counts[status] || 0) + 1;
  }
  
  return Object.entries(counts).map(([category, value]) => ({
    category,
    value
  }));
}

/**
 * Get event type breakdown for main drill-down level
 * Used for: Status Drill-Down Charts (Level 1)
 */
export function getEventTypeBreakdown(data: EventItem[]): ChartDataPoint[] {
  return groupByEventType(data);
}

/**
 * Get status breakdown for a specific event type
 * Used for: Status Drill-Down Charts (Level 2)
 */
export function getStatusBreakdown(data: EventItem[], eventType: string): ChartDataPoint[] {
  const filteredData = data.filter(item => item.eventRecordName === eventType);
  return groupByStatus(filteredData);
}

/**
 * Get yearly event breakdown
 * Used for: Date Hierarchy Charts (Level 1)
 */
export function getYearlyBreakdown(data: EventItem[]): ChartDataPoint[] {
  const counts: Record<string, number> = {};
  
  for (const item of data) {
    if (!item.eventDate) continue;
    const year = new Date(item.eventDate).getFullYear().toString();
    counts[year] = (counts[year] || 0) + 1;
  }
  
  return Object.entries(counts)
    .map(([category, value]) => ({ category, value }))
    .sort((a, b) => Number.parseInt(a.category) - Number.parseInt(b.category));
}

/**
 * Get monthly event breakdown for a specific year
 * Used for: Date Hierarchy Charts (Level 2)
 */
export function getMonthlyBreakdown(data: EventItem[], year: string): ChartDataPoint[] {
  const counts: Record<string, number> = {};
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  for (const item of data) {
    if (!item.eventDate) continue;
    const date = new Date(item.eventDate);
    const itemYear = date.getFullYear().toString();
    
    if (itemYear === year) {
      const month = date.getMonth();
      const monthKey = `${monthNames[month]} ${year}`;
      counts[monthKey] = (counts[monthKey] || 0) + 1;
    }
  }
  
  return Object.entries(counts).map(([category, value]) => ({ category, value }));
}

/**
 * Get daily event breakdown for a specific year and month
 * Used for: Date Hierarchy Charts (Level 3)
 */
export function getDailyBreakdown(data: EventItem[], year: string, month: string): ChartDataPoint[] {
  const counts: Record<string, number> = {};
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthIndex = monthNames.indexOf(month);
  
  for (const item of data) {
    if (!item.eventDate) continue;
    const date = new Date(item.eventDate);
    const itemYear = date.getFullYear().toString();
    const itemMonth = date.getMonth();
    
    if (itemYear === year && itemMonth === monthIndex) {
      const day = date.getDate();
      const dayKey = `${month} ${day}, ${year}`;
      counts[dayKey] = (counts[dayKey] || 0) + 1;
    }
  }
  
  return Object.entries(counts)
    .map(([category, value]) => ({ category, value }))
    .sort((a, b) => {
      const aDay = Number.parseInt(a.category.split(' ')[1].replace(',', ''));
      const bDay = Number.parseInt(b.category.split(' ')[1].replace(',', ''));
      return aDay - bDay;
    });
}

/**
 * Get date and event type matrix for heatmap
 * Used for: Heatmap Charts
 */
export function getDateEventTypeMatrix(data: EventItem[]): HeatmapDataPoint[] {
  const matrix: HeatmapDataPoint[] = [];
  const dateEventMap: Record<string, Record<string, number>> = {};
  
  // Build the matrix
  for (const item of data) {
    if (!item.eventDate) continue;
    const date = new Date(item.eventDate).toISOString().split('T')[0]; // YYYY-MM-DD
    const eventType = item.eventRecordName || 'Other';
    
    if (!dateEventMap[date]) {
      dateEventMap[date] = {};
    }
    
    dateEventMap[date][eventType] = (dateEventMap[date][eventType] || 0) + 1;
  }
  
  // Convert to array format
  for (const [date, eventTypes] of Object.entries(dateEventMap)) {
    for (const [eventType, count] of Object.entries(eventTypes)) {
      matrix.push({
        x: date,
        y: eventType,
        value: count
      });
    }
  }
  
  return matrix;
}

/**
 * Get hierarchical data for treemap
 * Used for: Treemap Charts
 */
export function getHierarchicalData(data: EventItem[]): TreemapDataPoint[] {
  const hierarchy: TreemapDataPoint[] = [];
  const orgEventCounts: Record<string, Record<string, number>> = {};
  
  // Build hierarchical structure: orgStructurePath > eventRecordName > count
  for (const item of data) {
    const org = item.orgStructurePath || 'Unknown';
    const eventType = item.eventRecordName || 'Other';
    
    if (!orgEventCounts[org]) {
      orgEventCounts[org] = {};
    }
    
    orgEventCounts[org][eventType] = (orgEventCounts[org][eventType] || 0) + 1;
  }
  
  // Convert to treemap format
  for (const [org, eventTypes] of Object.entries(orgEventCounts)) {
    // Add parent node (organization)
    const orgTotal = Object.values(eventTypes).reduce((sum, count) => sum + count, 0);
    hierarchy.push({
      name: org,
      value: orgTotal
    });
    
    // Add child nodes (event types under this org)
    for (const [eventType, count] of Object.entries(eventTypes)) {
      hierarchy.push({
        name: `${org} - ${eventType}`,
        value: count,
        parent: org
      });
    }
  }
  
  return hierarchy;
}

/**
 * Get status progression funnel data
 * Used for: Funnel Charts
 */
export function getStatusProgressionFunnel(data: EventItem[]): ChartDataPoint[] {
  const statusOrder = [
    'Created',
    'Entry Completed',
    'Investigation Started',
    'Closed'
  ];
  
  const statusCounts = groupByStatus(data);
  const statusMap = new Map(statusCounts.map(item => [item.category, item.value]));
  
  // Return in funnel order
  return statusOrder
    .filter(status => statusMap.has(status))
    .map(status => ({
      category: status,
      value: statusMap.get(status) || 0
    }));
}

/**
 * Get multi-dimensional bubble chart data
 * Used for: Bubble Charts
 */
export function getMultiDimensionalData(data: EventItem[]): BubbleDataPoint[] {
  const bubbleData: BubbleDataPoint[] = [];
  
  // Group by date and event type
  const dateEventMap: Record<string, Record<string, { count: number; highPotential: number }>> = {};
  
  for (const item of data) {
    if (!item.eventDate) continue;
    const date = new Date(item.eventDate).toISOString().split('T')[0];
    const eventType = item.eventRecordName || 'Other';
    
    if (!dateEventMap[date]) {
      dateEventMap[date] = {};
    }
    
    if (!dateEventMap[date][eventType]) {
      dateEventMap[date][eventType] = { count: 0, highPotential: 0 };
    }
    
    dateEventMap[date][eventType].count += 1;
    if (item.isHighPotential) {
      dateEventMap[date][eventType].highPotential += 1;
    }
  }
  
  // Convert to bubble format
  for (const [date, eventTypes] of Object.entries(dateEventMap)) {
    for (const [eventType, data] of Object.entries(eventTypes)) {
      bubbleData.push({
        x: date,
        y: eventType,
        z: data.count,
        name: `${eventType} - ${date}`,
        color: data.highPotential > 0 ? 'high-potential' : 'normal'
      });
    }
  }
  
  return bubbleData;
}

/**
 * Get aggregated counts by field
 * Generic utility for custom aggregations
 */
export function getAggregatedCounts<T extends Record<string, any>>(
  data: T[],
  fieldName: keyof T
): ChartDataPoint[] {
  const counts: Record<string, number> = {};
  
  for (const item of data) {
    const value = String(item[fieldName] || 'Unknown');
    counts[value] = (counts[value] || 0) + 1;
  }
  
  return Object.entries(counts).map(([category, value]) => ({
    category,
    value
  }));
}

/**
 * Filter data by date range
 */
export function filterByDateRange(
  data: EventItem[],
  startDate: Date,
  endDate: Date
): EventItem[] {
  return data.filter(item => {
    if (!item.eventDate) return false;
    const date = new Date(item.eventDate);
    return date >= startDate && date <= endDate;
  });
}

/**
 * Get unique values for a field
 */
export function getUniqueValues<T extends Record<string, any>>(
  data: T[],
  fieldName: keyof T
): string[] {
  const uniqueSet = new Set<string>();
  
  for (const item of data) {
    const value = String(item[fieldName]);
    if (value) {
      uniqueSet.add(value);
    }
  }
  
  return Array.from(uniqueSet).sort();
}
