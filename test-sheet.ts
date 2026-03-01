import { getSheetData } from './lib/sheet';

async function test() {
    try {
        const data = await getSheetData();
        console.log(JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Error:', error);
    }
}

test();
