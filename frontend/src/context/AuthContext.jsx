import React, { useEffect, createContext, useContext } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  const checkAuth = async () => {
    try{
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/me`,{withCredentials: true})
        console.log(response)
        setUser(response.data.user)
    }catch(err){
        setUser(null)
    }finally{
        setLoading(false)
    }
}

const login = (userData) => {
    setUser(userData);
}

const logout = () => {
    setUser(null);
}

useEffect(() => {checkAuth()}, [])

  return (
    <AuthContext.Provider value={{ user, loading, checkAuth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};



