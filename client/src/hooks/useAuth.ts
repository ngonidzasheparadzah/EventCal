import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { apiRequest } from "@/lib/queryClient";

export function useAuth() {
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState(null);
  const queryClient = useQueryClient();

  // Get user data from our backend (includes role, verification status, etc.)
  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ["/api/auth/user"],
    retry: false,
    enabled: !!session,
    queryFn: async () => {
      if (!session?.access_token) return null;
      
      try {
        return await apiRequest("/api/auth/user", {
          headers: {
            Authorization: `Bearer ${session.access_token}`
          }
        });
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        return null;
      }
    }
  });

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setIsLoading(false);
      
      // Invalidate user query when auth state changes
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
    });

    return () => subscription.unsubscribe();
  }, [queryClient]);

  const signUp = async (email: string, password: string, metadata?: any) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata
      }
    });
    return { data, error };
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      queryClient.clear();
    }
    return { error };
  };

  return {
    user,
    session,
    isLoading: isLoading || userLoading,
    isAuthenticated: !!session && !!user,
    signUp,
    signIn,
    signOut,
  };
}
