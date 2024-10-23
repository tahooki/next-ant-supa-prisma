"use client";

const HomeTemplate = ({user}: {user?: any}) => {
  return <div>
    HomeTemplate

    <div>
      123123123
      {user?.email}
    </div> 
  </div>;
};

export default HomeTemplate;  