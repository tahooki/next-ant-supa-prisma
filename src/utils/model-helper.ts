import { Model } from "../models/model";
import { Post } from "../models/post.model";
import { User } from "../models/user.model";

export function getModelInstance(modelName: string): Model {
  switch (modelName.toLowerCase()) {
    case 'user':
      return new User();
    case 'post':
      return new Post();
    default:
      throw new Error(`Unknown model: ${modelName}`);
  }
}
