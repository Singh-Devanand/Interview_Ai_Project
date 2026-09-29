import {useContext,useEffect} from "react"
import {AuthContext} from "../auth.context.jsx"
import {login, register, logout, getCurrentUser} from "../services/auth.api.js"

export const useAuth = () => {
    const {user, setUser, loading, setLoading} = useContext(AuthContext);


    const handleLogin = async ({email, password}) => {
        setLoading(true);
        try {
            const data = await login({email, password});
            setUser(data.user);
        } catch (error) {
            console.error("Login failed:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async ({username, email, password}) => {
        setLoading(true);
        try {
            const data = await register({username, email, password});
            setUser(data.user);
        } catch (error) {
            console.error("Register failed:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        setLoading(true);
        try {
            await logout();
            setUser(null);
        } catch (error) {
            console.error("Logout failed:", error);
        } finally {
            setLoading(false);
        }
    };

  useEffect(() => {
    const getAndSetCurrentUser = async () => {
        try {
            const data = await getCurrentUser();
            setUser(data.user);
        } catch (error) {
            console.error("Error fetching current user:", error);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    getAndSetCurrentUser();
}, []);



    return {user, loading, handleLogin, handleRegister, handleLogout};
}