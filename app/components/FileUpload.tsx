'use client'

import { useState } from 'react';
import { Upload, message, UploadFile } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { setFlights } from '../redux/flightSlice';
import { FlightData } from '../types/FlightData';
import { CSVRow } from '../types/FlightData';

const { Dragger } = Upload;

function isValidFlightData(obj: unknown): obj is FlightData {
  if (typeof obj !== 'object' || obj === null) {
    return false;
  }

  const requiredFields: (keyof FlightData)[] = [
    'booking_id', 'flight_id', 'flight_number', 'airline_name', 'departure_airport',
    'arrival_airport', 'departure_time', 'arrival_time', 'passenger_id',
    'passenger_first_name', 'passenger_last_name', 'passenger_email',
    'passenger_phone', 'booking_date', 'total_price', 'payment_status',
    'baggage_weight', 'baggage_type', 'booking_status', 'airline_code',
    'duration', 'country', 'city'
  ];

  return requiredFields.every(field => field in obj);
}

export default function FileUpload() {
  const dispatch = useDispatch();
  const [fileList, setFileList] = useState<FlightData[]>([]);

  const props = {
    name: 'file',
    multiple: false,
    accept: '.json,.csv',
    showUploadList: false,
    fileList: fileList.map((_, index) => ({
      uid: index.toString(),
      name: `Flight Data ${index + 1}`,
      status: 'done',
    } as UploadFile)),
    beforeUpload: (file: File) => {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        try {
          let data: unknown;
          if (file.name.endsWith('.json')) {
            data = JSON.parse(e.target?.result as string);
            // console.log(data);
          } else if (file.name.endsWith('.csv')) {
            data = parseCSV(e.target?.result as string);
            // console.log(data);
          } else {
            throw new Error('Unsupported file type');
          }

          if (!Array.isArray(data) || !data.every(isValidFlightData)) {
            throw new Error('Invalid data format');
          }

          setFileList(data);
          dispatch(setFlights(data));
          message.success(`${file.name} file uploaded and processed successfully`);
        } catch (error) {
          message.error(`${file.name} file upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      };
      reader.readAsText(file);
      return false;
    },
    onRemove: () => {
      setFileList([]);
      dispatch(setFlights([]));
    },
  };

  return (
    <Dragger {...props}>
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">Click or drag & drop a file to this area to upload</p>
      <p className="ant-upload-hint">
        Upload a JSON or CSV file containing flight data with all the necessary fields.
      </p>
    </Dragger>
  );
}


function parseCSV(csv: string): CSVRow[] {
  const lines: string[] = csv.split('\n');
  const headers: string[] = lines[0].split(',').map(header => header.trim());
  const result: CSVRow[] = [];

  for (let i: number = 1; i < lines.length; i++) {
    const values: string[] = lines[i].split(',');
    const obj: CSVRow = {};
    for (let j: number = 0; j < headers.length; j++) {
      obj[headers[j]] = values[j] ? values[j].trim() : '';
      // console.log(obj[headers[j]]);
    }
    result.push(obj);
  }

  return result;
}