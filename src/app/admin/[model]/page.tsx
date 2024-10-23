const AdminModelPage = async ({params}: {params: {model: string}}) => {
  const { model } = params;
  console.log(model);
  const data = await fetch(`/api/${model}`);
  console.log(data);
  return <div>
    {model}AdminModelPage
  </div>;
}

export default AdminModelPage;