const fs = require('fs');
const path = require('path');

function generateFormTemplate(model, targetDir) {
  const template = `"use client"

import { useState } from 'react';
import { Form, Formik } from 'formik';
import { createModel, updateModel } from '@/lib/api';
import type { ${model.charAt(0).toUpperCase() + model.slice(1)} } from '@/models/${model}.model';

interface FormTemplateProps {
  item?: ${model.charAt(0).toUpperCase() + model.slice(1)};
}

export default function FormTemplate({ item }: FormTemplateProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initialValues = item || {
    // metafields에서 필드 가져오기
  };

  const handleSubmit = async (values: any) => {
    setIsSubmitting(true);
    try {
      if (item?.id) {
        await updateModel('${model}', item.id, values);
      } else {
        await createModel('${model}', values);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
    >
      {({ values, handleChange }) => (
        <Form className="space-y-4">
          {/* metafields에서 필드 매핑 */}
        </Form>
      )}
    </Formik>
  );
}`;

  fs.writeFileSync(path.join(targetDir, 'form-template.tsx'), template);
}

module.exports = { generateFormTemplate };
