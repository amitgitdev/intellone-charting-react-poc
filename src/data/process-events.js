import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the eventlist.json file
const eventlistPath = path.join(__dirname, 'eventlist.json');
const rawData = fs.readFileSync(eventlistPath, 'utf8');
let eventlist;

try {
    eventlist = JSON.parse(rawData);
} catch (error) {
    console.error('Error parsing JSON:', error.message);
    console.log('Attempting to extract event record names using regex...');
    
    // Try to extract just the data we need using regex
    const eventMatches = rawData.matchAll(/"eventRecordName"\s*:\s*"([^"]+)"/g);
    const events = Array.from(eventMatches, match => ({ eventRecordName: match[1] }));
    eventlist = { data: events };
    console.log(`Extracted ${events.length} event records using regex`);
}

// Count events by eventRecordName
const eventCounts = {};
let totalEvents = 0;

// Process each event in the data array
eventlist.data.forEach(event => {
    const recordName = event.eventRecordName;
    if (eventCounts[recordName]) {
        eventCounts[recordName]++;
    } else {
        eventCounts[recordName] = 1;
    }
    totalEvents++;
});

// Create the summary array
const eventRecordSummary = Object.keys(eventCounts).map(recordName => ({
    eventRecordName: recordName,
    eventCount: eventCounts[recordName],
    totalNumberOfEvents: totalEvents
}));

// Write to eventrecord.json
const outputPath = path.join(__dirname, 'eventrecord.json');
fs.writeFileSync(outputPath, JSON.stringify(eventRecordSummary, null, 2));

console.log('Event record summary created successfully!');
console.log('Summary:');
eventRecordSummary.forEach(record => {
    console.log(`${record.eventRecordName}: ${record.eventCount} events`);
});
console.log(`Total events: ${totalEvents}`);