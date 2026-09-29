import api from "../../../lib/api.js";

export async function register({username, email, password}){

    try{
        const response = await api.post('/api/auth/register', {
            username,
            email,
            password
        });

        return response.data;
    } catch (error) {
        console.log('Error during registration:', error);
    }

}

export async function login({email, password}){
    try{
        const response = await api.post('/api/auth/login', {
            email,
            password
        });

        return response.data;

    } catch (error) {
        console.log('Error during login:', error);
    }
}

export async function logout(){
    const response = await api.get('/api/auth/logout');
    return response.data;
}    

export async function getCurrentUser() {
    try {
        const response = await api.get("/api/auth/get-user");

        return response.data;
    } catch (error) {
        console.log("Error fetching current user:", error);
        throw error;
    }
}
