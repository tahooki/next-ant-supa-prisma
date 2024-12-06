
import { Model } from './model';
import { PostModel } from './post.model';
import { UserModel } from './user.model';

export class ImageModel extends Model {
  tableName = 'image';

  id: number | null;
  name: string | null;
  url: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  userProfile: UserModel | null;
  userProfileId: number | null;
  user: UserModel | null;
  userId: number | null;
  post: PostModel | null;
  postId: number | null;

  constructor(data: Partial<ImageModel> = {}) {
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
