"use client";

import { ModelFilter } from '@/components/ModelFilter';
import { metaFields } from "@/models/metafields";
import { Button, Input, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useRouter, useSearchParams } from 'next/navigation';

const AdminModelPageTemplate = ({model, items, totalCount}: {model: string, items: any[], totalCount: number}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fields = metaFields[model as keyof typeof metaFields];

  const handleSearch = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (value) {
      params.set('keyword', value);
    } else {
      params.delete('keyword');
    }
    
    router.push(`/admin/${model}?${params.toString()}`);
  };

  const columns: ColumnsType<any> = [
    ...(fields?.map(field => ({
      title: field.name,
      dataIndex: field.name,
      key: field.name,
    })) || []),
    {
      title: '작업',
      key: 'action',
      render: (_, record) => (
        <Button onClick={() => router.push(`/admin/${model}/${record.id}`)}>
          상세
        </Button>
      ),
    },
  ];
`~~`
  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>{model} 모델 데이터</h2>
        <div style={{ display: 'flex', gap: '8px' }}>
          <ModelFilter model={model} />
          <Input.Search
            placeholder="검색어를 입력하세요"
            allowClear
            onSearch={handleSearch}
            defaultValue={searchParams.get('keyword') || ''}
            style={{ width: 300 }}
          />
          <Button type="primary" onClick={() => router.push(`/admin/${model}/new`)}>
            새로 만들기
          </Button>
        </div>
      </div>
      <Table columns={columns} dataSource={items} rowKey="id" />
    </div>
  );
}

export default AdminModelPageTemplate;
