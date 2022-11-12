oclif-hello-world
=================

oclif example Hello World CLI

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/oclif-hello-world.svg)](https://npmjs.org/package/oclif-hello-world)
[![CircleCI](https://circleci.com/gh/oclif/hello-world/tree/main.svg?style=shield)](https://circleci.com/gh/oclif/hello-world/tree/main)
[![Downloads/week](https://img.shields.io/npm/dw/oclif-hello-world.svg)](https://npmjs.org/package/oclif-hello-world)
[![License](https://img.shields.io/npm/l/oclif-hello-world.svg)](https://github.com/oclif/hello-world/blob/main/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g openline
$ openline COMMAND
running command...
$ openline (--version)
openline/0.0.0 darwin-arm64 node-v18.9.0
$ openline --help [COMMAND]
USAGE
  $ openline COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`openline hello PERSON`](#openline-hello-person)
* [`openline hello world`](#openline-hello-world)
* [`openline help [COMMAND]`](#openline-help-command)
* [`openline plugins`](#openline-plugins)
* [`openline plugins:install PLUGIN...`](#openline-pluginsinstall-plugin)
* [`openline plugins:inspect PLUGIN...`](#openline-pluginsinspect-plugin)
* [`openline plugins:install PLUGIN...`](#openline-pluginsinstall-plugin-1)
* [`openline plugins:link PLUGIN`](#openline-pluginslink-plugin)
* [`openline plugins:uninstall PLUGIN...`](#openline-pluginsuninstall-plugin)
* [`openline plugins:uninstall PLUGIN...`](#openline-pluginsuninstall-plugin-1)
* [`openline plugins:uninstall PLUGIN...`](#openline-pluginsuninstall-plugin-2)
* [`openline plugins update`](#openline-plugins-update)

## `openline hello PERSON`

Say hello

```
USAGE
  $ openline hello [PERSON] -f <value>

ARGUMENTS
  PERSON  Person to say hello to

FLAGS
  -f, --from=<value>  (required) Who is saying hello

DESCRIPTION
  Say hello

EXAMPLES
  $ oex hello friend --from oclif
  hello friend from oclif! (./src/commands/hello/index.ts)
```

_See code: [dist/commands/hello/index.ts](https://github.com/openline-ai/openline-cli/blob/v0.0.0/dist/commands/hello/index.ts)_

## `openline hello world`

Say hello world

```
USAGE
  $ openline hello world

DESCRIPTION
  Say hello world

EXAMPLES
  $ openline hello world
  hello world! (./src/commands/hello/world.ts)
```

## `openline help [COMMAND]`

Display help for openline.

```
USAGE
  $ openline help [COMMAND] [-n]

ARGUMENTS
  COMMAND  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for openline.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v5.1.18/src/commands/help.ts)_

## `openline plugins`

List installed plugins.

```
USAGE
  $ openline plugins [--core]

FLAGS
  --core  Show core plugins.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ openline plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v2.1.6/src/commands/plugins/index.ts)_

## `openline plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ openline plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Installs a plugin into the CLI.
  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.


ALIASES
  $ openline plugins add

EXAMPLES
  $ openline plugins:install myplugin 

  $ openline plugins:install https://github.com/someuser/someplugin

  $ openline plugins:install someuser/someplugin
```

## `openline plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ openline plugins:inspect PLUGIN...

ARGUMENTS
  PLUGIN  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ openline plugins:inspect myplugin
```

## `openline plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ openline plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Installs a plugin into the CLI.
  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.


ALIASES
  $ openline plugins add

EXAMPLES
  $ openline plugins:install myplugin 

  $ openline plugins:install https://github.com/someuser/someplugin

  $ openline plugins:install someuser/someplugin
```

## `openline plugins:link PLUGIN`

Links a plugin into the CLI for development.

```
USAGE
  $ openline plugins:link PLUGIN

ARGUMENTS
  PATH  [default: .] path to plugin

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Links a plugin into the CLI for development.
  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello'
  command will override the user-installed or core plugin implementation. This is useful for development work.


EXAMPLES
  $ openline plugins:link myplugin
```

## `openline plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ openline plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ openline plugins unlink
  $ openline plugins remove
```

## `openline plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ openline plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ openline plugins unlink
  $ openline plugins remove
```

## `openline plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ openline plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ openline plugins unlink
  $ openline plugins remove
```

## `openline plugins update`

Update installed plugins.

```
USAGE
  $ openline plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```
<!-- commandsstop -->
