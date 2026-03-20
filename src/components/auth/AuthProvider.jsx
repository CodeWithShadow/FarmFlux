import React, { useEffect, useState } from 'react';
import { supabase, ensureUserInDB } from '../../services/supabase';
import useStore from '../../store/useStore';
import LoadingSpinner from '../ui/LoadingSpinner';

export function AuthProvider({ children }) {
    const { setUser, setSession } = useStore();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;

        // Initialize session
        const initializeAuth = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                if (mounted) {
                    setSession(session);
                    if (session?.user) {
                        setUser(session.user);
                        ensureUserInDB(session.user).catch(console.error);
                    } else {
                        setUser(null);
                    }
                }
            } catch (err) {
                console.error('Auth initialization error:', err);
            } finally {
                if (mounted) setLoading(false);
            }
        };

        initializeAuth();

        // Listen for changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (_event, session) => {
                if (mounted) {
                    setSession(session);
                    if (session?.user) {
                        setUser(session.user);
                        ensureUserInDB(session.user).catch(console.error);
                    } else {
                        setUser(null);
                    }
                    setLoading(false);
                }
            }
        );

        return () => {
            mounted = false;
            subscription.unsubscribe();
        };
    }, []);

    // Block app rendering until we establish initial auth state
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-farm-bg">
                <LoadingSpinner text="Authenticating..." size="lg" />
            </div>
        );
    }

    return children;
}
