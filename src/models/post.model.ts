
import { ImageModel } from './image.model';
import { Model } from './model';
import { UserModel } from './user.model';

export interface Post {
  id: number | null;
  title: string | null;
  content: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  images: ImageModel[] | null;
  user: UserModel | null;
  userId: number | null;
  mainImage: string | null;
}

export class PostModel extends Model implements Post {
  tableName = 'post';
  id: number | null;
  title: string | null;
  content: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  images: ImageModel[] | null;
  user: UserModel | null;
  userId: number | null;
  mainImage: string | null;
  
  constructor(data: Partial<PostModel> = {}) {
    super();
      this.id = data.id ?? null;
      this.title = data.title ?? null;
      this.content = data.content ?? null;
      this.createdAt = data.createdAt ?? null;
      this.updatedAt = data.updatedAt ?? null;
      this.images = data.images ?? null;
      this.user = data.user ?? null;
      this.userId = data.userId ?? null;
      this.mainImage = data.mainImage ?? null;
  }
}
