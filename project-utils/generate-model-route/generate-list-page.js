const fs = require('fs');
const path = require('path');

function generateListPage(model, type, targetDir) {
  // page.tsx 템플릿
  const pageTemplate = `import { requestModels } from '@/lib/api';
import PageTemplate from './page-template';
import type { ${model.charAt(0).toUpperCase() + model.slice(1)} } from '@/models/${model}.model';

export default async function ListPage() {
  const items = await requestModels<${model.charAt(0).toUpperCase() + model.slice(1)}[]>('${model}');

  if (!items) {
    return <div>No items found</div>;
  }

  return <PageTemplate items={items} />;
}`;

  let listClassName;
  switch(type) {
    case 'card': 
      listClassName = 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4';
      break;
    case 'line':
      listClassName = 'flex flex-col gap-4';
      break;
    case 'image':
      listClassName = 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4';
      break;
    default:
      listClassName = 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4';
      break;
  }

  // page-template.tsx 템플릿
  const templatePageTemplate = `"use client";

import Link from 'next/link';
import Item from './(components)/item';
import type { ${model.charAt(0).toUpperCase() + model.slice(1)} } from '@/models/${model}.model';

interface PageTemplateProps {
  items: ${model.charAt(0).toUpperCase() + model.slice(1)}[];
}

export default function PageTemplate({ items }: PageTemplateProps) {
  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">${model.charAt(0).toUpperCase() + model.slice(1)} List</h1>
        <Link
          href={\`/${model}/create\`}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Create New
        </Link>
      </div>

      <div className="${listClassName}">
        {items.map((item) => (
          <Item key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}

function classNames(classes: Record<string, boolean>) {
  return Object.entries(classes)
    .filter(([_, value]) => value)
    .map(([className]) => className)
    .join(' ');
}`;

  fs.writeFileSync(path.join(targetDir, 'page.tsx'), pageTemplate);
  fs.writeFileSync(path.join(targetDir, 'page-template.tsx'), templatePageTemplate);
}

module.exports = { generateListPage };
