import initAxios from "@/app/init-axios";
import { metaFields } from "@/models/metafields";
import axios from "axios";
import AdminModelPageTemplate from "./page-template";
const AdminModelPage = async ({params, searchParams}: any) => {
  const { model } = await params;
  const { ...queryParams } = await searchParams;

  queryParams.page = queryParams.page || 1;
  queryParams.pageSize = queryParams.pageSize || 10;

  const newSearchParams = new URLSearchParams(queryParams);

  if (!model) {
    return <div>Invalid model</div>;
  }

  if (!(model in metaFields)) {
    return <div>Invalid model</div>;
  }
  await initAxios();
  const data = await axios.get(`/api/${model}?${newSearchParams.toString()}`);
  const json = data.data;
  const items = json.items;
  console.log('items', items);
  const totalCount = json.totalCount;
  return <AdminModelPageTemplate model={model} items={items} totalCount={totalCount} />;
}

export default AdminModelPage;