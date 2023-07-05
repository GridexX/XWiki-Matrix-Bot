<div align="center">

  <img src="assets/logo.png" alt="logo" width="200" height="auto" />
  <h1>MatriXWiki</h1>
  
  <p>
    An awesome bot to connect XWiki to Matrix ! 
  </p>
</div>
  
  
<!-- Badges -->
<p>
  <a href="https://github.com/C-Iaens/XWiki-Matrix/graphs/contributors">
    <img src="https://img.shields.io/github/contributors/C-Iaens/XWiki-Matrix" alt="contributors" />
  </a>
  <a href="">
    <img src="https://img.shields.io/github/last-commit/C-Iaens/XWiki-Matrix" alt="last update" />
  </a>
  <a href="https://github.com/C-Iaens/XWiki-Matrix/network/members">
    <img src="https://img.shields.io/github/forks/C-Iaens/XWiki-Matrix" alt="forks" />
  </a>
  <a href="https://github.com/C-Iaens/XWiki-Matrix/stargazers">
    <img src="https://img.shields.io/github/stars/C-Iaens/XWiki-Matrix" alt="stars" />
  </a>
  <a href="https://github.com/C-Iaens/XWiki-Matrix/issues/">
    <img src="https://img.shields.io/github/issues/C-Iaens/XWiki-Matrix" alt="open issues" />
  </a>
  <a href="https://github.com/C-Iaens/XWiki-Matrix/blob/master/LICENSE">
    <img src="https://img.shields.io/github/license/C-Iaens/XWiki-Matrix.svg" alt="license" />
  </a>
</p>
   
<br />

<!-- Table of Contents -->
# :notebook_with_decorative_cover: Table of Contents

- [:notebook\_with\_decorative\_cover: Table of Contents](#notebook_with_decorative_cover-table-of-contents)
  - [:star2: About the Project](#star2-about-the-project)
    - [:dart: Features](#dart-features)
    - [:key: Environment Variables](#key-environment-variables)
  - [:toolbox: Getting Started](#toolbox-getting-started)
    - [:bangbang: Prerequisites](#bangbang-prerequisites)
    - [:gear: Installation](#gear-installation)
    - [:running: Run Locally](#running-run-locally)
    - [:triangular\_flag\_on\_post: C-Iaens/XWiki-Matrixoyment](#triangular_flag_on_post-c-iaensxwiki-matrixoyment)
  - [:eyes: Usage](#eyes-usage)
    - [Running / Building](#running--building)
    - [Configuration](#configuration)
    - [Project structure](#project-structure)
      - [`src/index.ts`](#srcindexts)
      - [`src/commands/handler.ts`](#srccommandshandlerts)
      - [`src/commands/hello.ts`](#srccommandshellots)
      - [`src/config.ts`](#srcconfigts)
      - [`lib/`](#lib)
      - [`storage/`](#storage)
    - [Help!](#help)
  - [:wave: Contributing](#wave-contributing)
  - [:warning: License](#warning-license)
  - [:handshake: Contact](#handshake-contact)

  

<!-- About the Project -->
## :star2: About the Project

This project aims to Retrieve information of an XWiki instance from a Matrix Bot. 

<!-- Features -->
### :dart: Features

- Search pages in the wiki and get a summary of each of them
- Retrieve the list of users



<!-- Env Variables -->
### :key: Environment Variables

To run this project, you will need to add the following environment variables to your `config/default.yaml` file:
```yaml

# Where the homeserver's Client-Server API is located. Typically this
# is where clients would be connecting to in order to send messages.
homeserverUrl: "https://matrix.xwiki.com"

pantalaimon:
  use: false
  username: "USERNAME"
  password: "PASSWORD"

# An access token for the bot to use. Learn how to get an access token
# at https://t2bot.io/docs/access_tokens
accessToken: "ACCESS_TOKEN"

# Whether or not to autojoin rooms when invited.
autoJoin: true

# Location on disk for where to store various bot information.
dataPath: "storage"

xwikiUrl: "https://www.xwiki.org"
To run this project, you will need to add the following environment variables to your .env file
```

`API_KEY`

`ANOTHER_API_KEY`

<!-- Getting Started -->
## 	:toolbox: Getting Started

<!-- Prerequisites -->
### :bangbang: Prerequisites

This project uses Npm as package manager


<!-- Installation -->
### :gear: Installation

Install with npm:

```bash
  cd XWiki-Matrix
  npm install
```
   
<!-- Run Locally -->
### :running: Run Locally

Clone the project

```bash
  git clone https://github.com/C-Iaens/XWiki-Matrix.git
```

Go to the project directory

```bash
  cd XWiki-Matrix
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run start:dev
```

<!-- C-Iaens/XWiki-Matrixoyment -->
### :triangular_flag_on_post: C-Iaens/XWiki-Matrixoyment

To C-Iaens/XWiki-Matrixoy this project, you should first completed the getting started and build the project:

```bash
  npm run build
```

Then build the Docker image:
```bash
docker build . -t <NAME>
```

Then run the image into a production server:
```bash
docker run <options> <NAME>
```

<!-- Usage -->
## :eyes: Usage

### Running / Building

After clicking the 'use this template' button and cloning the repo, you'll need to install the dependencies
and open an editor to get started. This assumes you have at least **NodeJS 12 or higher**.

1. Replace this README with something useful.
2. Update your project's details in `package.json`.
3. Run `npm install` to get the dependencies.

To build it: `npm run build`.

To run it: `npm run start:dev`

To check the lint: `npm run lint`

*Think this should have a Docker image built-in? Add a 👍 to [this issue](https://github.com/turt2live/matrix-bot-sdk-bot-template/issues/1).*

### Configuration

This template uses a package called `config` to manage configuration. The default configuration is offered
as `config/default.yaml`. Copy/paste this to `config/development.yaml` and `config/production.yaml` and edit
them accordingly for your environment.

### Project structure

This is a somewhat opinionated template that is runnable out of the box. The project is TypeScript with
a linter that matches the bot-sdk itself. All the good bits of the bot are under `src/`.

#### `src/index.ts`

This is where the bot's entry point is. Here you can see it reading the config, preparing the storage,
and setting up other stuff that it'll use throughout its lifetime. Nothing in here should really require
modification - most of the bot is elsewhere.

#### `src/commands/handler.ts`

When the bot receives a command (see `index.ts` for handoff) it gets processed here. The command structure
is fairly manual, but a basic help menu and processing for a single command is there.

#### `src/commands/hello.ts`

This is the bot's `!bot hello` command. It doesn't do much, but it is an example.

#### `src/config.ts`

This is simply a typescript interface for your config so you can make use of types.

#### `lib/`

This is where the project's build files go. Not really much to see here.

#### `storage/`

This is the default storage location. Also not much to see here.

### Help!

Come visit us in [#matrix-bot-sdk:t2bot.io](https://matrix.to/#/#matrix-bot-sdk:t2bot.io) on Matrix if you're
having trouble with this project.


## :wave: Contributing

<a href="https://github.com/C-Iaens/XWiki-Matrix/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=C-Iaens/XWiki-Matrix" />
</a>


Contributions are always welcome!

## :warning: License

Distributed under the Apache License. See `LICENSE.md` for more information.


<!-- Contact -->
## :handshake: Contact

GridexX - [@gridexx](https://twitter.com/gridexx) - arsene.fougerouse@xwiki.com

Project Link: [https://github.com/C-Iaens/XWiki-Matrix](https://github.com/C-Iaens/XWiki-Matrix)


