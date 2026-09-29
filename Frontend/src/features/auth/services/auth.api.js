import axios from 'axios';

export async function register({username, email, password}){

    try{
        const response = await axios.post('http://localhost:3000/api/auth/register', {
            username,
            email,
            password
        }, 
        {withCredentials: true});

        return response.data;
    } catch (error) {
        console.log('Error during registration:', error);
    }

}

export async function login({email, password}){
    try{
        const response = await axios.post('http://localhost:3000/api/auth/login', {
            email,
            password
        }, 
        {withCredentials: true});

        return response.data;

    } catch (error) {
        console.log('Error during login:', error);
    }
}

export async function logout(){
    const response = await axios.get('http://localhost:3000/api/auth/logout', {
        withCredentials: true
    });
    return response.data;
}    

export async function getCurrentUser() {
    try {
        const response = await axios.get(
            "http://localhost:3000/api/auth/get-user",
            {
                withCredentials: true
            }
        );

        return response.data;
    } catch (error) {
        console.log("Error fetching current user:", error);
        throw error;
    }
}
