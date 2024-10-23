
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

    const response = await fetch(`/api/${this.tableName}?${query.toString()}`);
    
    if (!response.ok) {
      throw new Error(`Error fetching list for ${this.tableName}`);
    }

    // 지금 모델로 변환해서 반환하기
    const data = await response.json();

    return data.map((item: any) => new (this.constructor as any)(item));
  }

  // GET 요청을 통해 특정 항목을 조회하는 메서드
  async read(): Promise<any | null> {
    if (!this.id) {
      throw new Error('ID is required to read');
    }

    const response = await fetch(`/api/${this.tableName}?id=${this.id}`);
    
    if (!response.ok) {
      throw new Error(`Error fetching item with ID ${this.id} for ${this.tableName}`);
    }

    const data = await response.json();
    
    this.constructor(data);

    return this;
  }

  // POST 요청을 통해 새 항목을 생성하는 메서드
  async create(data: any): Promise<any> {
    const response = await fetch(`/api/${this.tableName}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Error creating item for ${this.tableName}`);
    }

    return response.json();
  }

  // PUT 요청을 통해 항목을 업데이트하는 메서드
  async update(id: number, data: any): Promise<any> {
    const response = await fetch(`/api/${this.tableName}?id=${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Error updating item with ID ${id} for ${this.tableName}`);
    }

    return response.json();
  }

  // DELETE 요청을 통해 항목을 삭제하는 메서드
  async delete(): Promise<any> {
    if (!this.id) {
      throw new Error('ID is required to delete');
    }

    const response = await fetch(`/api/${this.tableName}?id=${this.id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Error deleting item with ID ${this.id} for ${this.tableName}`);
    }

    return response.ok;
  }

}
