import React from "react";
const Layout = (props) => {
  const { children, isLoading, hasErrors } = props;

  return (
    <>
      <div className="container">
        {isLoading ? (
          <div className="content">Loading ...</div>
        ) : hasErrors ? (
          <div className="content">
            An error occurred while authenticating ...
          </div>
        ) : (
          children
        )}
      </div>
    </>
  );
};

export default Layout;
