# GloriaFood Plugin

Simple plugin to export GloriaFood clients to HubSpot using [Heroku Scheduler](https://devcenter.heroku.com/articles/scheduler).

## Running Locally

Make sure you have [Node.js](http://nodejs.org) and the [Heroku CLI](https://cli.heroku.com) installed.

```sh
git clone https://github.com/tiflisgroup/gloriafood.git # or clone your own fork
cd gloriafood
npm install
```

Run the plugin with `node index.js`.

## Deploying to Heroku

```
$ heroku create
$ git push heroku master
$ heroku open
```
or

[![Deploy to Heroku](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)

## Documentation

For more information about using Node.js on Heroku, see these Dev Center articles:

- [Getting Started on Heroku with Node.js](https://devcenter.heroku.com/articles/getting-started-with-nodejs)
- [Heroku Node.js Support](https://devcenter.heroku.com/articles/nodejs-support)
- [Node.js on Heroku](https://devcenter.heroku.com/categories/nodejs)
- [Best Practices for Node.js Development](https://devcenter.heroku.com/articles/node-best-practices)
- [Using WebSockets on Heroku with Node.js](https://devcenter.heroku.com/articles/node-websockets)