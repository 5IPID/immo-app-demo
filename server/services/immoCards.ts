import { collections } from "../db/connection";
import { ImmoCard } from "../types/immoCards";


export async function findAllImmoCards():Promise<ImmoCard[]> {
    console.log('here we go')
    const results = (await collections?.immoCards?.find({}).limit(50).toArray() as unknown as ImmoCard[])
    if (!collections?.immoCards) {
        console.error('immoCards collection is undefined');
        return [];
    }
    return results;
}

export async function findOneById(id: number):Promise<ImmoCard |null> {
    const query = ({id})
    const result = (await collections?.immoCards?.findOne(query)) as unknown as ImmoCard
    if (!result) {
        console.log(`No record found with id: ${id}`);
        return null;
    }else{
        console.log(result)
    }
    return result;
}