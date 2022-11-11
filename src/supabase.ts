import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

var url = process.env.SUPABASE_URL as string;
var key = process.env.SUPABASE_KEY as string;

const sb = createClient(url, key);


interface Insert {
    app: string,
    ip: string
};

// Create (insert) data in supabase table
export async function insertSupabase(table: string, dataJson: Insert) {
    try {
        const { data, error } = await sb
            .from(table)
            .insert(dataJson)
            .select()

        await new Promise((resolve, reject) => setTimeout(resolve, 1000));

        return error;
    } catch(err) {
        console.log('Error: insertSupabase()')
        console.log(err);
    }
}
