import React from "react";
const Layout = (props) => {
  const { children, isLoading, hasErrors } = props;

  return (
    <>
      <div className="container">
        {children}
      </div>
    </>
  );
};

export default Layout;
