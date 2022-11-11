
After you install the Openline CLI, run the `openline login` command, then press any key to go to your web browser to complete login.  If you have not yet created an Openline account, you will be promted to do so.

Once you've logged in via the brower, the CLI will log you in automatically.

```bash
$ openline login

openline: Press any key to open up the browser to login, or press q to exit
  >  Warning: If browser does not open, visit
  >  https://cli-auth.openline.ai/auth/brower/<sessionID>
openline: Waiting for login...
Logging in...done
Logged in as me@example.com
```

The CLI saves your email address and an API (oAuth) token to `~/.netrc` for future use.  The netrc format is well-established and well-supported by various network tools on unix.  With your Openline credentials stored in this file, other tools such as `curl -n` can access the Openline API with little or no extra work.

Now your're ready to start working with the Openline CLI!

## Staying up to date

The Openline CLI keeps itself up to date automatically, unless you installed via `npm install`.

When you run an `openline` command, a background process checks for the latest available version of the CLI.  If a new version is found, it's downloaded and stored in `~/.local/share/openline/client`.  This background check happens at most once per day.

The `openline` binary checks for an up-to-date client in `~/.local/share/openline/client` before using the legacy client.

## CLI Architecture

The Openline CLI is built with the Open CLI Framework ([oclif][oclif]), developed by Heroku & Salesforce.  All code for the Openline CLI is [open source][repo].  If you would like to contribute to the Openline CLI, please see our [contributions guide][contribute] for how to get started.

## Uninstalling the CLI

If for some reason you'd like to uninstall the CLI, you can do so by following the commands below.

### macOS

On macOS you can uninstall the CLI by typing:

```terminal
$ rm -rf /usr/local/openline /usr/local/lib/openline /usr/local/bin/openline ~/.local/share/openline ~/Library/Caches/openline
```

**Homebrew installs**

If you installed the CLI using Homebrew, you can uninstall the CLI by typing:
 
```terminal
$ brew uninstall openline
$ rm -rf ~/.local/share/openline ~/Library/Caches/openline
```

### Linux

On linux, you can uninstall the CLI by typing:

```terminal
$ rm /usr/local/bin/openline
$ rm -rf /usr/local/lib/openline /usr/local/openline
$ rm -rf ~/.local/share/openline ~/.cache/openline
```



<!---References---->

[contribute]: https://openline.ai
[oclif]: https://oclif.io/
[repo]: https://github.com/openline-ai/openline-cli