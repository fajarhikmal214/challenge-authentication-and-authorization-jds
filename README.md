# Challenge Digiteam (Authentication & Authorization)

This repository will be contains result of challenge authentication and authorization for preparation digiteam project at **Jabar Digital Service**


## Tech Stacks

- **TypeScript** - <https://www.typescriptlang.org/>
- **Node.js** - <http://nodejs.org/>
- **Nest Js** - <https://https://nestjs.com/>
- **Type ORM** - <https://typeorm.io/>
- **PostgreSQL** - <https://www.postgresql.org/>


## Quick Start

Clone the project:

```bash
$ git clone https://github.com/fajarhikmal214/challenge-digiteam-jds.git
$ cd challenge-digiteam-jds
$ cp .env.example .env
```


## Installing Dependencies

- With npm

  ```bash
  # Install node packages
  $ npm install
  ```

- With yarn

  ```bash
  # Install node packages
  $ yarn install
  ```


## Applying Migrations

Make sure there is already a PostgreSQL database created and the credetials are filled in the `.env` file

- Locally
  - With npm

    ```bash
    # apply migrations to database
    $ npm run migration:run
    ```

## Applying Database Seeders

Make sure there is already a PostgreSQL database created, the credetials are filled in the `.env` file and all migrations already migrated

- Locally
  - With npm

    ```bash
    # apply migrations to database
    $ npm run seed:run
    ```

## How to Run

- Run locally
  - With npm

    ```bash
    $ npm run start:dev
    ```
