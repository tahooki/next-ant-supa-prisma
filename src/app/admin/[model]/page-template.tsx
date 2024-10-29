"use client";

import { metaFields } from "@/models/metafields";
import { Button, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useRouter } from 'next/navigation';

const AdminModelPageTemplate = ({model, items, totalCount}: {model: string, items: any[], totalCount: number}) => {
  const router = useRouter();
  const fields = metaFields[model as keyof typeof metaFields];

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

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between' }}>
        <h2>{model} 모델 데이터</h2>
        <Button type="primary" onClick={() => router.push(`/admin/${model}/new`)}>
          새로 만들기
        </Button>
      </div>
      <Table columns={columns} dataSource={items} rowKey="id" />
    </div>
  );
}

export default AdminModelPageTemplate;
