<div align="center">
  <a href="https://openline.ai">
    <img
      src="https://raw.githubusercontent.com/openline-ai/openline-cli/otter/.github/TeamHero.svg"
      alt="Openline Logo"
      height="64"
    />
  </a>
  <br />
  <p>
    <h3>
      <b>
        Openline command line interface (CLI)
      </b>
    </h3>
  </p>
  <p>
    Openline customerOS is the easiest way to consolidate, warehouse, and build applications with your customer data.
  </p>
  <p>

[![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen?logo=github)][cli-repo]
[![license](https://img.shields.io/badge/license-Apache%202-blue)][apache2]
[![stars](https://img.shields.io/github/stars/openline-ai/openline-customer-os?style=social)][cli-repo]
[![twitter](https://img.shields.io/twitter/follow/openlineAI?style=social)][twitter]
[![slack](https://img.shields.io/badge/slack-community-blueviolet.svg?logo=slack)][slack]

  </p>
  <p>
    <sub>
      Built with ❤︎ by the
      <a href="https://openline.ai">
        Openline
      </a>
      community!
    </sub>
  </p>
</div>

## 👋 Overview

This guide will get you up and running with Openline in less than 5 minutes.

The Openline CLI is a NodeJS app that makes it easy to setup and manage Openline apps directly from the terminal. It's an essential part of using Openline.  To use the Openline CLI, you'll need [Node.js version 16.14][node] or above installed on your machine.

## 🚀 Build and run the CLI using the code in this repo and your local changes

```sh-session
yarn install
yarn build
alias ol="node $(pwd)/bin/run"
ol dev start
```

afterwards you can run the locally build cli by calling "ol"

## 🚀 Installation

Download the Openline CLI using the following command

via npm

```sh-session
npm i openline -g
```

via yarn

```sh-session
yarn add openline
```

You can check that the Openline CLI is properly installed by running

```sh-session
openline --version
```

If everything has been setup correctly, you'll see an output that looks like `openline/x.y.z`.

## 🙌 Features

```terminal
USAGE:
    openline [COMMAND]
    openline [TOPIC] [COMMAND]

TOPICS:
    dev         Starts and stops local Openline development server

COMMANDS:
    help        Display help for the Openline CLI
    issues      View or Create issues against the Openline project
```

- **COMMANDS** execute a routine
- **TOPICS** are commands that contain sub commands.  For example `openline dev start`

## 🤝 Resources

- Full reference docs for the CLI can be found via our [CLI guide][guide]
- For help, feature requests, or chat with fellow Openline enthusiasts, check out our [slack community][slack]!

## 💪 Contributions

- We love contributions big or small!  Please check out our [guide on how to get started][contributions].
- Not sure where to start?  [Book a free, no-pressure, no-commitment call][call] with the team to discuss the best way to get involved.

## ✨ Contributors

A massive thank you goes out to all these wonderful people ([emoji key][emoji]):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->


<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

## 🪪 License

- This repo is licensed under [Apache 2.0][apache2], with the exception of the ee directory (if applicable).
- Premium features (contained in the ee directory) require an Openline Enterprise license.  See our [pricing page][pricing] for more details.

[apache2]: https://www.apache.org/licenses/LICENSE-2.0
[call]: https://meetings-eu1.hubspot.com/matt2/customer-demos
[cli-repo]: https://github.com/openline-ai/openline-cli/
[contributions]: https://www.openline.ai/docs/contribute
[guide]: https://www.openline.ai/docs/
[emoji]: https://allcontributors.org/docs/en/emoji-key
[node]: https://nodejs.org/en/download/
[pricing]: https://openline.ai/pricing
[slack]: https://join.slack.com/t/openline-ai/shared_invite/zt-1i6umaw6c-aaap4VwvGHeoJ1zz~ngCKQ
[twitter]: https://twitter.com/OpenlineAI
