
import { useNavigate } from "react-router-dom";
import { createContext, useContext, useEffect, useState } from "react";

import { IUser } from "@/types/types";
import { getCurrentUser } from "@/lib/appwrite/api";


export const INITIAL_USER:IUser = {
  id: '',
  username: '',
  name: '',
  email: '',
  bio: '',
  imageUrl: '',
};

const INITIAL_STATE = {
  user: INITIAL_USER,
  isLoading: false,
  isAuthenticated: false,
  setUser: () => {},
  setIsAuthenticated: () => {},
  checkAuthUser: async () => false as boolean,
};

type IContextType = {
  user: IUser;
  isLoading: boolean;
  setUser: React.Dispatch<React.SetStateAction<IUser>>;
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  checkAuthUser: () => Promise<boolean>;
};

const AuthContext = createContext<IContextType>(INITIAL_STATE);

export function AuthProvider  ({ children }: { children: React.ReactNode })  {
  const [user, setUser] = useState<IUser>(INITIAL_USER);
  const [isLoading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
   const navigate=useNavigate()
  const checkAuthUser = async () => {
    setLoading(true)
    try {
      const currentAccount = await getCurrentUser(); 
      if(currentAccount){
        setUser({
           id: currentAccount.$id,
          name: currentAccount.name,
          username: currentAccount.username, 
          bio: currentAccount.bio,
          email: currentAccount.email,
          imageUrl: currentAccount.imageUrl,
        })
        setIsAuthenticated(true)
        return true;
      }
      return false
    } catch (error) {
      console.error(error); 
      return false;
    } finally {
      setLoading(false);
    }
  };
 useEffect(() => {
    const cookieFallback = localStorage.getItem("cookie");
    if (
      cookieFallback === "[]"  ||
    cookieFallback === null  ||
     cookieFallback === undefined 
    ) {
      navigate("/signin");
    }

    checkAuthUser();
  }, []);  
  

  const value = {
    user,
    isLoading,
    isAuthenticated,
    setUser,
    setIsAuthenticated,
    checkAuthUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
export const useuserContext=()=>useContext(AuthContext)
