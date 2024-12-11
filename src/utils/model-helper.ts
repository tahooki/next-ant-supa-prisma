import { ImageModel } from "@/models/image.model";
import { Model } from "../models/model";
import { PostModel } from "../models/post.model";
import { UserModel } from "../models/user.model";

export function getModelInstance(modelName: string, params: any = {}): Model {
  switch (modelName.toLowerCase()) {
    case 'user':
      return new UserModel(params);
    case 'post':
      return new PostModel(params);
    case 'image':
      return new ImageModel(params);
    default:
      throw new Error(`Unknown model: ${modelName}`);
  }
}
