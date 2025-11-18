import { useState, useEffect } from 'react';
import {
  Grid,
  GridColumn as Column,
  GridToolbar
} from '@progress/kendo-react-grid';
import { ExcelExport } from '@progress/kendo-react-excel-export';
import { process, type State } from '@progress/kendo-data-query';
import '@progress/kendo-theme-default/dist/all.css';
import eventListData from '../data/eventlist.json';

interface EventData {
  id: number;
  title: string;
  description: string;
  eventRecordName: string;
  eventDate: string;
  eventDateFormatted: string;
  eventManagerFullName: string;
  dateReported: string;
  dateReportedFormatted: string;
  orgStructurePath: string;
  isHighPotential: boolean;
  isHighPotentialText: string;
  isNotifiable: boolean;
  isNotifiableText: string;
  statusName: string;
}

interface DataResult {
  data: EventData[];
  total: number;
}

interface JsonResponse {
  data: Array<{
    id: number;
    title: string;
    description?: string;
    eventRecordName: string;
    eventDate: string;
    eventManagerFullName: string;
    dateReported: string;
    orgStructurePath: string;
    isHighPotential: boolean;
    isNotifiable: boolean;
    statusName: string;
  }>;
}

// Date formatter for mm/dd/yy format
const formatDate = (dateString: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const year = String(date.getFullYear()).slice(-2);
  return `${month}/${day}/${year}`;
};

export function GridDemoPlaceholder() {
  const [data, setData] = useState<EventData[]>([]);
  const [dataState, setDataState] = useState<State>({
    skip: 0,
    take: 20,
    filter: undefined,
    sort: undefined
  });
  const [result, setResult] = useState<DataResult>({ data: [], total: 0 });
  let _export: ExcelExport | null = null;

  // Load data from JSON
  useEffect(() => {
    const jsonData = eventListData as JsonResponse;
    const events = jsonData.data.map((item) => ({
      id: item.id,
      title: item.title,
      description: item.description?.replace(/<[^>]*>/g, '').substring(0, 100) || '', // Strip HTML tags
      eventRecordName: item.eventRecordName,
      eventDate: item.eventDate,
      eventDateFormatted: formatDate(item.eventDate),
      eventManagerFullName: item.eventManagerFullName,
      dateReported: item.dateReported,
      dateReportedFormatted: formatDate(item.dateReported),
      orgStructurePath: item.orgStructurePath,
      isHighPotential: item.isHighPotential,
      isHighPotentialText: item.isHighPotential ? 'Yes' : 'No',
      isNotifiable: item.isNotifiable,
      isNotifiableText: item.isNotifiable ? 'Yes' : 'No',
      statusName: item.statusName
    }));
    setData(events);
  }, []);

  // Process data with filters, sorting, and paging
  useEffect(() => {
    if (data.length > 0) {
      setResult(process(data, dataState) as DataResult);
    }
  }, [data, dataState]);

  const handleDataStateChange = (event: { dataState: State }) => {
    setDataState(event.dataState);
  };

  const exportToExcel = () => {
    if (_export) {
      _export.save();
    }
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1600px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ margin: '0 0 8px 0', fontSize: '24px', color: '#111' }}>
          📋 Event List Grid
        </h2>
        <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
          Showing {result.total} events with filtering, paging, and Excel export
        </p>
      </div>

      <ExcelExport
        data={data}
        fileName="EventList.xlsx"
        ref={(exporter) => { _export = exporter; }}
      >
        <Grid
          style={{ height: '600px' }}
          data={result}
          {...dataState}
          onDataStateChange={handleDataStateChange}
          pageable={{
            buttonCount: 5,
            info: true,
            type: 'numeric',
            pageSizes: [10, 20, 50, 100],
            previousNext: true
          }}
          sortable={true}
          filterable={true}
          resizable={true}
        >
          <GridToolbar>
            <button
              title="Export to Excel"
              className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-primary"
              onClick={exportToExcel}
              style={{ marginRight: '8px' }}
            >
              📊 Export to Excel
            </button>
            <span style={{ marginLeft: '16px', color: '#666', fontSize: '14px' }}>
              Total Records: {result.total}
            </span>
          </GridToolbar>

          <Column field="id" title="ID" 
          width="150px" filterable={true} />
          
          <Column 
            field="title" 
            title="Title" 
            width="200px" 
            filterable={true} 
          />
          
          <Column 
            field="description" 
            title="Description" 
            width="250px" 
            filterable={true} 
          />
          
          <Column 
            field="eventRecordName" 
            title="Event Record Name" 
            width="180px" 
            filterable={true} 
          />
          
          <Column 
            field="eventDateFormatted" 
            title="Event Date" 
            width="130px" 
            filterable={true}
          />
          
          <Column 
            field="eventManagerFullName" 
            title="Event Manager Full Name" 
            width="220px" 
            filterable={true} 
          />
          
          <Column 
            field="dateReportedFormatted" 
            title="Date Reported" 
            width="130px" 
            filterable={true}
          />
          
          <Column 
            field="orgStructurePath" 
            title="Org Structure Path" 
            width="200px" 
            filterable={true} 
          />
          
          <Column 
            field="isHighPotentialText" 
            title="High Potential" 
            width="150px"
            filterable={true}
          />
          
          <Column 
            field="isNotifiableText" 
            title="Is Notifiable" 
            width="140px"
            filterable={true}
          />
          
          <Column 
            field="statusName" 
            title="Origin Status Name" 
            width="180px" 
            filterable={true} 
          />
        </Grid>
      </ExcelExport>
    </div>
  );
}
