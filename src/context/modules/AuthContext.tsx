"use client"

import { createContext, useContext, useState, useEffect } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { Session } from "next-auth";

interface AuthContext {
  status: string,
  session: Session | null,
  signIn: Function,
  signOut: Function,
  register: Function,
  isUser: Boolean,
  isManager: Boolean
};

type SessionUser = Session["user"] & {
  fullName?: string
};

interface HrSession extends Session {
  user: SessionUser
}

const defaultSession: HrSession = {
  expires: "",
  user: { id: "", lang: "", roles: [] }
};

const AuthContext = createContext<AuthContext>({
  status: "",
  session: defaultSession,
  signIn: () => {},
  signOut: () => {},
  register: () => {},
  isUser: false,
  isManager: false
});

export function AuthContextProvider ({ children }: any ) {

  const { status, data, update } = useSession();
  const [ userSession, setUserSession ] = useState<HrSession>({expires: "", user: { id: "", lang: "", roles: [] }});
  const [ isUser, setIsUser ] = useState(false);
  const [ isManager, setIsManager ] = useState(false);

  useEffect(() => {
    if (data) {
      const newSession: HrSession = {
        expires: data.expires,
        user: data && data.user ? data.user : { id: "", lang: "", roles: [] }
      };
      setUserSession(newSession);
      setIsUser(newSession?.user?.roles?.includes('user') || newSession?.user?.roles?.includes('manager') ? true : false);
      setIsManager(newSession?.user?.roles?.includes('manager') ? true : false);
    }
  }, [ data ]);

  const register = async function (data: Object) {
    let response = await fetch(`/api/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });
    return await response.json();
  };

  return (
    <AuthContext.Provider value={{
      status, 
      session: userSession,
      signIn,
      signOut,
      register,
      isUser,
      isManager
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    const notInitSession: AuthContext = {
      status: "",
      session: defaultSession,
      signIn: signIn,
      signOut: signOut,
      register: () => {},
      isUser: false,
      isManager: false
    };
    return notInitSession;
  }
  return context;
};