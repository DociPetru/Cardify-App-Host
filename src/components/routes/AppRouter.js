import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Switch } from "react-router-dom";

import LogInPage from "../LogInPage";
import MainPage from "../MainPage";
import ProfilePage from "../ProfilePage";
import NotFoundPage from "../NotFoundPage";

import { ImageProvider } from "../../ImageContext";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          exact
          path="/"
          element={
            <ImageProvider>
              <LogInPage />{" "}
            </ImageProvider>
          }
        />
        <Route
          path="/main"
          element={
            <ImageProvider>
              <MainPage />
            </ImageProvider>
          }
        />
        <Route path="/profile" element={<ProfilePage />} />
        <Route element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
