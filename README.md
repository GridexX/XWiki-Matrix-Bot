<div align="center">

  <img src="assets/logo.png" alt="logo" width="200" height="auto" />
  <h1>MatriXWiki</h1>
  
  <p>
    An awesome bot to connect XWiki to Matrix !
  </p>

  
  
<!-- Badges -->
<p>
  <a href="https://github.com/GridexX/XWiki-Matrix-Bot/graphs/contributors">
    <img src="https://img.shields.io/github/contributors/GridexX/XWiki-Matrix-Bot" alt="contributors" />
  </a>
  <a href="">
    <img src="https://img.shields.io/github/last-commit/GridexX/XWiki-Matrix-Bot" alt="last update" />
  </a>
  <a href="https://github.com/GridexX/XWiki-Matrix-Bot/network/members">
    <img src="https://img.shields.io/github/forks/GridexX/XWiki-Matrix-Bot" alt="forks" />
  </a>
  <a href="https://github.com/GridexX/XWiki-Matrix-Bot/stargazers">
    <img src="https://img.shields.io/github/stars/GridexX/XWiki-Matrix-Bot" alt="stars" />
  </a>
  <a href="https://github.com/GridexX/XWiki-Matrix-Bot/issues/">
    <img src="https://img.shields.io/github/issues/GridexX/XWiki-Matrix-Bot" alt="open issues" />
  </a>
  <a href="https://github.com/GridexX/XWiki-Matrix-Bot/blob/master/LICENSE">
    <img src="https://img.shields.io/github/license/GridexX/XWiki-Matrix-Bot.svg" alt="license" />
  </a>
</p>
   
</div>

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
    - [:triangular\_flag\_on\_post: Deployment](#triangular_flag_on_post-deployment)
    - [:telescope: Project structure](#telescope-project-structure)
      - [`src/index.ts`](#srcindexts)
      - [`src/commands/handler.ts`](#srccommandshandlerts)
      - [`src/commands`](#srccommands)
      - [`src/config.ts`](#srcconfigts)
    - [`lib/`](#lib)
    - [`storage/`](#storage)
  - [:wave: Contributing](#wave-contributing)
  - [:warning: License](#warning-license)
  - [:handshake: Contact](#handshake-contact)

  

<!-- About the Project -->
## :star2: About the Project

This project aims to retrieve information located in a XWiki instance from to a Matrix Bot. It uses under the hood the REST APi of XWiki and ChatGPT to provide resume of Wiki's pages.

<!-- Features -->
### :dart: Features

- Search pages in the wiki and get a summary of each of them
- Retrieve the list of users
- Ask for questions resumed from the Wiki



<!-- Env Variables -->
### :key: Environment Variables

To run this project, you will need to copy the `.env.example` file into a `.env` and fill values for all variables.

⚠️ You will need an `API_KEY` in order to use ChatGPT resume functions !

<!-- Getting Started -->
## 	:toolbox: Getting Started

<!-- Prerequisites -->
### :bangbang: Prerequisites

- This project uses Npm as package manager.
- A Matrix Bot setup is needed to query commands. You can follow this [tutorial](https://turt2live.github.io/matrix-bot-sdk/tutorial-bot.html) to creates one.


<!-- Installation -->
### :gear: Installation

1. Clone the project

    ```bash
    git clone https://github.com/GridexX/XWiki-Matrix-Bot.git
    ```

2. Go to the project directory

    ```bash
    cd XWiki-Matrix-Bot
    ```

3. Install dependencies

    ```bash
    npm install
    ```

4. Start the application in development mode

    ```bash
      npm run start:dev
    ```

<!-- Deployment -->
### :triangular_flag_on_post: Deployment

To deploy this project, you should first completed the getting started and follow those steps 

1. Compile TypeScript code into JavaScript:

    ```bash
    npm run build
    ```

2. Build the Docker image:

    ```bash
    docker build . -t <NAME>
    ```

3. Upload the image to the docker hub

    ```bash
    docker push <NAME>
    ```

4. Then run the image into a production server:
  
  ```bash
  docker run <options> <NAME>
  ```

<!-- Project Structure -->
### :telescope: Project structure

This is a somewhat opinionated template that is runnable out of the box. The project is TypeScript with a linter that matches the bot-sdk itself. All the good bits of the bot are under `src/`.

#### `src/index.ts`

This is where the bot's entry point is. Here you can see it reading the config, preparing the storage,
and setting up other stuff that it'll use throughout its lifetime. Nothing in here should really require
modification - most of the bot is elsewhere.

#### `src/commands/handler.ts`

When the bot receives a command (see `index.ts` for handoff) it gets processed here. The command structure
is fairly manual, but a basic help menu and processing for a single command is there.

#### `src/commands`

Here are located the commands functions used.
Type `aibot help` to have a list of the available comands

#### `src/config.ts`

This is simply a typescript interface for your config so you can make use of types.

### `lib/`

This is where the project's build files go. Not really much to see here.

### `storage/`

This is the default storage location. Also not much to see here.

## :wave: Contributing

<a href="https://github.com/GridexX/XWiki-Matrix-Bot/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=GridexX/XWiki-Matrix-Bot" />
</a>

Contributions are always welcome!

## :warning: License

Distributed under the Apache License. See `LICENSE.md` for more information.

<!-- Contact -->
## :handshake: Contact

GridexX - [@gridexx](https://twitter.com/gridexx) - [arsene582@gmail.com](mailto:arsene582@gmail.com)

Project Link: [https://github.com/GridexX/XWiki-Matrix-Bot](https://github.com/GridexX/XWiki-Matrix-Bot)
