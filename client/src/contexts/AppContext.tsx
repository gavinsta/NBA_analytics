

import React, { createContext, useState, useContext } from "react";
import { isMobile } from "react-device-detect";
interface ContextType {
  URL: string
}

export const AppContext = createContext<ContextType>({
  URL: "",
});

export const AppContextProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const URL = process.env.REACT_APP_URL ?? "http://localhost:8080"
  // const URL = "http://localhost:8080"//
  return (
    <AppContext.Provider
      value={{
        URL
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error(
      "useAppContext must be used within a AppContextProvider"
    );
  }
  return context;
};