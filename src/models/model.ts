import { createClient } from "@/utils/supabase/client";
import axios from 'axios';
import { metaFields } from "./metafields";


type QueryParams = {
  orderBy?: any;
  page?: number;
  pageSize?: number;
  keyword?: string;
  [key: string]: any;
}

export abstract class Model {
  abstract tableName: string;
  abstract id: number | null;
  [key: string]: any; 

  // GET 요청을 통해 목록을 조회하는 메서드
  async list(queryParams: QueryParams): Promise<any[]> {
    const { page, pageSize, ...params } = queryParams;
    let query = new URLSearchParams();

    if (page) query.append('page', page.toString());
    if (pageSize) query.append('pageSize', pageSize.toString());

    Object.keys(params).forEach((key) => {
      query.append(key, params[key]);
    });

    try {
      const response = await axios.get(`/api/${this.tableName}?${query.toString()}`);
      return response.data;
    } catch (error) {
      throw new Error(`Error fetching list for ${this.tableName}`);
    }
  }

  // GET 요청을 통해 특정 항목을 조회하는 메서드
  async read(): Promise<Record<string, any> | null> {
    if (!(this.id || this.auth)) {
      return null;
    }

    try {
      let response;
      if (this.auth) {
        response = await axios.get(
          `/api/${this.tableName}?auth=${this.auth}`,
        );
      } else {
        response = await axios.get(
          `/api/${this.tableName}?id=${this.id}`,
        );
      }

      Object.assign(this, response.data);
      return this.toJSON();
    } catch (error) {
      const supabase = createClient();
      await supabase.auth.signOut();
      throw new Error(`Error fetching item with ID ${this.id} for ${this.tableName}`);
    }
  }

  // POST 요청을 통해 새 항목을 생성하는 메서드
  async create(): Promise<any> {
    if (!this.tableName) {
      throw new Error('Table name is required to create');
    }

    if (this.id) {
      throw new Error('ID is not allowed to create');
    }

    const body = this._getBody();

    try {
      const response = await axios.post(
        `/api/${this.tableName}`,
        body,
      );
      return response.data;
    } catch (error) {
      throw new Error(`Error creating item for ${this.tableName}`);
    }
  }

  // PUT 요청을 통해 항목을 업데이트하는 메서드
  async update(id: number): Promise<any> {
    const body = this._getBody();

    try {
      const response = await axios.put(
        `/api/${this.tableName}?id=${id}`,
        body,
        {
          headers: { 'Content-Type': 'application/json' }
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(`Error updating item with ID ${id} for ${this.tableName}`);
    }
  }

  // DELETE 요청을 통해 항목을 삭제하는 메서드
  async delete(): Promise<boolean> {
    if (!this.id) {
      throw new Error('ID is required to delete');
    }

    try {
      const response = await axios.delete(`/api/${this.tableName}?id=${this.id}`);
      return response.status === 200;
    } catch (error) {
      throw new Error(`Error deleting item with ID ${this.id} for ${this.tableName}`);
    }
  }

  private _getBody() {
    const body = { ...this };
    const getMetadataObj = metaFields[this.tableName as keyof typeof metaFields].reduce((acc: any, cur: any) => {
      acc[cur.name] = cur;
      return acc;
    }, {});

    for (const key in body) {
      if (key === 'id' && body[key] === null) {
        delete body[key];
      }
      if (body[key] === undefined) {
        delete body[key];
      }
      if (key === 'tableName') {
        delete body[key];
      }
      if (typeof body[key] === 'function') {
        delete body[key];
      }
      
      if (getMetadataObj[key] && !!getMetadataObj[key]?.relationName) {
        delete body[key];
      }

      if (key === 'createdAt' || key === 'updatedAt') {
        delete body[key];
      }
    }
    return body;
  }

  // Add this new method to get a plain object representation
  toJSON(): Record<string, any> {
    const plainObject: Record<string, any> = {};
    for (const key in this) {
      if (Object.prototype.hasOwnProperty.call(this, key) && typeof this[key] !== 'function') {
        plainObject[key] = this[key];
      }
    }
    return plainObject;
  }
}
