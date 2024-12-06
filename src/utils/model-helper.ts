import { ImageModel } from "@/models/image.model";
import { Model } from "../models/model";
import { PostModel } from "../models/post.model";
import { UserModel } from "../models/user.model";

export function getModelInstance(modelName: string): Model {
  switch (modelName.toLowerCase()) {
    case 'user':
      return new UserModel();
    case 'post':
      return new PostModel();
    case 'image':
      return new ImageModel();
    default:
      throw new Error(`Unknown model: ${modelName}`);
  }
}
