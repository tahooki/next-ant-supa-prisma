const { getDMMF } = require("@prisma/internals");
const fs = require("fs");
const path = require("path");

// 절대 경로로 변경
const schemaPath = path.join(__dirname, "../prisma/schema.prisma");
const modelsDir = path.join(__dirname, "../src/models");
const modelTemplatePath = path.join(__dirname, "model.ts");

// DMMF(Data Model Meta Format)를 이용해 Prisma 모델 정보를 가져옵니다.
async function generateModels() {
  // fs.rmdir 대신 fs.rm 사용 (deprecation 경고 해결)
  if (fs.existsSync(modelsDir)) {
    fs.rmSync(modelsDir, { recursive: true, force: true });
  }

  // models 디렉토리가 없으면 생성
  if (!fs.existsSync(modelsDir)) {
    fs.mkdirSync(modelsDir, { recursive: true });
  }

  // 루트 폴더의 model.ts 파일을 models 폴더로 복사
  fs.copyFileSync(modelTemplatePath, path.join(modelsDir, "model.ts"));

  const schema = fs.readFileSync(schemaPath, "utf-8");
  const dmmf = await getDMMF({ datamodel: schema });

  const metaFields = {};

  const enums = dmmf.datamodel.enums.reduce((acc, enumType) => {
    acc[enumType.name] = {
      name: enumType.name,
      values: enumType.values.map((v) => v.name),
    };
    return acc;
  }, {});

  dmmf.datamodel.models.forEach((model) => {
    console.log("dmmf model", model);
    const className = model.name;
    const fields = model.fields.map((field) => {
      const fieldType = mapFieldType(field);
      return {
        ...field,
        type: fieldType.type,
        importType: fieldType.importType,
        isEnum: fieldType.isEnum,
      };
    });

    metaFields[className.toLowerCase()] = model.fields;

    // 필요한 임포트 구문 생성
    const imports = new Set(["import { Model } from '@/models/model';"]);

    // Enum 타입이 있는 경우 Prisma client에서 임포트
    const enumImports = fields
      .filter((field) => field.isEnum)
      .map((field) => field.type);

    if (enumImports.length > 0) {
      imports.add(
        `import { ${enumImports.join(", ")} } from '@prisma/client';`
      );
    }

    fields.forEach((field) => {
      if (field.importType) {
        imports.add(
          `import { ${
            field.importType
          }Model } from '@/models/${field.importType.toLowerCase()}.model';`
        );
      }
    });

    // TypeScript 클래스 템플릿
    const classTemplate = generateClassTemplate(className, fields, imports);

    // 파일 생성
    const filePath = path.join(
      modelsDir,
      `${className.toLowerCase()}.model.ts`
    );
    fs.writeFileSync(filePath, classTemplate, "utf-8");
    console.log(`Generated: ${filePath}`);
  });

  metaFields.enums = enums;

  const metafieldsContent = `export const metaFields = ${JSON.stringify(
    metaFields,
    null,
    2
  )};`;
  fs.writeFileSync(
    path.join(modelsDir, "metafields.ts"),
    metafieldsContent,
    "utf-8"
  );
  console.log(`Generated: ${path.join(modelsDir, "metafields.ts")}`);
}

// Prisma 타입을 TypeScript 타입으로 매핑
function mapFieldType(field) {
  let result = {
    type: field.type,
    importType: null,
    isEnum: false,
  };

  if (field.kind === "object") {
    result.type = field.isList ? `${field.type}Model[]` : `${field.type}Model`;
    result.importType = field.type;
  } else if (field.kind === "enum") {
    result.type = field.type;
    result.isEnum = true;
  } else if (field.type === "Json") {
    result.type = "string";
  } else if (
    field.type === "Int" ||
    field.type === "Float" ||
    field.type === "Decimal"
  ) {
    result.type = "number";
  } else if (field.type === "String") {
    result.type = "string";
  } else if (field.type === "Boolean") {
    result.type = "boolean";
  } else if (field.type === "DateTime") {
    result.type = "string";
  } else if (field.type === "BigInt") {
    result.type = "number";
  }

  return result;
}

function generateConstructorField(field) {
  if (field.importType) {
    if (field.type.includes("[]")) {
      // 배열 타입인 경우
      return `    this.${field.name} = data.${field.name} ? data.${field.name}.map(item => new ${field.importType}Model(item)) : undefined;`;
    } else {
      // 단일 객체인 경우
      return `    this.${field.name} = data.${field.name} ? new ${field.importType}Model(data.${field.name}) : undefined;`;
    }
  }
  // 일반 필드인 경우
  return `    this.${field.name} = data.${field.name} ?? undefined;`;
}

// 모델의 식별자 필드를 결정하는 함수 추가
function getIdentifierField(fields) {
  // id 필드가 있으면 id를 사용 (단, userId와 같이 Id로 끝나는 필드는 제외)
  const idField = fields.find((field) => field.name === "id");
  if (idField) {
    return "id";
  }
  // id가 없으면 name을 사용
  const nameField = fields.find((field) => field.name === "name");
  if (nameField) {
    return "name";
  }
  // 둘 다 없으면 Id로 끝나지 않는 첫 번째 필드를 사용
  const nonIdField = fields.find((field) => !field.name.endsWith("Id"));
  if (nonIdField) {
    return nonIdField.name;
  }
  // 모든 필드가 Id로 끝나는 경우 첫 번째 필드를 사용
  return fields[0].name;
}

function shouldIncludeField(field) {
  // id는 포함 (primary key)
  if (field.name === "id") return true;

  // relation 필드는 포함
  if (field.kind === "object") return true;

  // createdAt, updatedAt 등은 포함
  if (field.name === "createdAt" || field.name === "updatedAt") return true;

  // 나머지 Id로 끝나는 필드는 제외
  if (field.name.endsWith("Id")) return false;

  return true;
}

// TypeScript 클래스 템플릿 수정
function generateClassTemplate(className, fields, imports) {
  const filteredFields = fields.filter(shouldIncludeField);

  return `
${Array.from(imports).join("\n")}

export class ${className}Model extends Model {
  tableName = '${className.toLowerCase()}';

  ${filteredFields
    .map((field) => `${field.name}: ${field.type} | undefined;`)
    .join("\n  ")}

  constructor(data: Partial<${className}Model> = {}) {
    super();

${filteredFields.map((field) => generateConstructorField(field)).join("\n")}
  }
}
`;
}

generateModels().catch(console.error);
