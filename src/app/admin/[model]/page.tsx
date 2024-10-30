import { metaFields } from "../../../models/metafields";
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

  console.log(model);
  const data = await fetch(`http://localhost:3000/api/${model}?${newSearchParams.toString()}`);
  const json = await data.json();
  const items = json.items;
  const totalCount = json.totalCount;
  return <AdminModelPageTemplate model={model} items={items} totalCount={totalCount} />;
}

export default AdminModelPage;