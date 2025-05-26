import React from "react";

const Container = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="p-7">
      <div className="max-w-[1300px] mx-auto">{children}</div>
    </div>
  );
};

export default Container;
