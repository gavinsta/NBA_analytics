import { User } from "../../../server/types/User"
import React, { createContext, useState, useContext } from "react";
import { isMobile } from "react-device-detect";
import { tryGetUser, tryCreateNewUser } from "../utils/DataUtils"
import { useToast } from "@chakra-ui/react"
import { UserQueryResponse } from "../../../server/types/QueryResponse";
interface ContextType {
  user: User | null;
  createNewUser: (user: User) => void;
  login: (email: string, password: string) => void;
  logout: () => void;
}

const URL = "http://localhost:8080"
export const UserContext = createContext<ContextType>({
  user: null,
  login: () => { },
  logout: () => { },
  createNewUser: () => { }
});

export const UserContextProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const toast = useToast();
  const createNewUser = async (newUser: User) => {
    const res: UserQueryResponse = await tryCreateNewUser(
      URL + "/signup", newUser
    )

    if (res.status === "error") {
      toast({
        status: "error",
        title: res.title,
        description: res.text
      })
    }
    else {
      toast({
        status: "success",
        title: res.title,
        description: res.text
      })

      setUser(res.user)
    }
  }

  const login = async (email: string, password: string) => {
    const res: ({ status: string, title: string, user: User | null }) = await tryGetUser(
      URL + "/login", email, password
    )
    if (res.status === "error") {
      toast({
        status: "error",
        title: "Invalid Email or Password",
        description: res.title,
      })
    }
    else {
      toast({
        status: "success",
        title: "Logged in",
        description: res.title,
      })

      setUser(res.user)
    }
  }

  const logout = () => {
    setUser(null)
    toast({
      status: "info",
      title: "Logged out"
    })
  }
  return (
    <UserContext.Provider
      value={{
        user,
        createNewUser,
        login,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error(
      "useFantasyTeam must be used within a UserContextProvider"
    );
  }
  return context;
};