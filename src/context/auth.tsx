import React, {createContext, useContext, useEffect, useMemo} from 'react'
import {useMe} from "@/lib/store/meStore.ts";

const AuthContext = createContext<any>(null);

const AuthProvider = ({children}: { children: React.ReactNode }) => {
    const {token, setToken} = useMe((state) => state);

    const contextValue = useMemo(
        () => ({
            token,
            setToken,
        }),
        [token]
    );

    useEffect(() => {
        window.addEventListener("storage", () => {
            if (localStorage.getItem("token"))
                setToken(localStorage.getItem("token") ?? '');
        });
    }, []);

    return (
        <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth: () => ({ token: string; setToken: (t: string) => void }) = () => {
    return useContext(AuthContext);
};

export default AuthProvider;