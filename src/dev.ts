const shell = require('shelljs')

// checks OS
function osCheck() :string {
    let osVar = process.platform;
    if (osVar == 'darwin') {
        return 'mac';
    } else if (osVar == 'win32') {
        return 'windows';
    } else {
        return 'linux';
    }   
};

function installDev(os: string) :boolean {
    if (os == 'linux') {
        shell.exec('bash scripts/ubuntu/install_dev.sh')
    } else {
        console.log('mac coming soon')
    };
    return true;
}

// main function
export function devSetup() :boolean {
    // determine OS
    let os = osCheck();
    
    // install dev env dependencies
    installDev(os);
    return false;
};

devSetup()