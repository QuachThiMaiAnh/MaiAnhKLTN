import React from "react";
import BestCustomersSupport from "./_components/BestCustomersSupport";
import ChooseTheBest from "./_components/ChooseTheBest";
import OurServices from "./_components/OurServices";
import Professionals from "./_components/Professionals";
import WhatWeDo from "./_components/WhatWeDo";

const PageServices = () => {
  React.useEffect(() => {
    document.title = "Dịch Vụ";
  }, []);
  return (
    <div className="w-full">
      {/*our services */}
      <OurServices />
      {/* End our services */}
      {/*  choose the best */}
      <ChooseTheBest />
      {/* end choose the best  */}
      {/* hour services what we do*/}
      <WhatWeDo />
      {/* end hour services what we do*/}
      {/* choice of the professionals */}
      <Professionals />
      {/* end choice of the professionals */}
      {/* best customers support */}
      <BestCustomersSupport />
      {/* End best customers support */}
    </div>
  );
};

export default PageServices;
