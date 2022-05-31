import * as bcrypt from 'bcrypt';



export const hashing = async (password: string) => {
    const saltOrRounds = 10;
    const hash = await bcrypt.hash(password, saltOrRounds);

    return hash;
}

export const hashCompare = async (password: string, hash: string): Promise<boolean> => {
    return await bcrypt.compare(password, hash);
}

