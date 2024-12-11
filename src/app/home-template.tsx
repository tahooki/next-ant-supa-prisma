"use client";

const HomeTemplate = ({user}: {user?: any}) => {
  return <div>
    <div>
      {user?.email}
    </div> 
  </div>;
};

export default HomeTemplate;  