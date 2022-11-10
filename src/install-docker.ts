const shell = require('shelljs')

// docker install check
export function dockerCheck() :boolean {
    let data = shell.exec('docker version', {silent:true});

    if (data.stdout.length == 0) {
        console.log('Docker is not installed...')
        return false;
    } else {
        console.log('Docker is already installed.')
        return true;
    }
};

export function installDocker(os: string) :boolean {
    // todo install on windows
    var success = false;

    console.log('Installing Docker...');
    if (os == 'mac') {
        success = installDockerMac()
    }
    else if (os == 'linux') {
        success = installDockerLinux()
    }
    else {
        success = false;
    }
    return success;
};

// install Docuer on Amazon linux
function installDockerLinux() :boolean {
    try {
        shell.exec('sudo yum update')
        shell.exec('sudo yum search docker')
        shell.exec('sudo yum install docker')
        return true
    } catch (err: any) {
        console.log(err.message)
        return false;
    }
}

function installDockerMac() :boolean {
    return false;
}