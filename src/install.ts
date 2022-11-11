import shell from 'shelljs';
import { insertSupabase } from "./supabase.js";



export function customerOs() :boolean {
    
    const code = shell.cd('openline-customer-os').code;
    if (code == 0) {
        console.log('Customer OS already downloaded')
    }
    else {
        let ip: string = shell.exec("curl 'https://api64.ipify.org'", {silent:true}).stdout;
        shell.exec('git clone https://github.com/openline-ai/openline-customer-os.git');
        let data = {
            "app": "openline-customer-os",
            "ip": ip,
        };

        insertSupabase('Downloads', data);
    }
    return true;
}

customerOs()