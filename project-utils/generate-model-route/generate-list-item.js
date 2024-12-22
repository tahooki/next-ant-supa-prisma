const fs = require('fs');
const path = require('path');

function generateListItem(model, type, targetDir) {
  let template;

  switch(type) {
    case 'card':
      template = `import Link from 'next/link';
import { ${model.charAt(0).toUpperCase() + model.slice(1)} } from '@/models/${model}.model';

interface ItemProps {
  item: ${model.charAt(0).toUpperCase() + model.slice(1)};
}

export default function Item({ item }: ItemProps) {
  return (
    <Link href={\`/${model}/\${item.id}\`} className="block">
      <div className="bg-white p-4 rounded-lg shadow">
        {item.title && <h3 className="title text-lg font-semibold">{item.title}</h3>}
        {item.description && <p className="description text-gray-600">{item.description}</p>}
        {item.content && <p className="content text-gray-600 truncate">{item.content}</p>}
        {item.image && (
          <div className="image-wrapper mt-2">
            <img src={item.image} alt={item.title || ''} className="w-full h-48 object-cover rounded" />
          </div>
        )}
      </div>
    </Link>
  );
}`;
      break;

    case 'line':
      template = `import Link from 'next/link';
import { ${model.charAt(0).toUpperCase() + model.slice(1)} } from '@/models/${model}.model';

interface ItemProps {
  item: ${model.charAt(0).toUpperCase() + model.slice(1)};
}

export default function Item({ item }: ItemProps) {
  return (
    <div className="flex items-center p-4 border-b">
      {item.title && <h3 className="title flex-1 font-semibold">{item.title}</h3>}
      {item.description && <p className="description flex-1 text-gray-600">{item.description}</p>}
      <div className="flex gap-2">
        <Link href={\`/${model}/\${item.id}\`} className="text-blue-500 hover:underline">View</Link>
        <Link href={\`/${model}/\${item.id}/edit\`} className="text-green-500 hover:underline">Edit</Link>
      </div>
    </div>
  );
}`;
      break;

    case 'image':
      template = `import Link from 'next/link';
import { ${model.charAt(0).toUpperCase() + model.slice(1)} } from '@/models/${model}.model';

interface ItemProps {
  item: ${model.charAt(0).toUpperCase() + model.slice(1)};
}

export default function Item({ item }: ItemProps) {
  return (
    <Link href={\`/${model}/\${item.id}\`} className="block">
      <div className="relative group">
        {item.image && (
          <div className="image-wrapper aspect-square overflow-hidden">
            <img src={item.image} alt={item.title || ''} className="w-full h-full object-cover" />
          </div>
        )}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all">
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100">
            {item.title && <h3 className="title text-white font-semibold">{item.title}</h3>}
          </div>
        </div>
      </div>
    </Link>
  );
}`;
      break;

    default:
      template = `import Link from 'next/link';
import { ${model.charAt(0).toUpperCase() + model.slice(1)} } from '@/models/${model}.model';

interface ItemProps {
  item: ${model.charAt(0).toUpperCase() + model.slice(1)};
}

export default function Item({ item }: ItemProps) {
  return (
    <Link href={\`/${model}/\${item.id}\`} className="block">
      <div>
        {item.title && <h3>{item.title}</h3>}
      </div>
    </Link>
  );
}`;
  }

  fs.writeFileSync(path.join(targetDir, 'item.tsx'), template);
}

module.exports = { generateListItem };
