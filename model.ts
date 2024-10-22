import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export abstract class Model {
  abstract tableName: string;
  abstract id: number | null;

  async create(data: any): Promise<any> {
    return prisma.$transaction(async (tx: any) => {
      const result = await (tx[this.tableName as keyof typeof tx] as any).create({
        data: this.prepareManyToManyData(data),
      });
      await this.handleManyToMany(tx, result.id, data);
      return result;
    });
  }

  async update(id: number, data: any): Promise<any> {
    return prisma.$transaction(async (tx: any) => {
      const result = await (tx[this.tableName as keyof typeof tx] as any).update({
        where: { id },
        data: this.prepareManyToManyData(data),
      });
      await this.handleManyToMany(tx, id, data);
      return result;
    });
  }
  async delete(): Promise<any> {
    if (!this.id) {
      return null;
    }
    return (prisma[this.tableName as keyof typeof prisma] as any).delete({
      where: { id: this.id },
    });
  }

  async read(): Promise<any | null> {
    if (!this.id) {
      return null;
    }
    return (prisma[this.tableName as keyof typeof prisma] as any).findUnique({
      where: { id: this.id },
    })
  }

  protected prepareManyToManyData(data: any): any {
    // Override this method in child classes to handle ManyToMany relations
    return data;
  }

  protected async handleManyToMany(tx: any, id: number, data: any): Promise<void> {
    // Override this method in child classes to handle ManyToMany relations
  }
}
