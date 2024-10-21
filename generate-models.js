const { getDMMF } = require("@prisma/sdk");
const fs = require('fs');
const path = require('path');

// schema.prisma 파일을 읽습니다.
const schemaPath = './prisma/schema.prisma';
const modelsDir = './models';

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

  dmmf.datamodel.models.forEach((model) => {
    const className = model.name;
    const fields = model.fields.map((field) => ({
      name: field.name,
      type: mapFieldType(field.type),
      required: field.required,
      readOnly: field.isReadOnly,
    }));

    // TypeScript 클래스 템플릿
    const classTemplate = `
export class ${className} extends Model {
  ${fields
    .map((field) => `${field.name}: ${field.type} | null;`)
    .join('\n  ')}

  constructor(data) {
    ${fields
      .map((field) => `this.${field.name} = data.${field.name} ?? null;`)
      .join('\n    ')}
  }

  static getFieldMetadata() {
    return ${JSON.stringify(fields, null, 2)};
  }
}
`;

    // 파일 생성
    const filePath = path.join(modelsDir, `${className.toLowerCase()}.model.ts`);
    fs.writeFileSync(filePath, classTemplate, 'utf-8');
    console.log(`Generated: ${filePath}`);
  });
}

// Prisma 타입을 TypeScript 타입으로 매핑
function mapFieldType(prismaType) {
  let result = '';

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
  } else {
    result = 'Object';
  }

  if (prismaType.includes('[]')) {
    result = `${result}[]`;
  }

  return result;
}

generateModels().catch(console.error);
