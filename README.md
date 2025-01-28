# Auto CRUD Generator

A Next.js-based framework that builds a complete CRUD system just by defining the schema.

## Introduction

This project is a tool that automatically generates CRUD functionality based on Prisma schema. Developers only need to define the data model, and the rest is handled automatically.

## Key Features

- ⚡️ Automatic CRUD generation based on Prisma schema
- 🎨 Admin UI generation with Ant Design
- 🔄 Automatic API route generation
- 📝 TypeScript type generation
- 🔐 Supabase authentication integration

## Getting Started

### 1. Define Schema

Define your data model in `prisma/schema.prisma`:

```prisma
model Post {
  id        String   @id @default(cuid())
  title     String
  content   String?
  published Boolean  @default(false)
  author    User     @relation(fields: [authorId], references: [id])
  authorId  String
}
```

### 2. Generate Models

```bash
node project-utils/generate-models.js
```

This command generates:

- TypeScript model classes
- Metafield definitions
- Type definitions

### 3. Generate Routes

```bash
node project-utils/generate-model-route/generate-route.js [model] --type [type]
```

Type options:

- `card`: Card-style list view
- `line`: Line-style list view
- `image`: Image gallery style list view

To generate routes for all models at once:

```bash
node project-utils/generate-model-route/generate-route.js all
```

## Generated File Structure

```
src/
├── models/
│   ├── [model].model.ts     # Model class
│   ├── model.ts             # Base model class
│   └── metafields.ts        # Metafield definitions
└── app/
    └── [model]/
        ├── (components)/
        │   ├── form-template.tsx  # Create/Edit form
        │   └── item.tsx          # List item
        ├── [id]/
        │   ├── edit/
        │   │   └── page.tsx      # Edit page
        │   └── page.tsx          # Detail page
        ├── create.tsx            # Create page
        └── page.tsx              # List page
```

## Auto-Generated Features

### 1. Model Class

- Basic CRUD operation methods
- TypeScript type support
- Relational data handling

### 2. API Routes

- GET: List and single item retrieval
- POST: Create new items
- PATCH: Update items
- DELETE: Remove items

### 3. UI Components

- List views (Card/Line/Image format)
- Detail view
- Create/Edit forms
- Responsive design

## Tech Stack

- [Next.js](https://nextjs.org/)
- [Prisma](https://www.prisma.io/)
- [Supabase](https://supabase.com/)
- [Ant Design](https://ant.design/)
- [TypeScript](https://www.typescriptlang.org/)

## Contributing

Bug reports, feature suggestions, and pull requests are welcome!

## License

MIT License
