import { Users } from "./users.model";

export class Posts {
  id: number | null;
  title: string | null;
  content: string | null;
  createdAt: number | null;
  user: Users | null;
  userId: number | null;

  constructor(data: Partial<Posts>) {
    this.id = data.id ?? null;
    this.title = data.title ?? null;
    this.content = data.content ?? null;
    this.createdAt = data.createdAt ?? null;
    if (data.user) {    
      this.user = new Users(data.user);
    }
    this.userId = data.userId ?? null;
  }

  static getFieldMetadata() {
    return [
  {
    "name": "id",
    "type": "number",
    "required": true,
    "readOnly": true
  },
  {
    "name": "title",
    "type": "string",
    "required": true,
    "readOnly": false
  },
  {
    "name": "content",
    "type": "string",
    "required": true,
    "readOnly": false
  },
  {
    "name": "createdAt",
    "type": "Date",
    "required": true,
    "readOnly": false
  },
  {
    "name": "user",
    "type": "any",
    "required": true,
    "readOnly": false
  },
  {
    "name": "userId",
    "type": "number",
    "required": true,
    "readOnly": false
  }
];
  }
}
