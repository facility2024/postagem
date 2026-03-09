import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  metadataLoading: boolean;
  isAdmin: boolean;
  license: any | null;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  loading: true,
  metadataLoading: true,
  isAdmin: false,
  license: null,
  signOut: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [metadataLoading, setMetadataLoading] = useState(true);
  const [license, setLicense] = useState<any | null>(null);

  useEffect(() => {
    let isMounted = true;

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!isMounted) return;
      setSession(nextSession);
      setUser(nextSession?.user ?? null);
      setLoading(false);
    });

    supabase.auth.getSession()
      .then(({ data: { session: initialSession }, error }) => {
        if (!isMounted) return;
        if (error) {
          console.error("Error getting initial session:", error);
          setLoading(false);
          return;
        }
        setSession(initialSession);
        setUser(initialSession?.user ?? null);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error getting initial session:", error);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadUserMetadata = async () => {
      if (!user?.id) {
        setIsAdmin(false);
        setLicense(null);
        setMetadataLoading(false);
        return;
      }

      setMetadataLoading(true);

      try {
        const [{ data: roles, error: rolesError }, { data: lic, error: licError }] = await Promise.all([
          supabase.from("user_roles").select("role").eq("user_id", user.id),
          supabase.from("licenses").select("*").eq("user_id", user.id).eq("is_active", true).maybeSingle(),
        ]);

        if (rolesError) throw rolesError;
        if (licError) throw licError;

        if (!isMounted) return;
        setIsAdmin(roles?.some((r) => r.role === "admin") ?? false);
        setLicense(lic ?? null);
        setMetadataLoading(false);
      } catch (error) {
        console.error("Error loading user metadata:", error);
        if (!isMounted) return;
        setIsAdmin(false);
        setLicense(null);
        setMetadataLoading(false);
      }
    };

    void loadUserMetadata();

    return () => {
      isMounted = false;
    };
  }, [user?.id]);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ session, user, loading, metadataLoading, isAdmin, license, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

