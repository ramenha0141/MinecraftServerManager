import fs from 'fs/promises';

const exists = async (path: string): Promise<boolean> => {
    try {
        return !!await fs.stat(path);
    } catch (e) {
        return false;
    }
};
export default exists;