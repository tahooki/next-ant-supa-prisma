import { metaFields } from "@/models/metafields";

type MetaField = {
  name: string;
  kind: string;
  isList: boolean;
  isRequired: boolean;
  isId: boolean;
  type: string;
  relationName?: string;
  relationFromFields?: string[];
  relationToFields?: string[];
};

type MetaFieldsType = Omit<typeof metaFields, "enums">;

/**
 * Get the ID field metadata for a given model
 */
function getModelIdField(modelName: string): MetaField | undefined {
  const modelFields = metaFields[
    modelName.toLowerCase() as keyof MetaFieldsType
  ] as MetaField[];
  return modelFields?.find((field) => field.isId);
}

/**
 * Transform relation fields in the data object based on metadata
 */
export function transformRelationFields(
  modelName: string,
  data: Record<string, any>
): Record<string, any> {
  const transformedData: Record<string, any> = {};
  const modelFields = (metaFields as any)[modelName] as MetaField[];

  if (!modelFields || !Array.isArray(modelFields)) {
    return data;
  }

  for (const [key, value] of Object.entries(data)) {
    if (!value) continue;

    const field = modelFields.find((f: MetaField) => f.name === key);
    if (!field?.relationName) {
      transformedData[key] = value;
      continue;
    }

    const relatedModelName = field.type;
    const relatedModelIdField = getModelIdField(relatedModelName);

    if (!relatedModelIdField) {
      transformedData[key] = value;
      continue;
    }

    // Handle array relations
    if (Array.isArray(value)) {
      if (key === "tags") {
        transformedData[key] = {
          connectOrCreate: value.map((item: Record<string, any>) => ({
            where: {
              name: item.name,
            },
            create: {
              name: item.name,
            },
          })),
        };
      } else {
        transformedData[key] = {
          connect: value.map((item: Record<string, any>) => ({
            [relatedModelIdField.name]:
              typeof item === "object" ? item[relatedModelIdField.name] : item,
          })),
        };
      }
    }
    // Handle single relations
    else {
      transformedData[key] = {
        connect: {
          [relatedModelIdField.name]:
            typeof value === "object" ? value[relatedModelIdField.name] : value,
        },
      };
    }
  }

  return transformedData;
}

/**
 * Process data for Prisma create/update operations
 */
export function processPrismaData(modelName: string, data: any): any {
  try {
    return transformRelationFields(modelName, data);
  } catch (error) {
    console.error("Error processing Prisma data:", error);
    throw error;
  }
}
