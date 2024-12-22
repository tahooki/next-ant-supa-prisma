const fs = require('fs');
const path = require('path');
const { generateCreatePage } = require('./generate-create-page');
const { generateDetailPage } = require('./generate-detail-page');
const { generateEditPage } = require('./generate-edit-page');
const { generateFormTemplate } = require('./generate-form');
const { generateListItem } = require('./generate-list-item');
const { generateListPage } = require('./generate-list-page');

function generateModelRoute(model, type = 'card') {
  // 기본 디렉토리 경로 설정
  const baseDir = path.join(process.cwd(), 'src', 'app', model);
  const componentsDir = path.join(baseDir, '(components)');
  const idDir = path.join(baseDir, '[id]');
  const editDir = path.join(idDir, 'edit');

  // 디렉토리 생성
  [baseDir, componentsDir, idDir, editDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });

  // 각 페이지 생성
  generateFormTemplate(model, componentsDir);
  generateListItem(model, type, componentsDir);
  generateCreatePage(model, baseDir);
  generateDetailPage(model, idDir);
  generateEditPage(model, editDir);
  generateListPage(model, type, baseDir);
}

// 커맨드 라인 인자 파싱
const args = process.argv.slice(2);
const modelIndex = args.findIndex(arg => !arg.startsWith('--'));
const typeIndex = args.findIndex(arg => arg === '--type');

const model = args[modelIndex];
const type = typeIndex !== -1 ? args[typeIndex + 1] : 'card';

if (!model) {
  console.error('모델 이름을 지정해주세요.');
  process.exit(1);
}

if (model === 'all') {
  // metafields.ts 파일에서 모든 모델 읽어오기
  const metafields = require('../../src/models/metafields');
  Object.keys(metafields).forEach(model => {
    generateModelRoute(model, type);
  });
} else {
  generateModelRoute(model, type);
}

module.exports = { generateModelRoute };
