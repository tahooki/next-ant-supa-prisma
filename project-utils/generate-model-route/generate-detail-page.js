const fs = require('fs');
const path = require('path');

function generateDetailPage(model, targetDir) {
  const pageTemplate = `import { requestModel } from '@/lib/api';
import PageTemplate from './page-template';
import type { ${model.charAt(0).toUpperCase() + model.slice(1)} } from '@/models/${model}.model';

interface DetailPageProps {
  params: {
    id: string;
  };
}

export default async function DetailPage({ params: { id } }: DetailPageProps) {
  const item = await requestModel<${model.charAt(0).toUpperCase() + model.slice(1)}>('${model}', id);

  if (!item) {
    return <div>Not found</div>;
  }

  return <PageTemplate item={item} />;
}`;

  const templatePageTemplate = `"use client";

import type { ${model.charAt(0).toUpperCase() + model.slice(1)} } from '@/models/${model}.model';

interface PageTemplateProps {
  item: ${model.charAt(0).toUpperCase() + model.slice(1)};
}

export default function PageTemplate({ item }: PageTemplateProps) {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Detail ${model.charAt(0).toUpperCase() + model.slice(1)}</h1>
      <div className="space-y-4">
        {/* metafields에서 필드 매핑 */}
        {Object.entries(item).map(([key, value]) => (
          <div key={key} className="flex">
            <span className="font-bold w-32">{key}:</span>
            <span>{String(value)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}`;

  fs.writeFileSync(path.join(targetDir, 'page.tsx'), pageTemplate);
  fs.writeFileSync(path.join(targetDir, 'page-template.tsx'), templatePageTemplate);
}

module.exports = { generateDetailPage };
