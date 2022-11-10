const shell = require('shelljs')

// checks if Go is installed on the maching
export function goCheck() :boolean {
    let data = shell.exec('go version', {silent:true});

    if (data.stdout.length == 0) {
        console.log('Go is not installed...')
        return false;
    } else {
        console.log('Go is already installed.')
        return true;
    }
};

// installs Go locally
export function installGo(os: string) :boolean {
    //todo: install on windows
    var success = false;

    console.log('Installing Go...');
    if (os == 'mac') {
        success = installGoMac()
    } 
    else if (os == 'linux') {
        success = installGoLinux()
    } 
    else {
        success = false
    }
    return success;
};

// installs Go on Mac
function installGoMac() :boolean {
   //todo: check if Xcode is installed if mac
    //todo: check if brew is installed if mac 
    try {
        shell.exec('brew install golang');
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
        return true
    } catch (err: any) {
        console.log(err.message)
        return false;
    }
};