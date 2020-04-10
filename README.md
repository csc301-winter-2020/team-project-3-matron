# Installation

## Set up Database

To set up the MongoDB server, it will have to be either self-hosted or hosted on an online cloud provider like Atlas. 
To self-host the database, visit [the official website](https://www.mongodb.com/download-center/community) to download the server and follow the instructions to install it.
To host it on a cloud provider such as MongoDB Atlas, which we recommend, visit the [provider's website](https://www.mongodb.com/download-center/cloud) and follow instructions to set it up.

After setting up the MongoDB server, you should have both a `URL` and `password` for the new server. Keep these safe, as they will be required for the next step when setting up the Matron application.

## Set up the Application

There are two options to set up the Matron application: it can either be set up to run locally on your own computer or hosted on a cloud provider like Heroku.

### Set it up locally

0. Download/install Python3 from the [the official website](https://www.python.org/downloads/).

1. `git clone https://github.com/csc301-winter-2020/team-project-3-matron.git` to download the repository.
2. `cd team-project-3-matron/app` to navigate to the correct directory.
3. `pip install -r requirements.txt` to install the dependencies.
4. `python run_local.py <DB_URL> <DB_PASS>` to run the server with the given params.

Where `<DB_URL>` and `<DB_PASS>` are the URL and Password of your MongoDB server, in quotes.

<!--
1. Download the project from the repository either by downloading as a zip or running `git clone https://github.com/csc301-winter-2020/team-project-3-matron.git` from the command line

2. Ensure you have the latest version of Python installed. It can be downloaded from [the official website](https://www.python.org/downloads/).

3. Add two environment variables to your system

    1. Set the `DB_URL` variable to the URL of your MongoDB server from the previous section
    
    2. Set the `DB_PASS` variable to the password of of your MongoDB server from the previous section

4. Navigate to the project folder and then, from the command line, run `pip install -r requirements.txt` to install the Python dependencies needed to run the project.

5. From the command line, run `python ./app/main.py` to start the server. It can then be accessed from your web browser by navigating to `localhost:80`
-->

### Developing it locally

0. After setting up the project locally, download/install NodeJS from [the official website](https://nodejs.org/en/).
1. `npm install` in the project root directory to install the dependencies.
2. `npm run dev` to run the watch script the auto-recompiles the project on changes to `app/static/js/index.js`.

### Set it up on Heroku

1. Download and install the Heroku command line interface from the [official website](https://devcenter.heroku.com/articles/heroku-cli#download-and-install) and make an account

2. Download the project from the repository either by running `git clone https://github.com/csc301-winter-2020/team-project-3-matron.git` from the command line. Then navigate to the folder that was just created.

3. Create a new Heroku app by running `heroku create` from the command line. You will then a URL printed, which will be the URL of the website once it's up.

4. Set the environment variables by running `heroku config:set DB_URL=<THE URL FOR YOUR DB>` and `heroku config:set DB_PASS=<THE PASSWORD FOR YOUR DB>`

5. Deploy the app to Heroku by running `git push heroku master` from the command line. You should then be able to access the application from the URL you got in step 2.

# Main Routes

There are a few main routes which allow other applications to interact with the virtual blueprint. All routes are designed to accept GET requests.

 - `/graph/names`: gets the names of all saved graphs
 
 - `/graph/all_distances/<graphname>`: gets all distances between every pair of nodes in the `<graphname>` graph
 
 - `/graph/distances_from_room/<graphname>/<roomname>`: gets all distances between `<roomname>` and every other room in the `<graphname>` graph
 
 - `/graph/distance_two_rooms/<graphname>/<room1>/<room2>`: gets all distances between `<room1>` and `<room2>` in the `<graphname>` graph