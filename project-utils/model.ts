import { metaFields } from "@/models/metafields";
import axios from "axios";

type QueryParams = {
  orderBy?: any;
  page?: number;
  pageSize?: number;
  keyword?: string;
  [key: string]: any;
};

export abstract class Model {
  abstract tableName: string;
  [key: string]: any;

  // identifier를 추상 메서드에서 구현된 getter로 변경
  get identifier(): string | number | undefined {
    const metadata = metaFields[
      this.tableName as keyof typeof metaFields
    ] as any[];
    if (!metadata) return undefined;

    // id 필드가 있으면 id를 사용
    const idField = metadata.find((field: any) => field.name === "id");
    if (idField) {
      return this.id;
    }
    // id가 없으면 name을 사용
    const nameField = metadata.find((field: any) => field.name === "name");
    if (nameField) {
      return this.name;
    }
    // 둘 다 없으면 첫 번째 필드를 사용
    return this[metadata[0].name];
  }

  // GET 요청을 통해 목록을 조회하는 메서드
  async list(queryParams: QueryParams): Promise<any[]> {
    const { page, pageSize, ...params } = queryParams;
    let query = new URLSearchParams();

    if (page) query.append("page", page.toString());
    if (pageSize) query.append("pageSize", pageSize.toString());

    Object.keys(params).forEach((key) => {
      query.append(key, params[key]);
    });

    try {
      const response = await axios.get(
        `/api/${this.tableName}?${query.toString()}`
      );
      return response.data;
    } catch (error) {
      throw new Error(`Error fetching list for ${this.tableName}`);
    }
  }

  // GET 요청을 통해 특정 항목을 조회하는 메서드
  async read(): Promise<Record<string, any> | null> {
    if (!(this.identifier || this.auth)) {
      return null;
    }

    try {
      let response;
      if (this.auth) {
        response = await axios.get(`/api/${this.tableName}?auth=${this.auth}`);
      } else {
        const identifierField = this.getIdentifierField();
        response = await axios.get(
          `/api/${this.tableName}?${identifierField}=${this.identifier}`
        );
      }

      Object.assign(this, response.data);
      return this.toJSON();
    } catch (error) {
      throw new Error(`Error fetching item for ${this.tableName}`);
    }
  }

  save() {
    if (this.identifier) {
      return this.update();
    }
    return this.create();
  }

  // POST 요청을 통해 새 항목을 생성하는 메서드
  async create(): Promise<any> {
    if (!this.tableName) {
      throw new Error("Table name is required to create");
    }

    if (this?.identifier) {
      throw new Error("Identifier is not allowed to create");
    }

    const body = this.getBody();

    try {
      const response = await axios.post(`/api/${this.tableName}`, body);
      const data = response.data;
      for (const key in data) {
        this[key] = data[key];
      }
      return this;
    } catch (error) {
      throw new Error(`Error creating item for ${this.tableName}`);
    }
  }

  // patch 요청을 통해 항목을 업데이트하는 메서드
  async update(): Promise<any> {
    const body = this.getBody();

    try {
      const identifierField = this.getIdentifierField();
      const response = await axios.patch(
        `/api/${this.tableName}?${identifierField}=${this.identifier}`,
        body
      );
      return response.data;
    } catch (error) {
      throw new Error(
        `Error updating item with identifier ${this.identifier} for ${this.tableName}`
      );
    }
  }

  // DELETE 요청을 통해 항목을 삭제하는 메서드
  async delete(): Promise<boolean> {
    if (!this.identifier) {
      throw new Error("Identifier is required to delete");
    }

    try {
      const identifierField = this.getIdentifierField();
      const response = await axios.delete(
        `/api/${this.tableName}?${identifierField}=${this.identifier}`
      );
      return response.status === 200;
    } catch (error) {
      throw new Error(
        `Error deleting item with identifier ${this.identifier} for ${this.tableName}`
      );
    }
  }

  public getBody() {
    const body = { ...this };
    const getMetadataObj = (
      metaFields[this.tableName as keyof typeof metaFields] as any[]
    ).reduce((acc: any, cur: any) => {
      acc[cur.name] = cur;
      return acc;
    }, {});

    for (const key in body) {
      if (key === "id" && body[key] === null) {
        delete body[key];
      }
      if (key === "content") {
        this._setImagesWithContent();
      }
      if (body[key] === undefined) {
        delete body[key];
      }
      if (key === "tableName") {
        delete body[key];
      }
      if (typeof body[key] === "function") {
        delete body[key];
      }

      if (
        getMetadataObj[key] &&
        !!getMetadataObj[key]?.relationName &&
        body[key]
      ) {
        if (getMetadataObj[key]?.isList && Array.isArray(body[key])) {
          body[key] = body[key].map((item: any) => {
            if (item?.getBody) {
              return item.getBody();
            } else {
              return item;
            }
          });
        } else {
          try {
            if (body[key]?.getBody) {
              body[key] = body[key].getBody();
            } else {
              return body[key];
            }
          } catch (error) {
            throw new Error("Error getting body for " + key);
          }
        }
      }

      if (key === "createdAt" || key === "updatedAt") {
        delete body[key];
      }
    }
    return body;
  }

  // Add this new method to get a plain object representation
  toJSON(): Record<string, any> {
    const plainObject: Record<string, any> = {};
    for (const key in this) {
      if (
        Object.prototype.hasOwnProperty.call(this, key) &&
        typeof this[key] !== "function"
      ) {
        plainObject[key] = this[key];
      }
    }
    return plainObject;
  }

  _setImagesWithContent(): void {
    if (!this?.images || !this?.content) {
      return;
    }

    for (let index = this.images.length - 1; index >= 0; index--) {
      const imageItem = this.images[index];
      if (this.content.includes(imageItem.url)) {
        this.images.splice(index, 1);
      }
    }
  }

  // getIdentifierField 메서드는 이제 identifier getter와 중복되므로 제거하고
  // identifier getter를 사용하도록 수정
  protected getIdentifierField(): string {
    const metadata = metaFields[
      this.tableName as keyof typeof metaFields
    ] as any[];
    // id 필드가 있으면 id를 사용
    const idField = metadata.find((field: any) => field.name === "id");
    if (idField) {
      return "id";
    }
    // id가 없으면 name을 사용
    const nameField = metadata.find((field: any) => field.name === "name");
    if (nameField) {
      return "name";
    }
    // 둘 다 없으면 첫 번째 필드를 사용
    return metadata[0].name;
  }
}
