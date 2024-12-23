import { metaFields } from "@/models/metafields";
import axios from 'axios';

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
      console.log('this.auth : ', this.auth);
      console.log('this.id : ', this.id);
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
      console.log('error : ', error);
      // const supabase = createClient();
      // await supabase.auth.signOut();
      // throw new Error(`Error fetching item with ID ${this.id} for ${this.tableName}`);
      return null; // Add this line
    }
  }

  save() {
    if (this.id) {
      return this.update();
    }
    return this.create();
  }

  // POST 요청을 통해 새 항목을 생성하는 메서드
  async create(): Promise<any> {
    console.log('create this.tableName : ', this.tableName);
    if (!this.tableName) {
      throw new Error('Table name is required to create');
    }

    if (this?.id) {
      throw new Error('ID is not allowed to create');
    }

    const body = this._getBody();

    console.log('body : ', body);
    console.log('this.tableName : ', this.tableName);

    try {
      const response = await axios.post(
        `/api/${this.tableName}`,
        body,
      );
      const data = response.data;
      for (const key in data) {
        this[key] = data[key];
      }
      return this;
    } catch (error) {
      console.log('error : ', error);
      throw new Error(`Error creating item for ${this.tableName}`);
    }
  }

  // patch 요청을 통해 항목을 업데이트하는 메서드
  async update(): Promise<any> {
    console.log('update started : ', this.tableName);
    const body = this._getBody();

    console.log('body : ', body);
    console.log('this.tableName : ', this.tableName);

    try {
      const response = await axios.patch(
        `/api/${this.tableName}?id=${this.id}`,
        body
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

    console.log('getBody : ', getMetadataObj);

    for (const key in body) {
      if (key === 'id' && body[key] === null) {
        delete body[key];
      }
      if (key === 'content') {
        this._setImagesWithContent();
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
        if (getMetadataObj[key]?.isList) {
          body[key] = body[key].map((item: any) => { 
            if (item.id) {
              return { id: item.id };
            }
           });
        } else {
          body[`${key}Id`] = body[key]?.id || null;
          delete body[key];
        }
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
}
