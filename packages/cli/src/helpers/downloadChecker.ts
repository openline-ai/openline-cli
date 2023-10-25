import * as shell from "shelljs";

export function waitForFileToBeDownloaded(filePath: string, verbose: boolean) {
  const parts = filePath.split('/');
  const fileName = parts[parts.length - 1];
  shell.exec(`rm -f ${fileName}`)
  let remoteFileSize = shell.exec(`wget --spider ${filePath} 2>&1 | grep -i 'length' | awk '{print $2}'`, {silent: true});
  shell.exec(`wget ${filePath}`, {silent: !verbose});
  let localFileSize;
  do {
    shell.exec('sleep 2')
    localFileSize = shell.exec(`ls -l ${fileName}| awk '{print $5}'`, {silent: true});
  }
  while (localFileSize.toString() !== remoteFileSize.toString())
  return fileName;
}
