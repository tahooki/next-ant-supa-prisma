
import { Model } from './model';
import { User } from './user.model';

export class Post extends Model {
  tableName = 'post';

  id: number | null;
  title: string | null;
  content: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  user: User | null;
  userId: number | null;

  constructor(data: Partial<Post> = {}) {
    super();
    this.id = data.id ?? null;
    this.title = data.title ?? null;
    this.content = data.content ?? null;
    this.createdAt = data.createdAt ?? null;
    this.updatedAt = data.updatedAt ?? null;
    this.user = data.user ?? null;
    this.userId = data.userId ?? null;
  }

}
