import api from '../../lib/axios'

export const registerAccount = async ({email_id, password}) => {
    try {
    const resp = await api.post('/auth/signup',{email_id,password})
    return resp
} catch (error) {
        throw error
    }
}
export const loginAccount = async ({ email_id, password}) => {
    try {
    const resp = await api.post('/auth/login',{email_id,password})
    return resp
} catch (error) {
        throw error
    }
}
export const verifyAccount = async ({ email_id, verification_code}) => {
    try {
    const resp = await api.post('/auth/verify-account',{email_id,verification_code})
    return resp
} catch (error) {
        throw error
    }
}
export const updateUser = async ({ firstname, lastname, gender, age, interests, phone}) => {
    try {
    const resp = await api.post('/user/update-user',{firstname, lastname, gender, age, interests, phone})
    return resp
} catch (error) {
        throw error
    }
}

export const getUserById = async (user_id) => {
    try {
        const response = await api.get(`/user/get-user/${user_id}`);
        console.log("get user:",response)
        return response.data;
    } catch (error) {
        console.error('Failed to fetch user by ID:', error);
        throw error;
    }
};

export const testApi = async ()=>{
    try{
        await api.get('/auth/test');
        console.log("Api working")
    }
    catch(error){
        console.log("Api not working")
        console.log(error.response.data)
        throw error;
    }
}