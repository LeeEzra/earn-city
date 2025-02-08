import axios from "axios";

export const fetchUserDetails = async () => {
    try {
        const response = await axios.get(`/auth/admin`, {
            withCredentials: true,
        });
        return response.data;
    }
    catch (error) {
        console.error('Error fetching user data:',
        error.response?.data || error.message); 
        throw error;
    }
};