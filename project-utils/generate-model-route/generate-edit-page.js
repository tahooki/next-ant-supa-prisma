const fs = require('fs');
const path = require('path');

function generateEditPage(model, targetDir) {
  const template = `import { requestModel } from '@/lib/api';
import FormTemplate from '../../(components)/form-template';
import type { ${model.charAt(0).toUpperCase() + model.slice(1)} } from '@/models/${model}.model';

interface EditPageProps {
  params: {
    id: string;
  };
}

export default async function EditPage({ params: { id } }: EditPageProps) {
  const item = await requestModel<${model.charAt(0).toUpperCase() + model.slice(1)}>('${model}', id);

  if (!item) {
    return <div>Not found</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit ${model.charAt(0).toUpperCase() + model.slice(1)}</h1>
      <FormTemplate item={item} />
    </div>
  );
}`;

  fs.writeFileSync(path.join(targetDir, 'page.tsx'), template);
}

module.exports = { generateEditPage };
