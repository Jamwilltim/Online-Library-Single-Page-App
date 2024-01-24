# Online Library

Created by James harvey for Programming (black) individual coursework

## Loading website

First, you must clone the files onto your local machine by running the command bellow into Git Bash:

```bash
git clone https://github.com/Jamwilltim/Online-Library-Single-Page-App.git
```

Then run `npm install` in your terminal, this will install all of the necessary dependancies to run the project, which in this case is just `express.js`.

Once all files and dependancies are installed you can launch the server with:

```shell
npm start
```

If you wish to use `nodemon` then you will have to install it separately using:

```shell
npm install nodemon --save-dev
```

You will also have to make sure that you have the `nodemon.json` file on your local device as this ensures the server doesn't restart when `POST` requests are made

The command to run the server with `nodemon` is

```bash
npm run server
```

## Documentation

The documentation can be found [here](https://james-harvey.gitbook.io/api-reference-index/)
