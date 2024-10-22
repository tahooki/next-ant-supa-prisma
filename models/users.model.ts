import { Model } from './model';
import { Post } from './posts.model';


export class User extends Model {
  tableName = 'user';
  auth: string | null;
  id: number | null;
  username: string | null;
  bio: string | null;
  createdAt: number | null;
  posts?: Post[] | null;

  constructor(data: Partial<User>) {
    super();
    this.auth = data.auth ?? null;
    this.id = data.id ?? null;
    this.username = data.username ?? null;
    this.bio = data.bio ?? null;
    this.createdAt = data.createdAt ?? null;
    this.posts = data.posts ?? null;
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
        "type": "Posts[]",
        "required": false,
        "readOnly": false
      }
    ];
  }

  protected prepareManyToManyData(data: Partial<User>): Partial<User> {
    const { posts, ...rest } = data;
    return rest;
  }

  protected async handleManyToMany(tx: any, id: number, data: Partial<User>): Promise<void> {
    if (data.posts) {
      await tx.user.update({
        where: { id },
        data: {
          posts: {
            set: data.posts.map((post: Post) => ({ id: post.id })),
          },
        },
      });
    }
  }
}
