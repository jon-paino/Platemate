import { createContext, useContext, useEffect, useState } from "react";
import {
  createSupabaseAccount,
  loginSupabaseAccount,
  logoutSupabaseAccount,
  getUserSession
} from "../services/supabase";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [userMetadata, setUserMetadata] = useState({});
  const [isStateLoading, setIsStateLoading] = useState(true); // New loading state

  // Fetch user session from Supabase and update state
  async function updateStateFromSupabase() {
    setIsStateLoading(true); // Set loading to true
    const { session } = await getUserSession();
    console.log(session);
    if (session?.user) {
        console.log("HERE")
      setLoggedIn(true);
      setEmail(session.user.email);
      setUserMetadata(session.user.user_metadata ?? {});
    } else {
      setLoggedIn(false);
      setEmail("");
      setUserMetadata({});
    }
    console.log(session);
    setIsStateLoading(false); // Set loading to false after updating state
  }


  // Initialize state on mount and set up auth listener
  useEffect(() => {
    updateStateFromSupabase();
  }, []);

  async function createAccount(email, password, metadata = {}) {
    const resp = await createSupabaseAccount(email, password);
    if (resp === "Success") await login(email, password);
    return resp;
  }

  async function login(email, password) {
    const resp = await loginSupabaseAccount(email, password);
    console.log(resp)
    if (resp === "Success") {
        await updateStateFromSupabase();
    }
    return resp;
  }

  async function logout() {
    await logoutSupabaseAccount();
    await updateStateFromSupabase();
  }

  const userValue = {
    loggedIn,
    email,
    userMetadata,
    createAccount,
    login,
    logout,
    isStateLoading
  };

  return <UserContext.Provider value={userValue}>{children}</UserContext.Provider>;
};

export default function useUserContext() {
  return useContext(UserContext);
}
