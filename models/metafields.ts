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
      "type": "string",
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
      "type": "number",
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
      "type": "string",
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
      "type": "string",
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
      "type": "string",
      "isGenerated": false,
      "isUpdatedAt": false
    },
    {
      "name": "createdAt",
      "kind": "scalar",
      "isList": false,
      "isRequired": false,
      "isUnique": false,
      "isId": false,
      "isReadOnly": false,
      "hasDefaultValue": false,
      "type": "number",
      "isGenerated": false,
      "isUpdatedAt": false
    },
    {
      "name": "updatedAt",
      "kind": "scalar",
      "isList": false,
      "isRequired": false,
      "isUnique": false,
      "isId": false,
      "isReadOnly": false,
      "hasDefaultValue": false,
      "type": "number",
      "isGenerated": false,
      "isUpdatedAt": false
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
      "type": "number",
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
      "type": "string",
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
      "type": "string",
      "isGenerated": false,
      "isUpdatedAt": false
    },
    {
      "name": "createdAt",
      "kind": "scalar",
      "isList": false,
      "isRequired": false,
      "isUnique": false,
      "isId": false,
      "isReadOnly": false,
      "hasDefaultValue": false,
      "type": "number",
      "isGenerated": false,
      "isUpdatedAt": false
    },
    {
      "name": "updatedAt",
      "kind": "scalar",
      "isList": false,
      "isRequired": false,
      "isUnique": false,
      "isId": false,
      "isReadOnly": false,
      "hasDefaultValue": false,
      "type": "number",
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
      "type": "number",
      "isGenerated": false,
      "isUpdatedAt": false
    }
  ]
};