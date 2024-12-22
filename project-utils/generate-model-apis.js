const fs = require('fs');
const path = require('path');

// Prisma 스키마 파일 읽기
const schemaPath = path.join(__dirname, 'prisma', 'schema.prisma');
const schemaContent = fs.readFileSync(schemaPath, 'utf8');

// 모델 정보 추출
const modelRegex = /model\s+(\w+)\s*{[\s\S]*?}/g;
const models = [];
let match;

while ((match = modelRegex.exec(schemaContent)) !== null) {
  const modelName = match[1];
  const modelContent = match[0];
  
  // 필드 정보 추출
  const fieldRegex = /^\s*(\w+)\s+(\w+)/gm;
  const fields = [];
  let fieldMatch;
  
  while ((fieldMatch = fieldRegex.exec(modelContent)) !== null) {
    fields.push({
      name: fieldMatch[1],
      type: fieldMatch[2]
    });
  }
  
  models.push({ name: modelName, fields });
}

// API 라우트 생성 함수
function generateApiRoute(model) {
  const routeName = model.name.toLowerCase();
  const dirPath = path.join(__dirname, 'src', 'app', 'api', routeName);
  const filePath = path.join(dirPath, 'route.ts');

  // 디렉토리가 없으면 생성
  if (!fs.existsSync(dirPath)){
    fs.mkdirSync(dirPath, { recursive: true });
  }

  const content = `
import { NextRequest, NextResponse } from 'next/server';
import { ${model.name} } from '@/models/${routeName}.model';

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get('id');
  const instance = new ${model.name}();

  if (id) {
    // Read
    try {
      instance.id = Number(id);
      const item = await instance.read();
      return NextResponse.json(item);
    } catch (error) {
      return NextResponse.json({ error: 'Error fetching ${model.name}' }, { status: 500 });
    }
  } else {
    // List
    try {
      const items = await instance.list({});
      return NextResponse.json(items);
    } catch (error) {
      return NextResponse.json({ error: 'Error fetching ${model.name} list' }, { status: 500 });
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const instance = new ${model.name}();
    const item = await instance.create(body);
    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Error creating ${model.name}' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const id = request.nextUrl.searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }

  try {
    const body = await request.json();
    const instance = new ${model.name}();
    instance.id = Number(id);
    const item = await instance.update(Number(id), body);
    return NextResponse.json(item);
  } catch (error) {
    return NextResponse.json({ error: 'Error updating ${model.name}' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const id = request.nextUrl.searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }

  try {
    const instance = new ${model.name}();
    instance.id = Number(id);
    await instance.delete();
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json({ error: 'Error deleting ${model.name}' }, { status: 500 });
  }
}
`;

  fs.writeFileSync(filePath, content);
  console.log(`Generated API route: ${filePath}`);
}

// 각 모델에 대해 API 라우트 생성
models.forEach(generateApiRoute);

console.log('API route generation completed.');
