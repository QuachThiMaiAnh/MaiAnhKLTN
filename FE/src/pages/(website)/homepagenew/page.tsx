import React from "react";
import ChatPopup from "../chatpopup/page";
import Collections from "./_componnents/Collections";
import FeatureCards from "./_componnents/FeatureCards";
import NewArrivals from "./_componnents/NewArrivals";
import OurSeries from "./_componnents/OurSeries";
import Products from "./_componnents/Products";
import Slider from "./_componnents/Slider";
import SubscribeSection from "./_componnents/SubscribeSection";
import SpecialOffers from "./_componnents/SpecialOffers";
import ChatPopup1 from "../chatpopup1/page";
import { useUserContext } from "@/common/context/UserProvider";
// import Accessories from "./_componnents/Accessories";
// import { io } from "socket.io-client";
// import { useParams } from "react-router-dom";

// const socket = io("http://localhost:3000");

const HomePageNew = () => {
  // useEffect(() => {
  //   socket.on("messageRecieved", (newMessageRecieved) => {
  //     console.log("message Recieved", newMessageRecieved);
  //   });
  React.useEffect(() => {
    document.title = "FABRICFOCUS"; // Đặt tiêu đề cho trang
  }, []);

  //   // return () => {
  //   //   socket.off("newMessage");
  //   // };
  // }, []);

  return (
    <div className="bg-zinc-100">
      <main className="bg-white  lg:mx-[50px] mx-[14px] ">
        <Slider />
        <Collections />
        <Products />
        <SpecialOffers />
        <NewArrivals />
        <OurSeries />
        {/* <Accessories /> */}
        <FeatureCards />
        <SubscribeSection />
        <ChatPopup />
        <ChatPopup1 />
      </main>
    </div>
  );
};

export default HomePageNew;
