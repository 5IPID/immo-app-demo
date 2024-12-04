import axios from "axios";


// TODO TO MOVE :
const API_URL = 'http://localhost:5050/record';

export const getAllImmoProperties = async () => {
    try {
        const response = await axios.get(`${API_URL}/`);
        return response.data;
    } catch (error) {
        console.error('Error fetching all properties : ', error)
        throw error;
    }
}

export const getImmoPropertiesById = async (id: any) => {
    try {
        console.log(`${API_URL}/${id}`)
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching property with id ${id}`, error)
        throw error;
    }
}