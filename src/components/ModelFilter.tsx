'use client';

import { metaFields } from '@/models/metafields';
import { Card, DatePicker, Form, InputNumber, Select, Space } from 'antd';
import dayjs from 'dayjs';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const { RangePicker } = DatePicker;

interface ModelFilterProps {
  model: string;
}

export function ModelFilter({ model }: ModelFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [fields, setFields] = useState<any[]>([]);
  const [form] = Form.useForm();

  useEffect(() => {
    const modelFields = metaFields[model.toLowerCase() as keyof typeof metaFields] || [];
    setFields(modelFields);
  }, [model]);

  const handleFilterChange = (fieldName: string, value: any) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (value === null || value === undefined || value === '') {
      // Remove parameters if value is empty
      params.delete(`${fieldName}_gte`);
      params.delete(`${fieldName}_lte`);
      params.delete(`${fieldName}_start`);
      params.delete(`${fieldName}_end`);
      params.delete(fieldName);
    } else if (Array.isArray(value)) {
      // Handle range values (for dates and numbers)
      if (fieldName.endsWith('At')) {
        params.set(`${fieldName}_start`, value[0]);
        params.set(`${fieldName}_end`, value[1]);
      } else {
        if (value[0]) params.set(`${fieldName}_gte`, value[0].toString());
        if (value[1]) params.set(`${fieldName}_lte`, value[1].toString());
      }
    } else {
      // Handle single values
      params.set(fieldName, value.toString());
    }
    
    router.push(`/admin/${model}?${params.toString()}`);
  };

  const renderFilterInput = (field: any) => {
    const { name, type } = field;

    switch (type) {
      case 'boolean':
        return (
          <Form.Item key={name} label={name} name={name}>
            <Select
              allowClear
              placeholder="Select"
              onChange={(value) => handleFilterChange(name, value)}
              options={[
                { value: 'true', label: 'Yes' },
                { value: 'false', label: 'No' }
              ]}
              defaultValue={searchParams.get(name) || undefined}
            />
          </Form.Item>
        );

      case 'number':
        return (
          <Form.Item label={name} name={name}>
            <Space>
              <InputNumber
                placeholder="Min"
                onChange={(value) => {
                  const lteValue = searchParams.get(`${name}_lte`);
                  handleFilterChange(name, [value, lteValue]);
                }}
                defaultValue={searchParams.get(`${name}_gte`) || undefined}
              />
              <InputNumber
                placeholder="Max"
                onChange={(value) => {
                  const gteValue = searchParams.get(`${name}_gte`);
                  handleFilterChange(name, [gteValue, value]);
                }}
                defaultValue={searchParams.get(`${name}_lte`) || undefined}
              />
            </Space>
          </Form.Item>
        );

      case 'date':
      case 'datetime':
        if (name.endsWith('At')) {
          return (
            <Form.Item label={name} name={name}>
              <RangePicker
                onChange={(dates) => {
                  if (!dates) {
                    handleFilterChange(name, null);
                    return;
                  }
                  handleFilterChange(name, [
                    dates[0]?.toISOString(),
                    dates[1]?.toISOString()
                  ]);
                }}
                defaultValue={[
                  searchParams.get(`${name}_start`) ? dayjs(searchParams.get(`${name}_start`)) : null,
                  searchParams.get(`${name}_end`) ? dayjs(searchParams.get(`${name}_end`)) : null
                ]}
              />
            </Form.Item>
          );
        }
        return null;

      default:
        return null;
    }
  };

  return (
    <Card title="Filters" size="small">
      <Form
        form={form}
        layout="vertical"
      >
        {fields
          .filter(field => 
            field.type !== 'string' && 
            field.kind !== 'object' &&
            field.name !== 'updatedAt'
          )
          .map(field => renderFilterInput(field))}
      </Form>
    </Card>
  );
} 