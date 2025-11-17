import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import 'highcharts/modules/drilldown';
import 'highcharts/modules/exporting';
import 'highcharts/modules/export-data';
import 'highcharts/modules/offline-exporting';
import { useMemo } from 'react';
import eventList from '../../data/eventlist.json';
import { drillLevelColors } from '../../utils/chartConstants';

interface EventItem {
  id: number;
  eventRecordName: string;
  statusName: string;
  title: string;
  eventDate: string;
  eventManagerFullName: string;
}

const data = eventList.data as EventItem[];

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function HighchartsDateHierarchy() {
  const chartOptions = useMemo(() => {
    // Level 1: Year counts
    const yearCounts: Record<string, number> = {};
    const yearToMonths: Record<string, Record<string, number>> = {};
    const monthToDays: Record<string, Record<string, number>> = {};

    data.forEach(item => {
      if (!item.eventDate) return;

      const date = new Date(item.eventDate);
      const year = date.getFullYear().toString();
      const monthNum = date.getMonth();
      const monthKey = `${year}-${String(monthNum).padStart(2, '0')}`;
      const day = date.getDate();
      const dayKey = `${monthKey}-${String(day).padStart(2, '0')}`;

      // Year level
      yearCounts[year] = (yearCounts[year] || 0) + 1;

      // Month level
      if (!yearToMonths[year]) yearToMonths[year] = {};
      yearToMonths[year][monthKey] = (yearToMonths[year][monthKey] || 0) + 1;

      // Day level
      if (!monthToDays[monthKey]) monthToDays[monthKey] = {};
      monthToDays[monthKey][dayKey] = (monthToDays[monthKey][dayKey] || 0) + 1;
    });

    // Prepare main series data (years)
    const mainSeriesData = Object.entries(yearCounts)
      .sort((a, b) => Number(a[0]) - Number(b[0]))
      .map(([year, count]) => ({
        name: year,
        y: count,
        drilldown: `year-${year}`,
        color: drillLevelColors.year
      }));

    // Prepare drill-down series for months
    const monthDrilldownSeries: Highcharts.SeriesDrilldownOptions[] = [];
    Object.entries(yearToMonths).forEach(([year, months]) => {
      const monthData = Object.entries(months)
        .sort((a, b) => {
          const aMonth = Number(a[0].split('-')[1]);
          const bMonth = Number(b[0].split('-')[1]);
          return aMonth - bMonth;
        })
        .map(([monthKey, count]) => {
          const monthNum = Number(monthKey.split('-')[1]);
          return {
            name: `${monthNames[monthNum]} ${year}`,
            y: count,
            drilldown: `month-${monthKey}`,
            color: drillLevelColors.month
          };
        });

      monthDrilldownSeries.push({
        type: 'column',
        name: `${year} - Months`,
        id: `year-${year}`,
        data: monthData
      });
    });

    // Prepare drill-down series for days
    const dayDrilldownSeries: Highcharts.SeriesDrilldownOptions[] = [];
    Object.entries(monthToDays).forEach(([monthKey, days]) => {
      const [year, monthStr] = monthKey.split('-');
      const monthNum = Number(monthStr);
      const monthName = monthNames[monthNum];

      const dayData = Object.entries(days)
        .sort((a, b) => {
          const aDay = Number(a[0].split('-')[2]);
          const bDay = Number(b[0].split('-')[2]);
          return aDay - bDay;
        })
        .map(([dayKey, count]) => {
          const day = Number(dayKey.split('-')[2]);
          return {
            name: `${monthName} ${day}, ${year}`,
            y: count,
            color: drillLevelColors.day
          };
        });

      dayDrilldownSeries.push({
        type: 'column',
        name: `${monthName} ${year} - Days`,
        id: `month-${monthKey}`,
        data: dayData
      });
    });

    const allDrilldownSeries = [...monthDrilldownSeries, ...dayDrilldownSeries];

    return {
      chart: {
        type: 'column',
        height: 500,
        backgroundColor: 'white'
      },
      title: {
        text: 'Events by Date Hierarchy',
        style: {
          fontSize: '18px',
          fontWeight: '600'
        }
      },
      subtitle: {
        text: 'Click on columns to drill down: Year → Month → Day'
      },
      xAxis: {
        type: 'category',
        title: {
          text: 'Time Period'
        }
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Event Count'
        },
        allowDecimals: false
      },
      legend: {
        enabled: false
      },
      plotOptions: {
        column: {
          cursor: 'pointer',
          dataLabels: {
            enabled: false
          }
        }
      },
      tooltip: {
        headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
        pointFormat: '<b>{point.name}</b>: {point.y} events'
      },
      series: [{
        name: 'Years',
        colorByPoint: false,
        data: mainSeriesData
      }],
      drilldown: {
        breadcrumbs: {
          position: {
            align: 'right'
          },
          showFullPath: true,
          format: '{level.name}'
        },
        series: allDrilldownSeries
      },
      credits: {
        enabled: false
      },
      exporting: {
        enabled: true,
        buttons: {
          contextButton: {
            menuItems: ['downloadPNG', 'downloadJPEG', 'downloadPDF', 'downloadSVG', 'separator', 'downloadCSV', 'downloadXLS']
          }
        }
      }
    } as Highcharts.Options;
  }, []);

  return (
    <div>
      <HighchartsReact
        highcharts={Highcharts}
        options={chartOptions}
      />
      <div
        style={{
          marginTop: 24,
          padding: 15,
          background: '#f5f5f5',
          borderRadius: 4
        }}
      >
        <h4 style={{ margin: '0 0 10px 0', color: '#666' }}>About This Chart</h4>
        <p style={{ margin: 0, fontSize: 14, color: '#666' }}>
          This 3-level drill-down chart shows event distribution over time. Start by viewing 
          events by year, then click to drill down to months, and finally to individual days. 
          Use the breadcrumb navigation to move back up the hierarchy.
        </p>
      </div>
    </div>
  );
}
