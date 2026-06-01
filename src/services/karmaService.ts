import axios, { AxiosError } from 'axios';
import { AppError } from '../utils/AppError.js';

const ADJUTOR_BASE_URL = 'https://adjutor.lendsqr.com/v2';

export async function isBlacklisted(id: string): Promise<boolean> {
    const apiKey= process.env.ADJUTOR_API_KEY;

    if(!apiKey){
        throw new AppError('ADJUTOR API KEY does not exist', 500);    
    }

    try{
        const response = await axios.get(
            `${ADJUTOR_BASE_URL}/verification/karma/${encodeURIComponent(id)}`,
            {headers: {Authorization: `Bearer ${apiKey}`}}

        );
        //A real blacklist hit should contain a karma_identity record
        const record = response.data?.data;
        return Boolean(record && record.karma_identity);

    }
    catch(error) {
        const status = (error as AxiosError).response?.status;
        if(status===404){
            return false;
        }
        throw new AppError('Unable to verify karma blacklist status', 502);
    }
}