"use client";

import React, { useState, useEffect } from 'react';
import { Table, Empty, Card, Typography, Button } from 'antd';
import { DownOutlined, RightOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import AdvancedSearch from './AdvancedSearch';
import { TablePaginationConfig } from 'antd/es/table';
import { ColumnsType } from 'antd/es/table';
import { FlightData } from '../types/FlightData';

const { Title, Text } = Typography;

const ExpandedRow: React.FC<{ record: FlightData }> = ({ record }) => (
  <Card className="bg-gray-50">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Object.entries(record).map(([key, value]) => (
        <div key={key}>
          <Text strong>{key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:</Text> {value}
        </div>
      ))}
    </div>
  </Card>
);

export default function FlightTable() {
  const { flights, filteredFlights } = useSelector((state: RootState) => state.flight);
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
  });
  const [columns, setColumns] = useState<ColumnsType<FlightData>>([]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setColumns(getMobileColumns());
      } else if (window.innerWidth < 1024) {
        setColumns(getTabletColumns());
      } else {
        setColumns(getDesktopColumns());
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getMobileColumns = (): ColumnsType<FlightData> => [
    {
      title: 'Flight',
      dataIndex: 'flight_number',
      key: 'flight_number',
    },
    {
      title: 'Passenger',
      key: 'passenger',
      render: (_, record) => `${record.passenger_first_name} ${record.passenger_last_name}`,
    },
  ];

  const getTabletColumns = (): ColumnsType<FlightData> => [
    ...getMobileColumns(),
    {
      title: 'Route',
      key: 'route',
      render: (_, record) => `${record.departure_airport} → ${record.arrival_airport}`,
    },
    {
      title: 'Status',
      dataIndex: 'booking_status',
      key: 'booking_status',
    },
  ];

  const getDesktopColumns = (): ColumnsType<FlightData> => [
    ...getTabletColumns(),
    {
      title: 'Departure',
      dataIndex: 'departure_time',
      key: 'departure_time',
    },
    {
      title: 'Arrival',
      dataIndex: 'arrival_time',
      key: 'arrival_time',
    },
  ];

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
    <div className="w-full">
      <Title level={2} className="mb-4 text-center">Flights Information</Title>
      <Card className="mb-4 shadow-md">
        <AdvancedSearch />
      </Card>
      {renderEmptyState() || (
        <Card className="shadow-md">
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
            expandable={{
              expandedRowRender: (record) => <ExpandedRow record={record} />,
              expandIcon: ({ expanded, onExpand, record }) => 
                expanded ? (
                  <Button onClick={e => onExpand(record, e)} icon={<DownOutlined />} size="small" />
                ) : (
                  <Button onClick={e => onExpand(record, e)} icon={<RightOutlined />} size="small" />
                ),
            }}
            className="responsive-table"
          />
        </Card>
      )}
    </div>
  );
}