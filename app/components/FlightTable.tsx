'use client'

import React, { useState } from 'react';
import { Table, Empty, Card, Typography } from 'antd';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import AdvancedSearch from './AdvancedSearch';
import { TablePaginationConfig } from 'antd/es/table';

const { Title } = Typography;

const columns = [
  { title: 'Booking ID', dataIndex: 'booking_id', key: 'booking_id', width: 100 },
  { title: 'Flight ID', dataIndex: 'flight_id', key: 'flight_id', width: 100 },
  { title: 'Flight Number', dataIndex: 'flight_number', key: 'flight_number', width: 120 },
  { title: 'Airline Name', dataIndex: 'airline_name', key: 'airline_name', width: 150 },
  { title: 'Departure Airport', dataIndex: 'departure_airport', key: 'departure_airport', width: 150 },
  { title: 'Arrival Airport', dataIndex: 'arrival_airport', key: 'arrival_airport', width: 150 },
  { title: 'Departure Time', dataIndex: 'departure_time', key: 'departure_time', width: 150 },
  { title: 'Arrival Time', dataIndex: 'arrival_time', key: 'arrival_time', width: 150 },
  { title: 'Passenger ID', dataIndex: 'passenger_id', key: 'passenger_id', width: 120 },
  { title: 'First Name', dataIndex: 'passenger_first_name', key: 'passenger_first_name', width: 120 },
  { title: 'Last Name', dataIndex: 'passenger_last_name', key: 'passenger_last_name', width: 120 },
  { title: 'Email', dataIndex: 'passenger_email', key: 'passenger_email', width: 200 },
  { title: 'Phone', dataIndex: 'passenger_phone', key: 'passenger_phone', width: 150 },
  { title: 'Booking Date', dataIndex: 'booking_date', key: 'booking_date', width: 150 },
  { title: 'Total Price', dataIndex: 'total_price', key: 'total_price', width: 120 },
  { title: 'Payment Status', dataIndex: 'payment_status', key: 'payment_status', width: 120 },
  { title: 'Baggage Weight', dataIndex: 'baggage_weight', key: 'baggage_weight', width: 120 },
  { title: 'Baggage Type', dataIndex: 'baggage_type', key: 'baggage_type', width: 120 },
  { title: 'Booking Status', dataIndex: 'booking_status', key: 'booking_status', width: 120 },
  { title: 'Airline Code', dataIndex: 'airline_code', key: 'airline_code', width: 120 },
  { title: 'Duration', dataIndex: 'duration', key: 'duration', width: 100 },
  { title: 'Country', dataIndex: 'country', key: 'country', width: 120 },
  { title: 'City', dataIndex: 'city', key: 'city', width: 120 },
];

export default function FlightTable() {
  const { flights, filteredFlights } = useSelector((state: RootState) => state.flight);
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
  });

  const handleTableChange = (newPagination: TablePaginationConfig) => {
    setPagination({
      current: newPagination.current,
      pageSize: newPagination.pageSize,
    });
  };

  const renderEmptyState = () => {
    if (flights.length === 0) {
      return <Empty description="No flight data available. Please upload a file." />;
    } else if (filteredFlights.length === 0) {
      return <Empty description="No results found for your search. Please try different search parsmeters." />;
    }
    return null;
  };

  return (
    <div className="w-full overflow-hidden">
      <Title level={2} className="mb-4 text-center">Flight Information</Title>
      <Card className="mb-4 shadow-md">
        <AdvancedSearch />
      </Card>
      {renderEmptyState() || (
        <Card className="shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <Table
              columns={columns}
              dataSource={filteredFlights}
              rowKey="booking_id"
              pagination={{
                ...pagination,
                total: filteredFlights.length,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
              }}
              onChange={handleTableChange}
              scroll={{ x: 'max-content' }}
              className="min-w-full"
            />
          </div>
        </Card>
      )}
    </div>
  );
}