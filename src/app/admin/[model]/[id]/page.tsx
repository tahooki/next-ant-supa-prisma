import { getModelInstance } from "@/utils/model-helper";
import DetailPageTemplate from "./page-template";

const DetailPage = async ({ params }: any) => {
  const { id, model } = await params;
  
  // 새로운 항목 생성 시 id는 'new'로 들어옴
  
  let data = null;
  if (id !== 'new') {
    const modelInstance = getModelInstance(model);
    console.log('modelInstance : ', params);
    modelInstance.id = parseInt(id);
    console.log('modelInstance.id : ', modelInstance);
    data = await modelInstance.read();
  }

  console.log('data : 1212', data, data?.bio);

  return <DetailPageTemplate model={model} initialData={data} isNew={id === 'new'} />;
};

export default DetailPage;
