
import { UserType } from '@prisma/client';
import { Image } from './image.model';
import { Model } from './model';
import { Post } from './post.model';
export class User extends Model {
  tableName = 'user';

  auth: string | null;
  id: number | null;
  username: string | null;
  email: string | null;
  bio: string | null;
  isActive: boolean | null;
  type: UserType | null;
  createdAt: string | null;
  updatedAt: string | null;
  posts: Post[] | null;
  profileImage: Image | null;
  profileImageId: number | null;
  images: Image[] | null;

  constructor(data: Partial<User> = {}) {
    super();

        this.auth = data.auth ?? null;
        this.id = data.id ?? null;
        this.username = data.username ?? null;
        this.email = data.email ?? null;
        this.bio = data.bio ?? null;
        this.isActive = data.isActive ?? null;
        this.type = data.type ?? null;
        this.createdAt = data.createdAt ?? null;
        this.updatedAt = data.updatedAt ?? null;
        this.posts = data.posts ?? null;
        this.profileImage = data.profileImage ?? null;
        this.profileImageId = data.profileImageId ?? null;
        this.images = data.images ?? null;
  }
}
