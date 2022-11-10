const shell = require('shelljs')
import * as golang from './install-go';
import * as docker from './install-docker';

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

// main function
export function devSetup() :boolean {
    // determine OS
    let os = osCheck()
    
    // determine if Go is installed.  If not, install it.
    let go = golang.goCheck();
    if (go == false) {
        let goInstall = golang.installGo(os);
    }
    
    // determine if Docker is installed.  If not, install it.
    let d = docker.dockerCheck();
    if (d == false){
        let dockerInstall = docker.installDocker(os)
    }
    return false;
};

devSetup()