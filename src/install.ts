const shell = require('shelljs');

export function installWebsite(): void {
    
    if (!shell.which('git')) {
        shell.echo('Sorry, this script requires git');
        shell.exit(1);
    }
    
    shell.echo('installing website...');
    shell.exec('git clone https://github.com/openline-ai/openline.ai.git')
    shell.exec('yarn install')
    shell.exec('yarn start')
};