
import { Post } from '@prisma/client';
import { Model } from './model';
import { User } from './user.model';

export class Image extends Model {
  tableName = 'image';

  id: number | null;
  name: string | null;
  url: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  userProfile: User | null;
  userProfileId: number | null;
  user: User | null;
  userId: number | null;
  post: Post | null;
  postId: number | null;

  constructor(data: Partial<Image> = {}) {
    super();
    this.id = data.id ?? null;
    this.name = data.name ?? null;
    this.url = data.url ?? null;
    this.createdAt = data.createdAt ?? null;
    this.updatedAt = data.updatedAt ?? null;
    this.userProfile = data.userProfile ?? null;
    this.userProfileId = data.userProfileId ?? null;
    this.user = data.user ?? null;
    this.userId = data.userId ?? null;
    this.post = data.post ?? null;
    this.postId = data.postId ?? null;
  }
}
