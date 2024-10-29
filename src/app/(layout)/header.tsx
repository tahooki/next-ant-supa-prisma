
const LayoutHeader = ({user}: {user?: any}) => {
  return <div>
    LayoutHeader
    {user && <div>
      {user?.email}
      <div>
      </div>
      
    </div>}
  </div>;
};

export default LayoutHeader;
