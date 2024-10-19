
export class Users {
  auth: string;
  id: number;
  username: string;
  bio: string;
  createdAt: Date;
  posts: any;

  constructor(data) {
    this.auth = data.auth;
    this.id = data.id;
    this.username = data.username;
    this.bio = data.bio;
    this.createdAt = data.createdAt;
    this.posts = data.posts;
  }

  static getFieldMetadata() {
    return [
  {
    "name": "auth",
    "type": "string",
    "required": true,
    "readOnly": false
  },
  {
    "name": "id",
    "type": "number",
    "required": true,
    "readOnly": true
  },
  {
    "name": "username",
    "type": "string",
    "required": true,
    "readOnly": false
  },
  {
    "name": "bio",
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
    "name": "posts",
    "type": "any",
    "required": true,
    "readOnly": false
  }
];
  }
}
