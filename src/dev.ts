// This script only works on mac right now
// https://www.digitalocean.com/community/tutorials/how-to-install-go-and-set-up-a-local-programming-environment-on-macos

import { setMaxIdleHTTPParsers } from "http";
import { resourceLimits } from "worker_threads";

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

// checks if Go is installed on the maching
function goCheck() :boolean {
    let result = shell.exec('go version', {silent:true}).stdout;
    if (result == null) {
        console.log('Go is not installed...')
        return false;
    } else {
        console.log('Go is already installed.')
        return true;
    }
};

// installs Go locally
function installGo(os: string) :boolean {
    //todo: install on windows
    var data = false;

    console.log('Installing Go...');
    if (os == 'mac') {
        data = installGoMac()
    } 
    else if (os == 'linux') {
        data = installGoLinux()
    } 
    else {
        data = false
    }
    return data;
};

// installs Go on Mac
function installGoMac() :boolean {
   //todo: check if Xcode is installed if mac
    //todo: check if brew is installed if mac 
    try {
        shell.exec('brew install golang');
        goCheck();
        console.log('');
        console.log('Please update ~/.bash_profile with:');
        console.log('    export GOPATH=$HOME/go');
        console.log('    export PATH=$PATH:$GOPATH/bin');
        console.log('');
        return true;
    } catch (err: any) {
       console.log(err.message)
       return false;
    }
};

// installs Go on Amazon linux
function installGoLinux() :boolean {
    try {
        shell.exec('sudo yum update')
        shell.exec('wget https://storage.googleapis.com/golang/getgo/installer_linux')
        shell.exec('chmod +x ./installer_linux')
        shell.exec('./installer_linux')
        shell.exec('source ~/.bash_profile')
        goCheck()
        return true
    } catch (err: any) {
        console.log(err.message)
        return false;
    }
};


// main function
export function devSetup() :boolean {
    let os = osCheck()
    let check = goCheck();
    if (check == false) {
        let goInstall = installGo(os);
        if (goInstall == true) {
            return true;
        } else {
            return false;
        }
    } else {
        return true;
    }
};

devSetup()