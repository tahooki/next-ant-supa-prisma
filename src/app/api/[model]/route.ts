import {
  createModel,
  deleteModel,
  getModel,
  updateModel,
} from "@/lib/prisma-service";
import { processPrismaData } from "@/lib/prisma-utils";
import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// 모델의 식별자 필드를 찾는 함수
function getModelIdentifierField(metadata: any[]) {
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
  try {
    const { model } = await params;
    console.log(model);
    const queryParams = {
      keyword: request.nextUrl.searchParams.get("keyword") || undefined,
      orderBy: request.nextUrl.searchParams.get("orderBy") || undefined,
      page: Number(request.nextUrl.searchParams.get("page")) || undefined,
      pageSize:
        Number(request.nextUrl.searchParams.get("pageSize")) || undefined,
      ...Object.fromEntries(request.nextUrl.searchParams.entries()),
    };

    const result = await getModel(model, queryParams);
    return NextResponse.json(queryParams.page ? result : result || null, {
      status: 200,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: error.message === "Invalid model" ? 400 : 500 }
    );
  }
}

// 새로운 항목을 생성하는 함수 (POST 요청)
export async function POST(request: NextRequest, { params }: any) {
  try {
    const { model } = await params;

    // 사용자 인증 추가
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 401 });
    }

    const data = await request.json();
    const processedData = processPrismaData(model, data);

    const newItem = await createModel(model, processedData);
    return NextResponse.json(newItem, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: error.message === "Invalid model" ? 400 : 500 }
    );
  }
}

// 항목을 업데이트하는 함수 (PATCH 요청)
export async function PATCH(request: NextRequest, { params }: any) {
  try {
    const { model } = await params;
    const data = await request.json();

    // 자신의 아이디 조회
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 401 });
    }

    const identifierValue =
      request.nextUrl.searchParams.get("id") ||
      request.nextUrl.searchParams.get("name");

    if (!identifierValue) {
      return NextResponse.json(
        { error: "Identifier is required" },
        { status: 400 }
      );
    }

    // 권한 체크를 위한 기존 데이터 조회
    const existingItem = await getModel(model, { id: identifierValue });

    if (user.role !== "admin") {
      if (existingItem?.userId !== user.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    const processedData = processPrismaData(model, data);
    const updatedItem = await updateModel(
      model,
      identifierValue,
      processedData
    );

    return NextResponse.json(updatedItem, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: error.message === "Invalid model" ? 400 : 500 }
    );
  }
}

// 항목을 삭제하는 함수 (DELETE 요청)
export async function DELETE(request: NextRequest, { params }: any) {
  try {
    const { model } = await params;

    // 자신의 아이디 조회
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 401 });
    }

    const identifierValue =
      request.nextUrl.searchParams.get("id") ||
      request.nextUrl.searchParams.get("name");

    if (!identifierValue) {
      return NextResponse.json(
        { error: "Identifier is required" },
        { status: 400 }
      );
    }

    // 권한 체크를 위한 기존 데이터 조회
    const existingItem = await getModel(model, { id: identifierValue });

    if (user.role !== "admin") {
      if (existingItem?.userId !== user.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    await deleteModel(model, identifierValue);
    return NextResponse.json(
      { message: "Successfully deleted" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: error.message === "Invalid model" ? 400 : 500 }
    );
  }
}
