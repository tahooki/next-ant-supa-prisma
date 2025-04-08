import React from "react";
import Term from "../../(components)/term";

// parma이 id가 있음
const ServiceTermPage = async ({ params }: any) => {
  const termDate = params.date;
  return <Term termType="privacy" date={termDate} />;
};

export default ServiceTermPage;
