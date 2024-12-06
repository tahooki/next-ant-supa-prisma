"use client";

import { metaFields } from "@/models/metafields";
import { getModelInstance } from "@/utils/model-helper";
import { Button, Form, Input, Select, Switch, message } from 'antd';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const { TextArea } = Input;

// 긴 텍스트가 필요한 필드명들
const LONG_TEXT_FIELDS = ['content', 'description', 'bio'];

// Select 컴포넌트가 필요한 필드 타입들
const SELECT_FIELDS = ['status', 'role', 'category'];

const DetailPageTemplate = ({
  model,
  initialData,
  isNew
}: {
  model: string;
  initialData: any;
  isNew: boolean;
}) => {
  const [form] = Form.useForm();
  const router = useRouter();
  const fields: any = metaFields[model as keyof typeof metaFields];

  useEffect(() => {
    if (initialData) {
      console.log('initialData', initialData)
      // form.setFieldsValue(initialData);
    }
  }, [initialData, form]);

  const onFinish = async (values: any) => {
    try {
      const modelInstance = getModelInstance(model);
      Object.assign(modelInstance, values);

      if (isNew) {
        await modelInstance.create();
        message.success('생성되었습니다.');
      } else {
        await modelInstance.update(initialData.id);
        message.success('수정되었습니다.');
      }
      
      router.push(`/admin/${model}`);
    } catch (error) {
      message.error('오류가 발생했습니다.');
      console.error(error);
    }
  };

  const renderFormInput = (field: any, index: number) => {
    // 기본적으로 제외할 필드들
    if (['id', 'createdAt', 'updatedAt'].includes(field.name)) {
      return null;
    }

    // relation 필드 제외
    if (field.kind === 'object') {
      return null;
    }

    const commonProps = {
      label: field.name,
      name: field.name,
      rules: [
        {
          required: field.isRequired,
          message: `${field.name}을(를) 입력해주세요.`,
        },
      ],
    };

    // 필드 타입에 따른 컴포넌트 렌더링
    switch (field.type) {
      case 'boolean':
        return (
          <Form.Item
            {...commonProps}
            key={field.name}
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        );

      case 'number':
        return (
          <Form.Item {...commonProps} key={field.name}>
            <Input type="number" />
          </Form.Item>
        );

      case 'string':
        // 긴 텍스트가 필요한 필드인 경우
        if (LONG_TEXT_FIELDS.includes(field.name)) {
          return (
            <Form.Item {...commonProps} key={index}>
              <TextArea rows={4} value={initialData[field.name]} />
            </Form.Item>
          );
        }
        
        // Select 컴포넌트가 필요한 필드인 경우
        if (SELECT_FIELDS.includes(field.name)) {
          return (
            <Form.Item {...commonProps} key={index}>
              <Select>
                {/* 여기에 해당 필드의 옵션들을 추가할 수 있습니다 */}
                <Select.Option value="option1">Option 1</Select.Option>
                <Select.Option value="option2">Option 2</Select.Option>
              </Select>
            </Form.Item>
          );
        }

        // 이메일 필드인 경우
        if (field.name === 'email') {
          return (
            <Form.Item 
              {...commonProps}
              key={index}
              rules={[
                ...commonProps.rules,
                {
                  type: 'email',
                  message: '올바른 이메일 형식을 입력해주세요.',
                }
              ]}
            >
              <Input type="email" />
            </Form.Item>
          );
        }

        // 기본 텍스트 입력
        return (
          <Form.Item {...commonProps} key={index}>
            <Input />
          </Form.Item>
        );

      default:
        return (
          <Form.Item {...commonProps} key={index}>
            <Input />
          </Form.Item>
        );
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>{isNew ? `${model} 생성` : `${model} 수정`}</h2>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={initialData}
      >
        {fields.map((field: any, index: number) => renderFormInput(field, index))}
        
        <Form.Item>
          <Button type="primary" htmlType="submit">
            {isNew ? '생성' : '수정'}
          </Button>
          <Button 
            onClick={() => router.push(`/admin/${model}`)}
            style={{ marginLeft: '8px' }}
          >
            취소
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default DetailPageTemplate;
