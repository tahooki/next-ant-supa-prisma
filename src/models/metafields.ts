export const metaFields = {
  "user": [
    {
      "name": "auth",
      "kind": "scalar",
      "isList": false,
      "isRequired": true,
      "isUnique": true,
      "isId": false,
      "isReadOnly": false,
      "hasDefaultValue": false,
      "type": "String",
      "isGenerated": false,
      "isUpdatedAt": false
    },
    {
      "name": "id",
      "kind": "scalar",
      "isList": false,
      "isRequired": true,
      "isUnique": false,
      "isId": true,
      "isReadOnly": false,
      "hasDefaultValue": true,
      "type": "Int",
      "default": {
        "name": "autoincrement",
        "args": []
      },
      "isGenerated": false,
      "isUpdatedAt": false
    },
    {
      "name": "username",
      "kind": "scalar",
      "isList": false,
      "isRequired": false,
      "isUnique": false,
      "isId": false,
      "isReadOnly": false,
      "hasDefaultValue": false,
      "type": "String",
      "isGenerated": false,
      "isUpdatedAt": false
    },
    {
      "name": "email",
      "kind": "scalar",
      "isList": false,
      "isRequired": false,
      "isUnique": false,
      "isId": false,
      "isReadOnly": false,
      "hasDefaultValue": false,
      "type": "String",
      "isGenerated": false,
      "isUpdatedAt": false
    },
    {
      "name": "bio",
      "kind": "scalar",
      "isList": false,
      "isRequired": false,
      "isUnique": false,
      "isId": false,
      "isReadOnly": false,
      "hasDefaultValue": false,
      "type": "String",
      "isGenerated": false,
      "isUpdatedAt": false
    },
    {
      "name": "isActive",
      "kind": "scalar",
      "isList": false,
      "isRequired": true,
      "isUnique": false,
      "isId": false,
      "isReadOnly": false,
      "hasDefaultValue": true,
      "type": "Boolean",
      "default": true,
      "isGenerated": false,
      "isUpdatedAt": false
    },
    {
      "name": "type",
      "kind": "enum",
      "isList": false,
      "isRequired": true,
      "isUnique": false,
      "isId": false,
      "isReadOnly": false,
      "hasDefaultValue": true,
      "type": "UserType",
      "default": "USER",
      "isGenerated": false,
      "isUpdatedAt": false
    },
    {
      "name": "createdAt",
      "kind": "scalar",
      "isList": false,
      "isRequired": true,
      "isUnique": false,
      "isId": false,
      "isReadOnly": false,
      "hasDefaultValue": true,
      "type": "DateTime",
      "default": {
        "name": "now",
        "args": []
      },
      "isGenerated": false,
      "isUpdatedAt": false
    },
    {
      "name": "updatedAt",
      "kind": "scalar",
      "isList": false,
      "isRequired": true,
      "isUnique": false,
      "isId": false,
      "isReadOnly": false,
      "hasDefaultValue": false,
      "type": "DateTime",
      "isGenerated": false,
      "isUpdatedAt": true
    },
    {
      "name": "posts",
      "kind": "object",
      "isList": true,
      "isRequired": true,
      "isUnique": false,
      "isId": false,
      "isReadOnly": false,
      "hasDefaultValue": false,
      "type": "Post",
      "relationName": "PostToUser",
      "relationFromFields": [],
      "relationToFields": [],
      "isGenerated": false,
      "isUpdatedAt": false
    },
    {
      "name": "profileImage",
      "kind": "object",
      "isList": false,
      "isRequired": false,
      "isUnique": false,
      "isId": false,
      "isReadOnly": false,
      "hasDefaultValue": false,
      "type": "Image",
      "relationName": "UserProfile",
      "relationFromFields": [],
      "relationToFields": [],
      "isGenerated": false,
      "isUpdatedAt": false
    },
    {
      "name": "profileImageId",
      "kind": "scalar",
      "isList": false,
      "isRequired": false,
      "isUnique": true,
      "isId": false,
      "isReadOnly": false,
      "hasDefaultValue": false,
      "type": "Int",
      "isGenerated": false,
      "isUpdatedAt": false
    },
    {
      "name": "images",
      "kind": "object",
      "isList": true,
      "isRequired": true,
      "isUnique": false,
      "isId": false,
      "isReadOnly": false,
      "hasDefaultValue": false,
      "type": "Image",
      "relationName": "UserImages",
      "relationFromFields": [],
      "relationToFields": [],
      "isGenerated": false,
      "isUpdatedAt": false
    }
  ],
  "post": [
    {
      "name": "id",
      "kind": "scalar",
      "isList": false,
      "isRequired": true,
      "isUnique": false,
      "isId": true,
      "isReadOnly": false,
      "hasDefaultValue": true,
      "type": "Int",
      "default": {
        "name": "autoincrement",
        "args": []
      },
      "isGenerated": false,
      "isUpdatedAt": false
    },
    {
      "name": "title",
      "kind": "scalar",
      "isList": false,
      "isRequired": false,
      "isUnique": false,
      "isId": false,
      "isReadOnly": false,
      "hasDefaultValue": false,
      "type": "String",
      "isGenerated": false,
      "isUpdatedAt": false
    },
    {
      "name": "content",
      "kind": "scalar",
      "isList": false,
      "isRequired": false,
      "isUnique": false,
      "isId": false,
      "isReadOnly": false,
      "hasDefaultValue": false,
      "type": "String",
      "isGenerated": false,
      "isUpdatedAt": false
    },
    {
      "name": "createdAt",
      "kind": "scalar",
      "isList": false,
      "isRequired": true,
      "isUnique": false,
      "isId": false,
      "isReadOnly": false,
      "hasDefaultValue": true,
      "type": "DateTime",
      "default": {
        "name": "now",
        "args": []
      },
      "isGenerated": false,
      "isUpdatedAt": false
    },
    {
      "name": "updatedAt",
      "kind": "scalar",
      "isList": false,
      "isRequired": true,
      "isUnique": false,
      "isId": false,
      "isReadOnly": false,
      "hasDefaultValue": false,
      "type": "DateTime",
      "isGenerated": false,
      "isUpdatedAt": true
    },
    {
      "name": "images",
      "kind": "object",
      "isList": true,
      "isRequired": true,
      "isUnique": false,
      "isId": false,
      "isReadOnly": false,
      "hasDefaultValue": false,
      "type": "Image",
      "relationName": "PostImages",
      "relationFromFields": [],
      "relationToFields": [],
      "isGenerated": false,
      "isUpdatedAt": false
    },
    {
      "name": "user",
      "kind": "object",
      "isList": false,
      "isRequired": false,
      "isUnique": false,
      "isId": false,
      "isReadOnly": false,
      "hasDefaultValue": false,
      "type": "User",
      "relationName": "PostToUser",
      "relationFromFields": [
        "userId"
      ],
      "relationToFields": [
        "id"
      ],
      "relationOnDelete": "Cascade",
      "isGenerated": false,
      "isUpdatedAt": false
    },
    {
      "name": "userId",
      "kind": "scalar",
      "isList": false,
      "isRequired": false,
      "isUnique": false,
      "isId": false,
      "isReadOnly": true,
      "hasDefaultValue": false,
      "type": "Int",
      "isGenerated": false,
      "isUpdatedAt": false
    }
  ],
  "image": [
    {
      "name": "id",
      "kind": "scalar",
      "isList": false,
      "isRequired": true,
      "isUnique": false,
      "isId": true,
      "isReadOnly": false,
      "hasDefaultValue": true,
      "type": "Int",
      "default": {
        "name": "autoincrement",
        "args": []
      },
      "isGenerated": false,
      "isUpdatedAt": false
    },
    {
      "name": "name",
      "kind": "scalar",
      "isList": false,
      "isRequired": true,
      "isUnique": false,
      "isId": false,
      "isReadOnly": false,
      "hasDefaultValue": false,
      "type": "String",
      "isGenerated": false,
      "isUpdatedAt": false
    },
    {
      "name": "url",
      "kind": "scalar",
      "isList": false,
      "isRequired": true,
      "isUnique": false,
      "isId": false,
      "isReadOnly": false,
      "hasDefaultValue": false,
      "type": "String",
      "isGenerated": false,
      "isUpdatedAt": false
    },
    {
      "name": "createdAt",
      "kind": "scalar",
      "isList": false,
      "isRequired": true,
      "isUnique": false,
      "isId": false,
      "isReadOnly": false,
      "hasDefaultValue": true,
      "type": "DateTime",
      "default": {
        "name": "now",
        "args": []
      },
      "isGenerated": false,
      "isUpdatedAt": false
    },
    {
      "name": "updatedAt",
      "kind": "scalar",
      "isList": false,
      "isRequired": true,
      "isUnique": false,
      "isId": false,
      "isReadOnly": false,
      "hasDefaultValue": false,
      "type": "DateTime",
      "isGenerated": false,
      "isUpdatedAt": true
    },
    {
      "name": "userProfile",
      "kind": "object",
      "isList": false,
      "isRequired": false,
      "isUnique": false,
      "isId": false,
      "isReadOnly": false,
      "hasDefaultValue": false,
      "type": "User",
      "relationName": "UserProfile",
      "relationFromFields": [
        "userProfileId"
      ],
      "relationToFields": [
        "id"
      ],
      "relationOnDelete": "Cascade",
      "isGenerated": false,
      "isUpdatedAt": false
    },
    {
      "name": "userProfileId",
      "kind": "scalar",
      "isList": false,
      "isRequired": false,
      "isUnique": true,
      "isId": false,
      "isReadOnly": true,
      "hasDefaultValue": false,
      "type": "Int",
      "isGenerated": false,
      "isUpdatedAt": false
    },
    {
      "name": "user",
      "kind": "object",
      "isList": false,
      "isRequired": false,
      "isUnique": false,
      "isId": false,
      "isReadOnly": false,
      "hasDefaultValue": false,
      "type": "User",
      "relationName": "UserImages",
      "relationFromFields": [
        "userId"
      ],
      "relationToFields": [
        "id"
      ],
      "relationOnDelete": "Cascade",
      "isGenerated": false,
      "isUpdatedAt": false
    },
    {
      "name": "userId",
      "kind": "scalar",
      "isList": false,
      "isRequired": false,
      "isUnique": false,
      "isId": false,
      "isReadOnly": true,
      "hasDefaultValue": false,
      "type": "Int",
      "isGenerated": false,
      "isUpdatedAt": false
    },
    {
      "name": "post",
      "kind": "object",
      "isList": false,
      "isRequired": false,
      "isUnique": false,
      "isId": false,
      "isReadOnly": false,
      "hasDefaultValue": false,
      "type": "Post",
      "relationName": "PostImages",
      "relationFromFields": [
        "postId"
      ],
      "relationToFields": [
        "id"
      ],
      "relationOnDelete": "Cascade",
      "isGenerated": false,
      "isUpdatedAt": false
    },
    {
      "name": "postId",
      "kind": "scalar",
      "isList": false,
      "isRequired": false,
      "isUnique": false,
      "isId": false,
      "isReadOnly": true,
      "hasDefaultValue": false,
      "type": "Int",
      "isGenerated": false,
      "isUpdatedAt": false
    }
  ],
  "enums": {
    "UserType": {
      "name": "UserType",
      "values": [
        "ADMIN",
        "USER",
        "GUEST"
      ]
    }
  }
};