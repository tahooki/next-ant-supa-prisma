import { createClient } from '@/utils/supabase/server';
import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { metaFields } from '../../../models/metafields';

const prisma = new PrismaClient();
// QueryParams 타입 정의
type QueryParams = {
  orderBy?: any;
  page?: number;
  pageSize?: number;
  keyword?: string;
  [key: string]: any;
};

// 목록을 조회하는 함수 (GET 요청)
export async function GET(request: NextRequest, { params }: any) {
  const { model } = await params;
  console.log('model : ', model, request.nextUrl.searchParams.get('id'));

  const queryParams: QueryParams = {
    keyword: request.nextUrl.searchParams.get('keyword') || undefined,
    orderBy: request.nextUrl.searchParams.get('orderBy') || undefined,
    page: Number(request.nextUrl.searchParams.get('page')) || undefined,
    pageSize: Number(request.nextUrl.searchParams.get('pageSize')) || undefined,
    ...Object.fromEntries(request.nextUrl.searchParams.entries()),
  };

  if (!model || !(model in prisma)) {
    return NextResponse.json({ error: 'Invalid model' }, { status: 400 });
  }

  const metadata = metaFields[model.toLowerCase() as keyof typeof metaFields];
  const metaDataObj = metadata.reduce((acc: any, field: any) => {
    acc[field.name] = field;
    return acc;
  }, {});
  if (!queryParams.page) {
    console.log('request.nextUrl.searchParams : ', request.nextUrl.searchParams.get('id'));
    if (!(request.nextUrl.searchParams.get('id') || request.nextUrl.searchParams.get('name') || request.nextUrl.searchParams.get('auth') || request.nextUrl.searchParams.get('email') || request.nextUrl.searchParams.get('title'))) {
      return NextResponse.json({ error: 'Invalid query parameters' }, { status: 400 });
    }

    if (request.nextUrl.searchParams.get('id') === 'null') {
      return NextResponse.json({ error: 'Invalid query parameters' }, { status: 400 });
    }
    const where: any = {};
    for (const key in queryParams) {
      const metaField = metaDataObj[key];
      if (!metaField) {
        continue;
      }
      if (metaField.type === 'Int') {
        where[key] = Number(queryParams[key]);
      } else {
        where[key] = queryParams[key];
      }
    }

    console.log('where : ', where);

    try {
      const item = await (prisma[model as keyof typeof prisma] as any).findUnique({
        where,
      });

      return NextResponse.json(item);
    } catch (error) {
      return NextResponse.json({ error: 'Error fetching data' }, { status: 500 });
    }

  } else {
    let orderBy = {};
    let where: any = {};
    let skip = 0;
  
    if (queryParams.page && queryParams.pageSize) {
      skip = (queryParams.page - 1) * queryParams.pageSize;
    }
  
    // getFieldMetadata 사용

    const orConditions: any[] = [];
    const andConditions: any = {};
    const ignoreFields: string[] = ['auth', 'createdAt', 'updatedAt'];

    for (const field of metadata) {
      const { name, type }: any = field;
      if (ignoreFields.includes(name)) {
        continue;
      }
      // Handle string fields with keyword search (OR condition)
      if (type === 'string' && queryParams?.keyword) {
        orConditions.push({
          [name]: {
            contains: queryParams.keyword,
            mode: 'insensitive'
          }
        });
      }

      // Direct field matching (AND condition)
      if (queryParams[name] && name !== 'keyword') {
        if (type === 'string') {
          andConditions[name] = queryParams[name];
        } else if (type === 'number') {
          andConditions[name] = Number(queryParams[name]);
        } else if (type === 'boolean') {
          andConditions[name] = queryParams[name] === 'true';
        }
      }
  
      // Handle range filters for "At" fields (dates)
      if (name.endsWith('At')) {
        if (queryParams[`${name}_start`] || queryParams[`${name}_end`]) {
          andConditions[name] = {};
          if (queryParams[`${name}_start`]) {
            andConditions[name].gte = queryParams[`${name}_start`];
          }
          if (queryParams[`${name}_end`]) {
            andConditions[name].lte = queryParams[`${name}_end`];
          }
        }
      }
  
      // Handle numeric fields with gte/lte
      if (type === 'number') {
        if (queryParams[`${name}_gte`] || queryParams[`${name}_lte`]) {
          andConditions[name] = {};
          if (queryParams[`${name}_gte`]) {
            andConditions[name].gte = Number(queryParams[`${name}_gte`]);
          }
          if (queryParams[`${name}_lte`]) {
            andConditions[name].lte = Number(queryParams[`${name}_lte`]);
          }
        }
      }
    }

    // Combine OR and AND conditions
    where = {
      ...andConditions,
      ...(orConditions.length > 0 ? { OR: orConditions } : {})
    };

    // 정렬 조건 처리
    if (queryParams.orderBy) {
      orderBy = queryParams.orderBy.split(',').map((key: string) => {
        if (key.startsWith('-')) {
          return { [key.substring(1)]: 'desc' };
        }
        return { [key]: 'asc' };
      });
    }

    console.log('where : ', where);
    console.log('orderBy : ', orderBy);
    console.log('skip : ', skip);
    console.log('pageSize : ', Number(queryParams.pageSize));
  
    // 데이터베이스 조회
    try {
      const [totalCount, items] = await prisma.$transaction([
        (prisma[model as keyof typeof prisma] as any).count({
          where,
        }),
        (prisma[model as keyof typeof prisma] as any).findMany({
          where,
          orderBy,
          skip,
          take: Number(queryParams.pageSize),
        }),
      ]);
      return NextResponse.json({ totalCount, items });
    } catch (error) {
      throw new Error(`Error fetching list for model ${model}: ${error}`);
    }

    // let where: any = {};
    // let orderBy: any = {};
    // let skip = 0;

    // if (queryParams.page && queryParams.pageSize) {
    //   skip = (queryParams.page - 1) * queryParams.pageSize;
    // }

    // if (queryParams.keyword) {
    //   where = {
    //     ...where,
    //   };
    // }

    // if (queryParams.orderBy) {
    //   orderBy = queryParams.orderBy.split(',').map((key: string) => {
    //     if (key.startsWith('-')) {
    //       return { [key.substring(1)]: 'desc' };
    //     }
    //     return { [key]: 'asc' };
    //   });
    // }

        // const include: any = {};
    // const fields = this.getFieldMetadata();

    // if (queryParams?.requestUserId) {
    //   fields.forEach((field: any) => {
    //     const { name, type } = field;
    //     if (name.includes('Bookmarks')) {
    //       include[name] = {
    //         bookmarks: {
    //           where: {
    //             userId: queryParams.requestUserId,  // Filter by the current user
    //             bookmarkType: this.tableName.toUpperCase(),
    //           },
    //           select: { id: true },  // We just need to know if the bookmark exists
    //         },
    //       }
    //     }
    //   });
    // }

    // return (prisma[this.tableName as keyof typeof prisma] as any).findMany({
    //   orderBy,
    //   skip,
    //   take: pageSize,
    //   where,
    //   // include
    // });
    // try {
    //   const items = await (prisma[model as keyof typeof prisma] as any).findMany({
    //     where,
    //     orderBy,
    //     skip,
    //     take: queryParams.pageSize,
    //   });
    //   return NextResponse.json(items);
    // } catch (error) {
    //   return NextResponse.json({ error: 'Error fetching list' }, { status: 500 });
    // }
  }
}

// 새로운 항목을 생성하는 함수 (POST 요청)
export async function POST(request: NextRequest, { params }: any) {
  const { model } = await params;

  console.log('model : ', model, Object.keys(prisma));

  if (!model || !(model in prisma)) {
    return NextResponse.json({ error: 'Invalid model' }, { status: 400 });
  }

  const data = await request.json();
  console.log('data : ', data);
  
  const newItem = await (prisma[model as keyof typeof prisma] as any).create({
    data,
  });
  return NextResponse.json(newItem, { status: 201 });
}

// 항목을 업데이트하는 함수 (PATCH 요청)
export async function PATCH(request: NextRequest, { params }: any) {
  const { model } = await params;
  const id = request.nextUrl.searchParams.get('id');

  if (!model || !(model in prisma)) {
    return NextResponse.json({ error: 'Invalid model' }, { status: 400 });
  }

  if (!id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }

  // 자신의 아이디 조회
  const supabase = await createClient();
  
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 400 });
  }

  //해당 데이터 한번 불러와서 같은 유저인지 확인하기
  const item = await (prisma[model as keyof typeof prisma] as any).findUnique({
    where: { id: Number(id) },
  });

  if (user.role !== 'admin') {
    if (item?.auth !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  try {
    const data = await request.json();
    const updatedItem = await (prisma[model as keyof typeof prisma] as any).update({
      where: { id: Number(id) },
      data,
    });
    return NextResponse.json(updatedItem);
  } catch (error) {
    return NextResponse.json({ error: 'Error updating item' }, { status: 500 });
  }
}

// 항목을 삭제하는 함수 (DELETE 요청)
export async function DELETE(request: NextRequest, { params }: any) {
  const { model } = await params;
  const id = request.nextUrl.searchParams.get('id');

  if (!model || !(model in prisma)) {
    return NextResponse.json({ error: 'Invalid model' }, { status: 400 });
  }

  if (!id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }

  // 자신의 아이디 조회
  const supabase = await createClient();
  
  const {
    data: { user },
  } = await supabase.auth.getUser();  

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 400 });
  }

  //해당 데이터 한번 불러와서 같은 유저인지 확인하기
  const item = await (prisma[model as keyof typeof prisma] as any).findUnique({
    where: { id: Number(id) },
  });

  if (user.role !== 'admin') {
    if (item?.userId !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  try {
    await (prisma[model as keyof typeof prisma] as any).delete({
      where: { id: Number(id) },
    });
    return NextResponse.json(null, { status: 204 });
  } catch (error) {
    return NextResponse.json({ error: 'Error deleting item' }, { status: 500 });
  }
}
