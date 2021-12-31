import React from "react";

import Header from "./header/header";
import Main from "./main/main";
import Footer from "./footer/footer";

import { NotificationProvider } from "../NotificationContext";

const MainPage = () => {
  return (
    <div>
      <NotificationProvider>
        <Header />
        <Main />
        <Footer />
      </NotificationProvider>
    </div>
  );
};

export default MainPage;
