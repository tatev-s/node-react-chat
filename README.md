Node Js, Socket.io, PostgreSQL simple chat

DIRECTORY STRUCTURE
-------------------

      client/                    contains frontend views/assets
      server/                    contains server components
      server/config/             contains server configurations
      server/controllers/        contains Web controller classes
      server/helpers/            contains passport authentication and socket.io connection
      server/migrations/         contains sequelize migrations
      server/models/             contains models of database tables
      server/routes/             contains router
      server/services            contains service files for models


INSTALLATION
------------

### Install via NPM


~~~
npm install
~~~

Please install sequelize-cli globally

~~~
npm install -g sequelize-cli
~~~

### Database confitguration

Create database for project

~~~
CREATE DATABASE simplechat;
~~~

Change database connection access  `server/config/config.json`

Run migrations for create database tables

~~~
sequelize db:migrate
~~~

Run build

~~~
npm run build
~~~

Run application

~~~
npm run dev-start
~~~

```

You can then access the application through the following URL:

http://127.0.0.1:3002/
