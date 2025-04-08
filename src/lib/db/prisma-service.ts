import { metaFields } from "@/models/metafields";
import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

type QueryParams = {
  orderBy?: any;
  page?: number;
  pageSize?: number;
  keyword?: string;
  [key: string]: any;
};

// Helper function to get model identifier field
function getModelIdentifierField(metadata: any[]) {
  const idField = metadata.find((field: any) => field.name === "id");
  if (idField) return "id";

  const nameField = metadata.find((field: any) => field.name === "name");
  if (nameField) return "name";

  return metadata[0].name;
}

// Helper function to get model metadata
function getModelMetadata(model: string) {
  return metaFields[model.toLowerCase() as keyof typeof metaFields] as any[];
}

// Helper function to get model includes
function getModelIncludes(metadata: any[]) {
  const include: any = {};
  for (const field of metadata) {
    const { name, relationName } = field;
    if (relationName) {
      include[name] = true;
    }
  }
  return Object.keys(include).length > 0 ? include : undefined;
}

export async function createModel(model: string, data: any) {
  if (!model || !(model in prisma)) {
    throw new Error("Invalid model");
  }

  const metadata = getModelMetadata(model);
  const include = getModelIncludes(metadata);

  const query = {
    data,
    include,
  };

  return await (prisma[model as keyof typeof prisma] as any).create(query);
}

export async function getModel(model: string, params: QueryParams) {
  if (!model || !(model in prisma)) {
    throw new Error("Invalid model");
  }

  const metadata = getModelMetadata(model);
  const identifierField = getModelIdentifierField(metadata);
  const include = getModelIncludes(metadata);

  // Single item fetch
  if (!params.page) {
    const identifierValue = params[identifierField];
    if (!identifierValue) {
      throw new Error("Identifier value is required");
    }

    const where: any = {};
    const metaDataObj = metadata.reduce((acc: any, field: any) => {
      acc[field.name] = field;
      return acc;
    }, {});

    for (const key in params) {
      const metaField = metaDataObj[key];
      if (!metaField) continue;

      if (metaField.type === "Int") {
        where[key] = Number(params[key]);
      } else {
        where[key] = params[key];
      }
    }

    return await (prisma[model as keyof typeof prisma] as any).findUnique({
      where,
      include,
    });
  }

  // List fetch with pagination
  const skip =
    params.page && params.pageSize ? (params.page - 1) * params.pageSize : 0;
  const where: any = {};
  const orConditions: any[] = [];
  const andConditions: any = {};
  const ignoreFields = ["auth", "createdAt", "updatedAt"];

  // Build search conditions
  for (const field of metadata) {
    const { name, type }: any = field;
    if (ignoreFields.includes(name)) continue;

    if (type === "string" && params?.keyword) {
      orConditions.push({
        [name]: {
          contains: params.keyword,
          mode: "insensitive",
        },
      });
    }

    if (params[name] && name !== "keyword") {
      if (type === "string") {
        andConditions[name] = params[name];
      } else if (type === "number") {
        andConditions[name] = Number(params[name]);
      } else if (type === "boolean") {
        andConditions[name] = params[name] === "true";
      }
    }

    // Handle range filters
    if (name.endsWith("At")) {
      if (params[`${name}_start`] || params[`${name}_end`]) {
        andConditions[name] = {};
        if (params[`${name}_start`])
          andConditions[name].gte = params[`${name}_start`];
        if (params[`${name}_end`])
          andConditions[name].lte = params[`${name}_end`];
      }
    }

    if (type === "number") {
      if (params[`${name}_gte`] || params[`${name}_lte`]) {
        andConditions[name] = {};
        if (params[`${name}_gte`])
          andConditions[name].gte = Number(params[`${name}_gte`]);
        if (params[`${name}_lte`])
          andConditions[name].lte = Number(params[`${name}_lte`]);
      }
    }
  }

  Object.assign(where, andConditions);
  if (orConditions.length > 0) {
    where.OR = orConditions;
  }

  // Handle ordering
  let orderBy = {};
  if (params.orderBy) {
    orderBy = params.orderBy.split(",").reduce((acc: any, key: string) => {
      if (key.startsWith("-")) {
        acc[key.substring(1)] = "desc";
      } else {
        acc[key] = "asc";
      }
      return acc;
    }, {});
  }

  const [totalCount, items] = await prisma.$transaction([
    (prisma[model as keyof typeof prisma] as any).count({ where }),
    (prisma[model as keyof typeof prisma] as any).findMany({
      where,
      orderBy,
      skip,
      take: Number(params.pageSize),
      include,
    }),
  ]);

  return { totalCount, items };
}

export async function updateModel(
  model: string,
  identifierValue: string | number,
  data: any
) {
  if (!model || !(model in prisma)) {
    throw new Error("Invalid model");
  }

  const metadata = getModelMetadata(model);
  const identifierField = getModelIdentifierField(metadata);
  const include = getModelIncludes(metadata);

  if (isNaN(Number(identifierValue))) {
    identifierValue = identifierValue;
  } else {
    identifierValue = Number(identifierValue);
  }

  const updateQuery = {
    where: {
      [identifierField]: identifierValue,
    },
    data,
    include,
  };

  return await (prisma[model as keyof typeof prisma] as any).update(
    updateQuery
  );
}

export async function deleteModel(
  model: string,
  identifierValue: string | number
) {
  if (!model || !(model in prisma)) {
    throw new Error("Invalid model");
  }

  const metadata = getModelMetadata(model);
  const identifierField = getModelIdentifierField(metadata);

  if (isNaN(Number(identifierValue))) {
    identifierValue = identifierValue;
  } else {
    identifierValue = Number(identifierValue);
  }

  return await (prisma[model as keyof typeof prisma] as any).delete({
    where: {
      [identifierField]: identifierValue,
    },
  });
}
