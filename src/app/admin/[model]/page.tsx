import { metaFields } from "@/models/metafields";
import AdminModelPageTemplate from "./page-template";

const AdminModelPage = async ({params}: any) => {
  const { model } = await params;
  if (!model) {
    return <div>Invalid model</div>;
  }

  if (!(model in metaFields)) {
    return <div>Invalid model</div>;
  }

  console.log(model);
  const data = await fetch(`http://localhost:3000/api/${model}?page=1&pageSize=10`);
  console.log('data', data);
  const json = await data.json();
  console.log('json', json);
  const items = json.items;
  const totalCount = json.totalCount;
  return <AdminModelPageTemplate model={model} items={items} totalCount={totalCount} />;
}

export default AdminModelPage;