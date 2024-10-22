import { User } from "./users.model";

export class Post {
  id: number | null;
  title: string | null;
  content: string | null;
  createdAt: number | null;
  user: User | null;
  userId: number | null;

  constructor(data: Partial<Post>) {
    this.id = data.id ?? null;
    this.title = data.title ?? null;
    this.content = data.content ?? null;
    this.createdAt = data.createdAt ?? null;
    this.user = null;
    if (data.user) {    
      this.user = new User(data.user);
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
