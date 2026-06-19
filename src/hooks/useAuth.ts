import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getUserRole } from "@/server/api/auth";

export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user || null);

      if (session?.user) {
        const userRole = await getUserRole(session.user.id);
        setRole(userRole);
      } else {
        setRole(null);
      }

      setLoading(false);
    });

    return () => subscription?.unsubscribe();
  }, []);

  return { user, role, loading };
}
