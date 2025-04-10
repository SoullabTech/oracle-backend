interface AuthResponse {
    user: {
        id: string;
        email: string;
        user_metadata?: Record<string, any>;
    } | null;
    error: {
        message: string;
    } | null;
    session?: {
        user: {
            id: string;
            email: string;
            user_metadata?: Record<string, any>;
        };
    };
}
export declare const supabase: {
    auth: {
        signInWithPassword: ({ email, password }: {
            email: string;
            password: string;
        }) => Promise<AuthResponse>;
        signOut: () => Promise<{
            error: null;
        }>;
    };
    from: () => {
        select: () => Promise<{
            data: never[];
            error: null;
        }>;
        insert: (payload: any) => Promise<{
            data: any[];
            error: null;
        }>;
        update: (changes: any) => Promise<{
            data: any[];
            error: null;
        }>;
        delete: () => Promise<{
            data: never[];
            error: null;
        }>;
    };
};
export {};
