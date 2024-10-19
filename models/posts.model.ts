
export class Posts {
  id: number;
  title: string;
  content: string;
  createdAt: Date;
  user: any;
  userId: number;

  constructor(data) {
    this.id = data.id;
    this.title = data.title;
    this.content = data.content;
    this.createdAt = data.createdAt;
    this.user = data.user;
    this.userId = data.userId;
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
