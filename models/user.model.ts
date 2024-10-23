import { Model } from './model';
import { Post } from './post.model';

export class User extends Model {
  tableName = 'user' as const;

  auth: string | null;
  id: number | null;
  username: string | null;
  email: string | null;
  bio: string | null;
  createdAt: number | null;
  updatedAt: number | null;
  posts: Post[] | null;

  constructor(data: Partial<User> = {}) {
    super();
    this.auth = data.auth ?? null;
    this.id = data.id ?? null;
    this.username = data.username ?? null;
    this.email = data.email ?? null;
    this.bio = data.bio ?? null;
    this.createdAt = data.createdAt ?? null;
    this.updatedAt = data.updatedAt ?? null;
    this.posts = null;
    if (data.posts) {
      this.posts = data.posts.map((post: any) => new Post(post));
    }
  }
}