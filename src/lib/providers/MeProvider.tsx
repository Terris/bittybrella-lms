"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useConvexAuth, useMutation } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";

interface User {
  id: Id<"users">;
}

interface MeContextProps {
  currentUser: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialProps = {
  currentUser: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

export const MeContext = createContext<MeContextProps>(initialProps);

interface MeProviderProps {
  children: ReactNode;
}

export const MeProvider = ({ children }: MeProviderProps) => {
  const { isAuthenticated, isLoading: convexAuthIsLoading } = useConvexAuth();
  const { user: clerkUser, isLoaded: clerkUserIsLoaded } = useUser();

  console.log("CLERK USER", clerkUser);

  const [loadingDBUser, setLoadingDBUser] = useState<boolean>(
    initialProps.loading
  );
  const [currentUser, setCurrentUser] = useState<User | null>(
    initialProps.currentUser
  );
  const [dbError, setDBError] = useState<string | null>(initialProps.error);

  // Check for db user and store new user if user doesn't exist
  const storeUser = useMutation(api.users.store);
  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }
    async function createUser() {
      try {
        setLoadingDBUser(true);
        const id = await storeUser();
        setCurrentUser({ id });
      } catch (error: any) {
        setDBError(error.message);
      } finally {
        setLoadingDBUser(false);
      }
    }
    createUser();
    return () => setCurrentUser(null);
  }, [isAuthenticated, storeUser, clerkUser?.id]);

  return (
    <MeContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        loading: !clerkUserIsLoaded || loadingDBUser || convexAuthIsLoading,
        error: dbError,
      }}
    >
      {children}
    </MeContext.Provider>
  );
};

export const useMe = () => {
  const meContext = useContext(MeContext);
  return meContext;
};
