const fs = require('fs');
const path = require('path');

function generateCreatePage(model, targetDir) {
  const template = `import FormTemplate from './(components)/form-template';

export default function CreatePage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create ${model.charAt(0).toUpperCase() + model.slice(1)}</h1>
      <FormTemplate />
    </div>
  );
}`;

  fs.writeFileSync(path.join(targetDir, 'create.tsx'), template);
}

module.exports = { generateCreatePage };
