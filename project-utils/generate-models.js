const { getDMMF } = require("@prisma/sdk");
const fs = require('fs');
const path = require('path');

// schema.prisma 파일을 읽습니다.
const schemaPath = '../prisma/schema.prisma';
const modelsDir = '../src/models';

// DMMF(Data Model Meta Format)를 이용해 Prisma 모델 정보를 가져옵니다.
async function generateModels() {
  // models가 이미 있다면 models 디렉토리를 삭제
  if (fs.existsSync(modelsDir)) {
    fs.rmdirSync(modelsDir, { recursive: true });
  }

  // models 디렉토리가 없으면 생성
  if (!fs.existsSync(modelsDir)) {
    fs.mkdirSync(modelsDir, { recursive: true });
  }

  // 루트 폴더의 model.ts 파일을 models 폴더로 복사
  fs.copyFileSync('./model.ts', path.join(modelsDir, 'model.ts'));

  const schema = fs.readFileSync(schemaPath, 'utf-8');
  const dmmf = await getDMMF({ datamodel: schema });

  const metaFields = {};

  const enums = dmmf.datamodel.enums.reduce((acc, enumType) => {
    acc[enumType.name] = {
      name: enumType.name,
      values: enumType.values.map(v => v.name)
    };
    return acc;
  }, {});

  dmmf.datamodel.models.forEach((model) => {
    console.log('dmmf model', model);
    const className = model.name;
    const fields = model.fields.map((field) => ({
      ...field,
      type: mapFieldType(field.type),
    }));

    metaFields[className.toLowerCase()] = model.fields;

    // TypeScript 클래스 템플릿
    const classTemplate = `
import { Model } from '@/models/model';
import { metaFields } from '@/models/metafields';

export class ${className}Model extends Model {
  tableName = '${className.toLowerCase()}';

  ${fields
    .map((field) => `${field.name}: ${field.type} | null;`)
    .join('\n  ')}

  constructor(data: Partial<${className}Model> = {}) {
    super();

    ${fields
      .map((field) => `    this.${field.name} = data.${field.name} ?? null;`)
      .join('\n    ')}
  }
}
`;

    // 파일 생성
    const filePath = path.join(modelsDir, `${className.toLowerCase()}.model.ts`);
    fs.writeFileSync(filePath, classTemplate, 'utf-8');
    console.log(`Generated: ${filePath}`);
  });

  metaFields.enums = enums;

  const metafieldsContent = `export const metaFields = ${JSON.stringify(metaFields, null, 2)};`;
  fs.writeFileSync(path.join(modelsDir, 'metafields.ts'), metafieldsContent, 'utf-8');
  console.log(`Generated: ${path.join(modelsDir, 'metafields.ts')}`);
}

// Prisma 타입을 TypeScript 타입으로 매핑
function mapFieldType(prismaType) {
  let result = prismaType;

  if (prismaType.includes('Int')) {
    result = 'number';
  } else if (prismaType.includes('String')) {
    result = 'string';
  } else if (prismaType.includes('Boolean')) {
    result = 'boolean';
  } else if (prismaType.includes('Float')) {
    result = 'number';
  } else if (prismaType.includes('BigInt')) {
    result = 'number';
  } else if (prismaType.includes('DateTime')) {
    result = 'string';
  }

  return result;
}

generateModels().catch(console.error);
