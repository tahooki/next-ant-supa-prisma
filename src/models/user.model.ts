
import { UserType } from '@prisma/client';
import { ImageModel } from './image.model';
import { Model } from './model';
import { PostModel } from './post.model';
export class UserModel extends Model {
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
  posts: PostModel[] | null;
  profileImage: ImageModel | null;
  profileImageId: number | null;
  images: ImageModel[] | null;

  constructor(data: Partial<UserModel> = {}) {
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
