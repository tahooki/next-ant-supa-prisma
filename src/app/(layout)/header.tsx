
const LayoutHeader = ({user}: {user?: any}) => {
  return <div>
    LayoutHeader
    {user && <div>
      {user?.email}
      <div>
      {
        user?.username
      }
      </div>
      
    </div>}
  </div>;
};

export default LayoutHeader;
