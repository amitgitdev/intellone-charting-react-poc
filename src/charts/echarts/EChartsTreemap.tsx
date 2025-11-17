import ReactECharts from 'echarts-for-react';
import { useMemo } from 'react';
import eventList from '../../data/eventlist.json';
import { eventTypeColors } from '../../utils/chartConstants';

interface EventItem {
  id: number;
  eventRecordName: string;
  orgStructurePath: string;
}

const data = eventList.data as EventItem[];

export function EChartsTreemap() {
  const option = useMemo(() => {
    // Build hierarchical structure: Organization → Event Type
    const orgEventCounts: Record<string, Record<string, number>> = {};

    data.forEach(item => {
      const org = item.orgStructurePath || 'Unknown';
      const eventType = item.eventRecordName || 'Other';

      if (!orgEventCounts[org]) orgEventCounts[org] = {};
      orgEventCounts[org][eventType] = (orgEventCounts[org][eventType] || 0) + 1;
    });

    // Convert to ECharts treemap format with hierarchical structure
    const treemapChildren = Object.entries(orgEventCounts).map(([org, eventTypes]) => {
      const orgTotal = Object.values(eventTypes).reduce((sum, count) => sum + count, 0);
      
      return {
        name: org,
        value: orgTotal,
        children: Object.entries(eventTypes).map(([eventType, count]) => ({
          name: eventType,
          value: count,
          itemStyle: {
            color: eventTypeColors[eventType] || eventTypeColors.Other
          }
        }))
      };
    });

    return {
      title: {
        text: 'Event Distribution: Organization & Type Hierarchy',
        subtext: 'Rectangle size represents event count',
        left: 'center',
        textStyle: {
          fontSize: 18,
          fontWeight: 600
        }
      },
      tooltip: {
        formatter: (params: { name: string; value: number; treePathInfo?: { name: string }[] }) => {
          if (params.treePathInfo && params.treePathInfo.length > 2) {
            // Leaf node (event type)
            const org = params.treePathInfo[1].name;
            return `<b>${params.name}</b><br/>Organization: ${org}<br/>Events: <b>${params.value}</b>`;
          } else {
            // Parent node (organization)
            return `<b>${params.name}</b><br/>Total events: <b>${params.value}</b>`;
          }
        }
      },
      toolbox: {
        feature: {
          saveAsImage: { 
            title: 'Save as Image',
            pixelRatio: 2
          }
        },
        right: 20,
        top: 10
      },
      series: [
        {
          name: 'Events',
          type: 'treemap',
          width: '95%',
          height: '85%',
          top: '10%',
          roam: false,
          nodeClick: 'link',
          breadcrumb: {
            show: true,
            height: 30,
            bottom: 5,
            itemStyle: {
              color: '#5470c6',
              textStyle: {
                color: '#fff'
              }
            },
            emphasis: {
              itemStyle: {
                color: '#4060d0'
              }
            }
          },
          label: {
            show: true,
            formatter: (params: { name: string; value: number }) => {
              // Show label only if there's enough space
              if (params.value > 3) {
                return params.name;
              }
              return '';
            },
            fontSize: 11,
            color: '#fff',
            overflow: 'truncate',
            ellipsis: '...'
          },
          upperLabel: {
            show: true,
            height: 30,
            fontSize: 14,
            fontWeight: 'bold',
            color: '#333'
          },
          itemStyle: {
            borderColor: '#fff',
            borderWidth: 2,
            gapWidth: 2
          },
          emphasis: {
            label: {
              fontSize: 13,
              fontWeight: 'bold'
            },
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            },
            upperLabel: {
              fontSize: 16,
              fontWeight: 'bold'
            }
          },
          levels: [
            {
              // Root level
              itemStyle: {
                borderWidth: 0,
                gapWidth: 5
              },
              upperLabel: {
                show: false
              }
            },
            {
              // Organization level (level 1)
              itemStyle: {
                borderColor: '#555',
                borderWidth: 3,
                gapWidth: 3
              },
              emphasis: {
                itemStyle: {
                  borderColor: '#333'
                }
              }
            },
            {
              // Event type level (level 2)
              colorSaturation: [0.35, 0.5],
              itemStyle: {
                borderWidth: 2,
                gapWidth: 2,
                borderColorSaturation: 0.6
              }
            }
          ],
          data: treemapChildren
        }
      ]
    };
  }, []);

  // Calculate org count outside useMemo for use in JSX
  const orgEventCounts: Record<string, Record<string, number>> = {};
  data.forEach(item => {
    const org = item.orgStructurePath || 'Unknown';
    const eventType = item.eventRecordName || 'Other';
    if (!orgEventCounts[org]) orgEventCounts[org] = {};
    orgEventCounts[org][eventType] = (orgEventCounts[org][eventType] || 0) + 1;
  });

  return (
    <div>
      <ReactECharts 
        option={option} 
        style={{ height: 600, width: '100%' }}
        opts={{ renderer: 'canvas' }}
      />
      
      <div
        style={{
          marginTop: 24,
          padding: 15,
          background: '#f5f5f5',
          borderRadius: 4
        }}
      >
        <h4 style={{ margin: '0 0 10px 0', color: '#666' }}>Summary</h4>
        <p style={{ margin: 0, fontSize: 14, color: '#666' }}>
          Total events: {data.length} | 
          Organizations: {Object.keys(orgEventCounts).length} | 
          Hierarchical view showing event distribution across organizational structure
        </p>
      </div>
    </div>
  );
}
