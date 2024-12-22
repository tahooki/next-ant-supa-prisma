# 프로젝트의 route를 만드는 node 프로그램을 만드는 Prompt 입니다.

## 참조되는 파일은 다음과 같습니다.
- generate-route.js : 모델의 route를 생성하는 파일 아래 파일들을 참조해서 함수를 실행합니다.
- generate-create-page.js : 모델의 생성 페이지를 생성하는 파일
- generate-detail-page.js : 모델의 상세 페이지를 생성하는 파일
- generate-edit-page.js : 모델의 수정 페이지를 생성하는 파일
- generate-list-item.js : 모델의 리스트 아이템을 생성하는 파일
- generate-list-page.js : 모델의 리스트 페이지를 생성하는 파일

## 생성되는 폴더구조는 다음과 같습니다.
```
src/app/[model]
├── (components)
│   ├── form-template.tsx
│   └── item.tsx
└── [id]
│   ├── edit
│   │   ├── page.tsx
│   │   └── page-template.tsx
│   ├── page.tsx
│   └── page-template.tsx
├── create.tsx
├── page-template.tsx
└── page.tsx
```


## generate-route.js 파일 설명
### 명령어
```
node generate-route.js [model] --type [type]
```
- model은 post, user, image 등등 아무 글자가 올수 있으며 all을 포함해서 작동합니다. 
- all 일때는 모든 모델을 생성합니다.
- type은 card, line, image 가 올 수 있습니다. 이것은 item과 list에 type을 전달하고 각각에 맞춰서 생성합니다.

## generate-form-template.js 파일 설명
- (components) 폴더 안에 form-template.tsx을 생성합니다.
- @/models/metafields.ts 파일을 참조해서 생성합니다.
- item값을 전달 받거나 받지 않을 수 있습니다. 전달받는 아이템의 타입은 @/models/[model].model.ts 파일에서 인터페이스를 가져와서 데이터를 전달 받을수 있도록 만듭니다. ex) user 의 경우 해당 모델파일에 interface가 User로 생성 되어있슴.
- 전달 받은 item값은 initialValues에 전달합니다.
- submit 함수는 전달 받은 item의 id값이 있다면 updateModel을 통해서 업데이트 하고 없다면 createModel을 통해서 생성합니다.

## generate-create-page.js 파일 설명
- (components) 폴더 안에 있는 form-template.tsx을 랜더링 합니다.

## generate-edit-page.js 파일 설명
- 전달 받은 id값으로 requestModel을 통해서 데이터를 가져옵니다.
- (components) 폴더 안에 있는 form-template.tsx로 랜더링하며 불러온 데이터를 넘깁니다..

## generate-detail-page.js 파일 설명
- 전달 받은 id값으로 requestModel을 통해서 데이터를 가져옵니다.
- 전달 받은 데이터를 랜더링 합니다.
- 화면은 @/models/metafields.ts 파일을 참조해서 생성 할수 있도록 case문으로 랜더링 하도록 만듭니다.

## generate-list-item.js 파일 설명
- @/models/metafields.ts 파일을 참조해서 생성합니다.
- metafields.ts 파일에서 모델의 메타필드를 참조해서 생성합니다.
- 전달받은 type에 맞게 3가지 타입을 따로 생성할 수 있도록 코드를 생성합니다.
- (components) 폴더 안에 item.tsx에 생성합니다.
- list의 전달받는 타입은 @/models/\[model\].model.ts 파일에서 참조해서 생성합니다. ex) user 의 경우 해당 모델파일에 interface가 User로 생성 되어있슴.
- 값이 들어가야하는 className은 해당 field의 이름으로 만듭니다 ex) <div className="title">{item.title}</div>

## generate-list-page.js 파일 설명
- page.tsx와 page-template.tsx 파일을 생성합니다.
- page-template.tsx 파일은 전달받은 type에 맞게 3가지 타입을 따로 생성할 수 있도록 코드를 생성합니다.
- list의 item은 (components) 폴더 안에 있는 item.tsx 파일을 참조해서 생성합니다.

## 모델의 기본적인 네이밍 규칙
- 다음과 같은 필드가 있거나 없을수 있습니다.
- title, content, name, description, email, password, phone, address, image, video, file, \[...At\]