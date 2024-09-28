'use client'

import React, { useState, useEffect, useCallback } from 'react';
import { Select, Input, Switch, Space, Button, Typography, Row, Col } from 'antd';
import { PlusOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store';
import { setIsAdvancedSearch, performSearch } from '../redux/flightSlice';
import { FlightData } from '../types/FlightData';
import debounce from 'lodash/debounce';

const { Option } = Select;
const { Text } = Typography;

const searchFields = [
  { value: 'booking_id', label: 'Booking ID' },
  { value: 'flight_number', label: 'Flight Number' },
  { value: 'airline_name', label: 'Airline Name' },
  { value: 'departure_airport', label: 'Departure Airport' },
  { value: 'arrival_airport', label: 'Arrival Airport' },
  { value: 'passenger_first_name', label: 'Passenger First Name' },
  { value: 'passenger_last_name', label: 'Passenger Last Name' },
  { value: 'passenger_email', label: 'Passenger Email' },
  { value: 'booking_status', label: 'Booking Status' },
  { value: 'city', label: 'City' },
  { value: 'country', label: 'Country' },
];

interface SearchCriteria {
  field: keyof FlightData;
  value: string;
}

export default function AdvancedSearch() {
  const dispatch = useDispatch();
  const { isAdvancedSearch } = useSelector((state: RootState) => state.flight);
  const [searchCriteria, setSearchCriteria] = useState<SearchCriteria[]>([{ field: 'booking_id', value: '' }]);
  const [simpleSearchTerm, setSimpleSearchTerm] = useState('');

  const debouncedSearch = useCallback(
    debounce((criteria: SearchCriteria[], isAdvanced: boolean, simpleTerm: string) => {
      dispatch(performSearch({ criteria, isAdvanced, simpleTerm }));
    }, 300),
    []
  );

  useEffect(() => {
    // console.log("reached 2");
    debouncedSearch(searchCriteria, isAdvancedSearch, simpleSearchTerm);
  }, [searchCriteria, isAdvancedSearch, simpleSearchTerm, debouncedSearch]);

  const handleToggleAdvanced = (checked: boolean) => {
    dispatch(setIsAdvancedSearch(checked));
    if (!checked) {
      setSearchCriteria([{ field: 'booking_id', value: '' }]);
    }
  };

  const handleAddCriteria = () => {
    setSearchCriteria([...searchCriteria, { field: 'booking_id', value: '' }]);
  };

  const handleRemoveCriteria = (index: number) => {
    const newCriteria = searchCriteria.filter((_, i) => i !== index);
    setSearchCriteria(newCriteria.length ? newCriteria : [{ field: 'booking_id', value: '' }]);
  };

  const handleCriteriaChange = (index: number, field: keyof SearchCriteria, value: string) => {
    const newCriteria = [...searchCriteria];
    newCriteria[index] = { ...newCriteria[index], [field]: value };
    setSearchCriteria(newCriteria);
  };

  const handleSearch = () => {
    dispatch(performSearch({ criteria: searchCriteria, isAdvanced: isAdvancedSearch, simpleTerm: simpleSearchTerm }));
  };

  return (
    <Space direction="vertical" size="middle" style={{ display: 'flex' }} className="w-full">
      <Row align="middle" justify="space-between" gutter={[16, 16]}>
        <Col>
          <Space>
            <Switch
              checked={isAdvancedSearch}
              onChange={handleToggleAdvanced}
              checkedChildren="Advanced"
              unCheckedChildren="Simple"
            />
            <Text strong style={{ color: 'black' }}>
              {isAdvancedSearch ? 'Field Search' : 'Full Text Search'}
            </Text>
          </Space>
        </Col>
        <Col>
          <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
            Search
          </Button>
        </Col>
      </Row>
      {isAdvancedSearch ? (
        <>
          {searchCriteria.map((criteria, index) => (
            <Row key={index} gutter={[16, 16]} align="middle">
              <Col xs={24} sm={10}>
                <Select
                  style={{ width: '100%' }}
                  value={criteria.field}
                  onChange={(value) => handleCriteriaChange(index, 'field', value)}
                >
                  {searchFields.map(field => (
                    <Option key={field.value} value={field.value}>{field.label}</Option>
                  ))}
                </Select>
              </Col>
              <Col xs={20} sm={12}>
                <Input
                  placeholder="Enter search term"
                  value={criteria.value}
                  onChange={(e) => handleCriteriaChange(index, 'value', e.target.value)}
                  style={{ width: '100%' }}
                />
              </Col>
              <Col xs={4} sm={2}>
                <Button
                  type="text"
                  icon={<DeleteOutlined />}
                  onClick={() => handleRemoveCriteria(index)}
                  disabled={searchCriteria.length === 1}
                />
              </Col>
            </Row>
          ))}
          <Button type="dashed" onClick={handleAddCriteria} block icon={<PlusOutlined />}>
            Add Field
          </Button>
        </>
      ) : (
        <Input
          placeholder="Search all fields"
          value={simpleSearchTerm}
          onChange={(e) => setSimpleSearchTerm(e.target.value)}
          style={{ width: '100%' }}
        />
      )}
    </Space>
  );
}