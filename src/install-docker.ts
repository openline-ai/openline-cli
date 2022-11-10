const shell = require('shelljs')

// docker install check
export function dockerCheck() :boolean {
    let data = shell.exec('docker version', {silent:true});

    if (data.stdout.length == 0) {
        console.log('Go is not installed...')
        return false;
    } else {
        console.log('Go is already installed.')
        return true;
    }
};

export function installDocker(os: string) :boolean {
    // todo install on windows
    var success = false;

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
        shell.exec('curl -fsSL https://get.docker.com | sh;')
        shell.exec('sudo service docker start')
        shell.exec('sudo docker run hello-world')
        return true
    } catch (err: any) {
        console.log(err.message)
        return false;
    }
}

function installDockerMac() :boolean {
    return false;
}