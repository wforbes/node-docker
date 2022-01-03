# node-docker
 Sample API to learn docker with node/express.
 
 Following along with: [https://freecodecamp.com/news/learn-docker-by-building-a-node-express-app](https://freecodecamp.com/news/learn-docker-by-building-a-node-express-app)

 Using the full video found here: [https://www.youtube.com/watch?v=9zUHg7xjIqQ](https://www.youtube.com/watch?v=9zUHg7xjIqQ)

## Docker images used
- Mongo: [https://hub.docker.com/_/mongo](https://hub.docker.com/_/mongo)
- Redis: [https://hub.docker.com/_/redis](https://hub.docker.com/_/redis)
- Nginx: [https://hub.docker.com/_/nginx](https://hub.docker.com/_/nginx)

## Node dependencies used
- mongoose: [https://mongoosejs.com/](https://mongoosejs.com/) // [https://www.npmjs.com/package/mongoose](https://www.npmjs.com/package/mongoose) 
	- Makes working with MongoDB easier
- bcryptjs: [https://www.npmjs.com/package/bcryptjs](https://www.npmjs.com/package/bcryptjs)
	- Used to hash user passwords so they aren't stored in the database as plain text
- express-session: [https://github.com/expressjs/session](https://github.com/expressjs/session)
	- Used to create a session cookie to send back to the client and store to remember that client over a specified amount of time
- connect-redis: [https://www.npmjs.com/package/connect-redis](https://www.npmjs.com/package/connect-redis) // [https://github.com/tj/connect-redis](https://github.com/tj/connect-redis)
	- Used to store session data in a Redis in-memory data store
- cors: [https://www.npmjs.com/package/cors](https://www.npmjs.com/package/cors)
	- (Optional) Used to allow access to this api from domains outside of its own

## General setup
- Docker Desktop install on Windows instructions: [docs.docker.com/desktop/windows/install](https://docs.docker.com/desktop/windows/install/)
- Docker requires virtualization ([Troubleshooting Docker on Windows for Virtualization](https://docs.docker.com/desktop/windows/troubleshoot/#virtualization)).
	- I used WSL 2 on Windows Home, but Hyper-V is used on Windows Pro/Enterprise.
	- Windows features 'Virtual Machine Platform' and 'Windows Subsystem for Linux' should be enabled
	- Bios setting to enable virtualization should be set

## Notes
### files mentioned in video (in order)
- **Dockerfile** specifies the docker build steps for the app
- **.dockerignore** specifies files that shouldn't be copied into the docker container
- **.env** specifies environment variables that should be set when the container runs
- **docker-compose.yml** ([Docker Compose docs will explain](https://docs.docker.com/compose))
- **docker-compose.dev.yml** & **docker-compose.prod.yml** docker compose files used to specify variations between the the development and production environments
- **./config/config.js** configuration file used for node app
- **./nginx/default.conf** sets proxy configuration for the nginx container

### terminal commands for working with docker
#### basics
- Build docker image and name it with the -t flag:
	- `docker build -t node-app-image .`
- Run docker image with the -p flag to open in/out ports, the -d flag to detach the process from the terminal/console, and the --name flag to specify a name, using the name of the image:
	- `docker run -p 3000:3000 -d --name node-app node-app-image`
- List the running docker containers:
	- `docker ps`
- Remove a running docker container instance by name, using the -f flag for 'force' to avoid having to stop the running container before removing it:
	- `docker rm node-app -f`
- Log in to the docker container and see files in it:
	- `docker exec -it node-app bash` with `ls` to list files
	- `exit` to exit bash
- Add *.dockerignore* file to specify files not to copy during container build, this reduces files needlessly copied to container


<span style="font-size:0.7em">(video timestamp 31:46)</span>


#### developing directly in container (code changes in editor directly update code in container)
- Run image with volume flag to bind mount a volume. This updates changes to code with the /app dir in container
	- On powershell: `docker run -v ${pwd}:/app -p 3000:3000 -d --name node-app node-app-image`
	- On cmd: `docker run -v %cd%:/app -p 3000:3000 -d --name node-app node-app-image`
	- On unix: `docker run -v $(pwd):/app -p 3000:3000 -d --name node-app node-app-image`
- Install nodemon to restart node.js in container upon dev changes `npm install nodemon --save-dev`
- Can delete node_modules locally and keep bind mount from deleting node_modules in container by creating an anonymous volume with another -v flag `-v /app/node_modules` in run command
- Add `:ro` to the end of the bind mount volume to specify 'read-only' so that file changes on the container aren't pushed to our dev code files, and files can't be changed on container.
- Complete command to bind mount volume, volume to conserve node_modules, and run as readonly (on powershell):
	- `docker run -v ${pwd}:/app:ro -v /app/node_modules -p 3000:3000 -d --name node-app node-app-image`


<span style="font-size:0.7em">(video timestamp 55:10)</span>


#### specify and set environment variables
- *ENV* command in Dockerfile sets a default environment variable that can be used in app. ex: `ENV PORT 3000` sets the PORT env var to 3000
- Environment variables can be set in run command with `--env PORT=####` added to it
	- Full command, with matching listening port set: `docker run -v ${pwd}:/app:ro -v /app/node_modules --env PORT=4000 -p 3000:4000 -d --name node-app node-app-image`
- Can confirm env variable is set by executing the shell to see container files with `docker exec -it node-app bash`, the use `printenv` command to view current environment variables
- Add the file *.env* to list multiple environment variables and specify it with `--env-file` in the run command
	- Full command, with env file specified: `docker run -v ${pwd}:/app:ro -v /app/node_modules --env-file ./.env -p 3000:4000 -d --name node-app node-app-image`


<span style="font-size:0.7em">(video timestamp 1:01:32)</span>


#### Removing anonymous volumes
- Running and removing containers preserves anonymous volumes (like the ones set with `-v /app/node_modules`), which build up over time
	- See these volumes with `docker volume ls`
	- Manually remove these volumes with `docker volume prune`. Remove individual volumes with `docker volume rm <volume name>`
	- **NOTE:** Sometimes removing volumes may not be desired, in the case of wanting to preserve SQL databases
	- Delete volumes when removing docker container by adding `v` flag: `docker rm node-app -fv`


<span style="font-size:0.7em">(video timestamp 1:04:02)</span>


#### Automate with Docker Compose (basics)
- The command to run the docker container we've seen so far is long. In practice, we may have multiple containers running at once. Each requires a run command, which will get to be a hassle.
- Add the file *docker-compose.yml* to project root to set up automating multiple docker containers
- Docker Compose docs are at [docs.docker.com/compose](https://docs.docker.com/compose/), this video uses version 3
- yml files are whitespace centric, like Python. Indents create blocks. Pay close attention to your whitespace in yml files.
- The docker-compose.yml file line-by-line:
	- Specify the version with `version: "#"`, here we use `version: "3"`
	- Specify the services with `services:`, each item indented under this will be a container.
	- Indented once under services, we specify the name of our container with `node-app:`. This name matches previous commands, but it could be anything.
	- Indented twice under the container name, we set details about this container service.
		- `build: .`, specifying **.** for the current directory automates the build command.
		- `ports:` specifies a list of ports to open. Lists are made with another indentation under this line and a hyphen at the beginning of the list item
			- `- "3000:3000"` will mimmic our previous run commands. Additional ports can be opened with a new line, similar indents, and double quotes around the in:out ports.
		- `volumes:` specifies a list of volumes, mimicing the volumes flag in our previous run command. This will be one for our root to /app copy, and another to preserve the node_modules folder
			- `- ./:/app` next line indented again under volumes
			- `- /app/node_modules` next line indented to match previous
		- `environment:` sets a list of environment variables to specify literally here in the compose file.
			- `- PORT=3000` will mimic the --env option in the earlier run commands.
		- OR `env_file:` can be used to specify the environment variables file to mimic the `--env-file` option set in our previous run command
			- `- ./.env` indented under env_file:, specifies where our env file is
			- Ensure that the .env file PORT variable is set to 3000 to match the 3000:3000 set in `ports:`.
- Running `docker-compose up -d` will "Build, (re)create, start, and attach to containers for a service."
	- The `-d` flag will run it detached, like before.
	- This `up` command has multiple options depending on whether the containers are already running or not. By default, if new changes are detected, it will stop/recreate containers and preserve their volumes. (from: [Docker Compose docs for 'up'](https://docs.docker.com/compose/reference/up/))
- Notice that listing the running container with `docker ps -a` will show a different name now, like `node-docker_node-app_1`. This name must be used instead of `node-app` with commands like `exec` to see inside it.
- `docker-compose down -v` will stop and remove the running container(s)
- After making changes to the project, running `docker-compose up -d` again won't rebuild the image. It just looks for an image by name, if it exists it just runs it. 
	- An example would be changing the port for the app. That'd include changing the Dockerfile ENV PORT line, the ports line in docker-compose.yml file, the .env file, and the port variable in index.js. Using the 'docker-compose up -d' command alone won't rebuild the image to reflect this change.
	- Adding the `--build` option to the command forces it to rebuild the image
	- Full command: `docker-compose up -d --build`


<span style="font-size:0.7em">(video timestamp 1:20:25)</span>


#### Setting up to deploy to dev and prod environments
- We can create different Dockerfile and docker-compose files with variations on the commands used. Comes down to personal preference. Here, we will use one Dockerfile and two different docker-compose files.
- Start by renaming our current docker-compose file to something like `docker-compose.backup.yml`
- Then, create three variations of this file. `docker-compose.yml`, `docker-compose.dev.yml`, `docker-compose.prod.yml`
- There's no point in copy/pasting all the shared information between these three files, or any other environment specific docker-compose files we may have. Some projects have many of them. All the need to share are the first three lines: the version, services option, with node-app option in it.
	- The `docker-compose.yml` should include all the shared configuration between the two environments 'dev' and 'prod'.
		- This includes the version with the build and ports options (in services, node-app).
		- Also, the environment option with a variable for `PORT=3000`.
	- The `docker-compose.dev.yml` should include what's specific for the dev environment
		- This includes the version, the volumes option, and the environment option with `NODE_ENV=development`
		- Then, we override the Dockerfile's "CMD" line with the "command:" option in this dev yml file. The value should be `npm run dev`, to trigger our package.json dev script to run nodemon.
	- At this point, we can set the Dockerfile's CMD array members to be "node", "index.js"
	- The `docker-compose.prod.yml` only need include the variations of the dev file.
		- These include the 'environment' option being set to `NODE_ENV=production` and the 'command' option as `node index.js`
- Now running `docker-compose up` needs a specifically ordered set of file names with the -f flag before them. This combines the options from our multiple files.
	- To run dev, `docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d`
	- Testing dev can include modifying the index.js file to see changes appear on the page at 'localhost:3000' while the container is running.
	- To bring it down, use the same set of files in the command with the `down -v` command/flag at the end. `docker-compose -f docker-compose.yml -f docker-compose.dev.yml down -v`
	- To run prod, use the same commands but specify the `docker-compose.prod.yml` file instead of the dev one.
	- In prod, there is no bind mount set, so making changes to index.js shouldn't be reflected on the page until the image is rebuilt with the --build option in the terminal command.
- Notice that if we leave the prod container running, then run terminal command `docker exec -it ((name)) bash` to get into the container, then `ls` to see the files... all these new docker-compose files are there that don't need to be.
	- adding `docker-compose*` to the .dockerignore file will remedy this
- More importantly, if we change directories into the node_modules folder and list its contents.. we see **nodemon** is present.
	- We don't want our development dependencies included in our PROD container!
		- We can remedy this by embedding a bash statement in the RUN line of our 'Dockerfile':
		`ARG NODE_ENV`
		`RUN if [ "$NODE_ENV" = "development" ]; \`
		`then npm install; \`
		`else npm install --only=production; \`
		`fi`
	- Notice, this uses the ARG keyword to pass in that NODE_ENV value. In order to account for that we need to pass that into the 'build' option in our docker-compose files.
		- This means giving 'build' two members, context and args. The 'context' value is the same '.' value our old build option had. The 'args' value is a key/value to give NODE_ENV a value of either 'development' or 'production'.
		`build:`
		`  context: .`
		`  args:`
		`    NODE_ENV: development`
		or
		`    NODE_ENV: production`
	- We can test this change by again checking the node_modules folder in the prod container to see nodemon is not present, as well as running `printenv` in the container bash to see the 'NODE_ENV=production' environment variable set properly.


<span style="font-size:0.7em">(video timestamp [1:44:48](https://www.youtube.com/watch?v=9zUHg7xjIqQ&t=6287s))</span>


### Working with multiple containers
#### Using a MongoDB container
- For the second container in our project, we'll set up a MongoDB container to begin persisting data.
	- On Docker Hub, searching for mongodb provides information on the official mongoDB container ([https://hub.docker.com/_/mongo](https://hub.docker.com/_/mongo))
	- Here starting a mongo server instance uses the `docker run --name (instance-name) -d mongo:tag` command, where tag is the MongoDB version you want
- In our 'docker-compose.yml' file, we can add another option under 'services' with a name for the mongo instance. Here, we're using 'mongo' but it can be anything.
- Instead of customizing the build like we did on the 'node-app' container with the 'build' option, with 'mongo' we can use the 'image' option to copy in the provided image. `image: mongo`
	- We'd like to use the most up to date image version, so we won't specify the 'tag'
- In the 'Environment Variables' section of ([https://hub.docker.com/_/mongo](https://hub.docker.com/_/mongo)), the two env vars we need to specify are described: **MONGO_INITDB_ROOT_USERNAME** and **MONGO_INITDB_ROOT_PASSWORD**
	- We add these to the 'environment' option in the 'docker-compose.yml' file under the 'mongo' container details
	- Give each of them any values you want
- With this new info added to the 'docker-compose.yml' file, run our up command with the two compose files and the build flag `docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build`
	- You should see the normal 'building node-app' load info in terminal, then you should also see 'Pulling mongo (mongo:)...' along with download messages for our new second container
	- Once that's complete, running `docker ps` should list two containers, 'node-docker_node-app' and 'mongo'
- We can now log into this new container and perform actions on the mongo app running in it.
	- Use the exec command we've seen before `docker exec -it node-docker_mongo_1 bash`
	- The tutorial says to use the `mongo` command to open the mongo shell, though now I see that's been depreceated so you may need to use `mongosh` instead
		- This command needs the username and password you set in the 'docker-compose.yml' file, specify them with the -u and -p flags: `mongo -u "username" -p "password"`
	- Once the mongo shell is open, run the `db` command to see the default database set up by the image. Mine was named 'test'.
	- We can use the `use` command to create and switch to a new database by passing it the name of a new database. Try `use mydb`
		- We can run `show dbs` to list the databases, but we won't see our new database here (or the test database) until it has a document/entry saved in it. Right now it's empty
	- Let's add a document to this database with the insert function: `db.books.insert({"name": "harry potter"})`
		- We should now see our inserted document with the `db.books.find()` function
		- We should also see our 'mydb' database in the list of `show dbs`
	- You can use the `exit` command to leave the mongo shell
	- Important Note: Instead of running exec to open the container, then the mongo command to open the shell... we can combine these by using exec to go straight to the shell: `docker exec -it node-docker_mongo_1 mongo -u "username" -p "password"`


<span style="font-size:0.7em">(video timestamp 1:51:35)</span>


#### Creating a named volume
- If we run the `docker-compose ... down -v` command to spin down this container, the new database we created will go poof. Try it. Spin down the container, then bring it back up again, exec into the mongo shell and run `show dbs` again.. the 'mydb' database isn't there.
- To remedy this, we need to specify volumes for this container.
- We could create an anonymous volume like we've been doing, but this isn't always the most useful thing to do because it's hard to tell which one is which.. their names aren't easily human readable.
- Instead, we should create a named volume. It's the same as an anonymous volume.. only with a human readable name that can easily be identified when working with it.
- Inspecting [https://hub.docker.com/_/mongo](https://hub.docker.com/_/mongo) in the 'Where to Store Data' section, it describes creating a data directory on the host system and bind-mounting it to a directory in the container `docker run --name something -v /my/own/datadir:/data/db -d mongo`
	- That -v flag value shows the bind-mount
- We can specify a named volume for this by adding a `volumes:` option to the service in our 'docker-compose.yml' file, then giving it a value like `- mongo-db:/data/db`.
	- Here the 'mongo-db' is the name of the volume, followed by a colon, and then the directory of the volume
- If we run the 'docker-compose ... up' command now, we'll get an error:
	- `ERROR: Named volume "mongo-db:/data/db:rw" is used in service "mongo" but no declaration was found in the volumes section.`
	- We need to declare this named volume in our docker-compose file. This is because named volumes can be used by multiple services.
	- So, to remedy this, we simply just need to add a `volumes:` section at the root (no indents) to the bottom of the 'docker-compose.yml' file after the `services:` section. Add our named volume indented under it with a colon: `mongo-db:`
- With the named volume added to `mongo:` and the root `volumes:` declaration in place, we can run the `docker-compose ... up` command and it should build as before.
- Now, we can exec into the mongo shell on the mongo container `docker exec -it node-docker_mongo_1 mongo -u "username" -p "password"` and re-do our work in it
	- `show dbs` to see the admin, config, and local databases
	- `use mydb` to create a new database and switch into it
	- `db.books.insert({ "name": "harry potter" })` to insert an entry
	- `db.books.find()` to show this entry
	- `exit` to leave the shell and container
- New Problem: We're using the -v flag in our `docker-compose ... down -v` command to delete the anonymous volume in the docker-compose file `- /app/node_modules`, but there's a problem now ... it will ALSO delete the named volume we just set up.
	- **IMPORTANT**: Given this, we can't use the `-v` flag in our `docker-compose ... down` command anymore. We will just have to delete the anonymous volumes manually as they begin to pile up
	- Run the `docker-compose ... down` command now, without the `-v` flag.
	- Run `docker volume ls` and you should see any least a couple anonymous volumes listed with a big string of hex values as the VOLUME NAME. These are the anonymous volumes we aren't deleting with `-v` anymore.
	- We *could* run `docker volume prune` right now to delete these volumes, but the tutorial recommends doing this while the containers are running... i.e. *after* running `docker-compose ... up -d`. This will ensure that only the volumes we **aren't** using will be pruned away and deleted.
	- So go ahead and run `docker-compose ... up -d`, then run `docker volume prune`. This will remove the containers that aren't being used anymore and we don't need.
	- Verify this by running `docker volume -ls` to see that there are fewer volumes.
- Finally, we can verify all this has gone correctly by running exec into mongo again, showing the dbs to see our 'mydb' is still there, switching to it, then running the find function to see our data persisted
	- `docker exec -it node-docker_mongo_1 mongo -u "username" -p "password"` to get in
	- `show dbs` to list databases and verify mydb is still there
	- `use mydb` to switch to it
	- `db.books.find()` to see our persisted data


<span style="font-size:0.7em">(video timestamp [2:01:48](https://www.youtube.com/watch?v=9zUHg7xjIqQ&t=7308s))</span>


#### Communicating between containers
- To communicate with the mongodb container, our app can use 'mongoose' so lets install it
	- [https://www.npmjs.com/package/mongoose](https://www.npmjs.com/package/mongoose)
	- Install mongoose to the project with `npm install mongoose`
	- Then bring down the containers (without -v)
	- And bring them up again with the `docker-compose ... up -d --build` command
- The Mongoose documentation for [connections](https://mongoosejs.com/docs/connections.html) shows connecting to the database with  the `mongoose.connect('mongodb://username:password@host:port/database?options...')` function
	- This function needs your ip in the host portion.
	- To find this, first do a `docker ps` command to see the names of your containers.
	- Then do a 'docker inspect' command with the name of the container: `docker inspect node-docker_mongo_1`
	- In all this information, the "NetworkSettings" > "Networks" > "node-docker_default" > "IPAddress" has the container ip
	- Mine was 172.22.0.2
	- Then it needs the port, the default for mongo is 27017
- In index.js we add the mongoose.connect function with a .then() and .catch() chain because it returns a promise.
	- In the .then() callback, output that db connection was successful
	- You can test this by using `docker logs node-docker_node-app_1` (substitute your node app's name). This should result in the console output appearing near the end of the log output.
- Problem: There's no guarantee that the IP address will always be the same. We shouldn't actually use the IP here.
	- Solution: You can reference the docker container by "services:" name from the docker-compose file. In this case the name we can use is `mongo`, since that's what our mongo container's service name is. That is what we should use instead of the ip address. Keep the port.
	- Using the `docker logs node-docker_node-app_1 -f` command (with the -f for follow), we can test this change live to see the logs display a connection and our successful db connection console
- By using exec to drop into the bash of the node-app container, we are able to `ping mongo` and confirm that the node-app container is able to talk to our mongo container. 
	- CTRL+C to stop the ping
	- `exit` to leave the node-app container bash.


<span style="font-size:0.7em">(video timestamp [2:12:00](https://www.youtube.com/watch?v=9zUHg7xjIqQ&t=8505s))</span>


#### Express Config file
- You shouldn't hardcode your mongo URL in the application. It's better to create a config file to keep this in instead.
	- Create a config folder in the root directory and add a 'config.js' file there.
	- In the 'config.js' file add a module.exports object
	- In the module.exports object, add the username, password, service name, port fields as 'MONGO_...' with each getting a value of process.env.(field name). The service name and port can default to 'mongo' and 27017 with a logical OR.
	- The username and password can be added to the dev docker-compose 'environment' section under node-app as `- MONGO_USER=(username)` and `-MONGO_PASSWORD=(password)`
	- We'll need to bring down the containers and rebuild them after updating the environment vars
- We can also copy over the mongo section from docker-compose.yml to docker-compose.dev.yml and remove the 'image' section because it's shared between environments


<span style="font-size:0.7em">(video timestamp [2:21:45](https://www.youtube.com/watch?v=9zUHg7xjIqQ&t=8505s))</span>


#### Container bootup order
- We can't know what order the containers will start up with and this can cause problems because the node-app container needs to connect to the mongo container when it starts.
	- To make sure they start up in the proper order, add the `depends_on:` option to the node-app service section in the docker_compose.yml file, and pass the name of the mongo service `- mongo` in to it.
	- Even with this implemented, we can't know if mongo will be available and up when the node-app container tries to connect to it. Mongoose retries for 30 seconds automatically, but it's possible that for this or other containers we'll need to create some application logic to handle scenarios like this.
	- The tutorial has us create a recursive function that tries to connect every. The creator isn't sure if it's the best way to do it, but he assures us we should be able to handle the database being down on our own without depending on mongoose alone.
- You can start up the node-app container without it's dependencies with the '--no-deps' flag on `docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d --no-deps node-app`. This way we can test the failure state where mongo database isn't running when node-app tries to connect to it.


<span style="font-size:0.7em">(video timestamp [2:32:26](https://www.youtube.com/watch?v=9zUHg7xjIqQ&t=9146s))</span>


#### Building a CRUD application
- Aim to be simple, as this tutorial focuses on docker (not node/express) so these points are sparse of details
- Create a models, controllers and routes directory at root
- Create a postModel.js file in the models directory
	- Define the mongoose schema in this model file
- Create a postController.js file in the controllers directory
	- Import the postModel file here and define the endpoint functions for posts using the mongoose functions made available on the Post model:
		- getAllPosts : find()
		- getOnePost : findById() 
		- createPost : create()
		- updatePost : findByIdAndUpdate()
		- deletePost : findByIdAndDelete()
- Create a postRoutes.js file in the routes directory
	- Import express, postController, and get the express Router
	- On the router, define the "/" and "/:id" routes
	- The root route gets the getAll and create functions from the controller
	- The id route gets the getOne, update, and delete functions from the controller
- In the index.js file, we just need to import the postRoutes.js file and then below the root 'get' declaration, set the express 'app' object to use the postRouter at our designated route
	- `app.use("/api/v1/posts", postRouter);
- We also need to pass in the express.json() middleware to the app object before our route declarations
- In the video, these changes are tested using Postman [https://www.postman.com/downloads/](https://www.postman.com/downloads/)


<span style="font-size:0.7em">(video timestamp [2:51:27](https://www.youtube.com/watch?v=9zUHg7xjIqQ&t=10287s))</span>


#### Sign up and Login
- Create a model, controller and routes file for 'users' like we did with 'posts'
	- Model only contains username and password
	- Controller only has a signup() function that uses mongoose.create() to create a new user and return it
	- Route only has a "/signup" route on POST
- Add an app.use call for the userRoutes file
- Notice that we don't want to store the password in plain text, we should hash it
	- Take down the containers, run `npm install bcryptjs`, bring the containers back up with --build
	- import bcryptjs in the user controller, use the .hash() function to hash the password before running User.create()
- Add basic login feature
	- Add login method in user controller, look up the user by username, use bcrypt.compare() to test the given password, return 200 success if it was correct
	- Add "/login" route to user route file
- Test new routes and methods with Postman. Easy peazy.


<span style="font-size:0.7em">(video timestamp [3:06:57](https://www.youtube.com/watch?v=9zUHg7xjIqQ&t=11217s))</span>


#### Authentication with sessions & Redis
- We could use JWT or sessions, but for this tutorial we'll use sessions in order to demonstrate adding a Redis container to store the session
- Redis can be found on docker hub at [https://hub.docker.com/_/redis](https://hub.docker.com/_/redis)
	- Add a 'redis:' service in docker-compose, pass in the 'image:' option there with a value of 'redis'
	- Run the 'docker-compose... up -d' to pull redis and start the containers
- The connect-redis package provides the necessary npm install command: `npm install redis connect-redis express-session` per [https://www.npmjs.com/package/connect-redis](https://www.npmjs.com/package/connect-redis)
	- After running that npm install command, run the 'docker-compose ... up -d --build' to rebuild and account for the new redis dependencies
		- Running the up command while the containers are running without running the 'down' command first should use the `-V` flag as well. This renews the anonymous volumes for the containers.
- Once the new npm redis packages are installed and we've rebuilt the containers, we can follow the 'connect-redis' npm documentation
	- Import the 'redis' and 'express-session' packages in index.js
	- Import the 'connect-redis' and pass it the session
	- Create the redis client with .createclient() from the 'redis' object
		- The .createClient() function needs the redis url (ip in this case)
		- Set the REDIS_URL environment variable the same way we did with the MONGO_IP variable in config.js
		- The .createClient() function also needs the port, this can be done the same way that the MONGO_PORT was done. Redis default port is 6379.
	- Ensure the new config variables are imported from config.js
- Create a new middleware 'app.use()' call and pass it the express-session object
	- Pass the express session an object that defines the store (new RedisStore with client property using the redis client from .createClient()) and a 'secret' property which can be set in the config.js
	- Give the session() middlewire call a 'resave' and 'saveUninitialized' property, both set false
	- Give the session() middleware a 'cookie' property with the given values shown in index.js, change these later for our own uses. [https://github.com/expressjs/session](https://github.com/expressjs/session)
	- Add a session secret environment variable to the node-app section of 'docker-compose.dev.yml'
- Test the "/login" POST route in Postman, see that you're receiving a cookie back
- You can `docker exec -it node-docker_redis_1 redis-cli` into the running redis container, then run a `KEYS *` to see the active session keys, then run `GET "sess:....` with the session id to see the information of the cookie from redis perspective.
====
Quick Aside: Here I ran into a couple issues. This is what they were and how I solved them.
- We came to the part of the video where we test the "/login" POST route and I wasn't getting a cookie back. The redis container cli didn't show any cookies being created. 
	- First, in the video he sets 'resave' and 'saveUninitialized' properties on the cookie, but this is not correct in the current version of the middleware
		- The 'resave' and 'saveUninitialized' properties must be set on the object passed to session(), not in the cookie.
		- The express-session package changed so that leaving these properties out to default to true is now depreciated.
	- Next, setting the 'saveUnitialized' to false without modifying the session data elsewhere in the app caused the cookie still not to be retrieved.
		- I tried setting 'saveUninitialized' to true, but then the node app would crash when I hit the '/login' endpoint.
		- I realized the crash was caused by 'connect-redis' not being compatiable with Redis version 4, which is what is installed by default now.
		- I ran `npm uninstall redis` and then `npm install redis@3` as the connect-redis github readme instructs ( [https://github.com/tj/connect-redis](https://github.com/tj/connect-redis) )
	- Then, I could get a Cookie back from the POST "/login" requests from Postman, and I could see a Cookie saved in the redis-cli.... but I could see was that I was getting a Cookie for any request. This isn't desirable. We don't want a session created any time anyone requests anything from the api.
		- To solve this I read about what 'saveUninitialized' does in the express-session github readme [https://github.com/expressjs/session](https://github.com/expressjs/session)
		- I see that if we leave "saveUninitialized" as false, but modify the session data on successful "/login" requests to initialize it, we'll get the cookie on logins as we expect - but we don't get one on other requests
	- It turns out that this is actually what we will do in the next steps anyway.
====
- Now we add the mongodb user object to `req.session` after the password is confirmed correct in the authController.js 'login' function.
- We should do the same for the signup function, add the user object to the `req.session` upon successful signup.
- We can extend the maxAge of the session cookie now. I used '60000 * x' where x is the number of minutes the session should be active.
- Next we can add logic to the postRoutes.js file to restrict operations depending on if the user is logged in with a session or not.
	- Create a new directory called `middleware` at the root of the project and add a file `authMiddleware,js` to it.
	- In this file, define a function that gets the user object from the `req.session`, then checks to see if it exists. If not, then respond with a 401 "fail" response. If so, run the `next()` function. (see the authMiddleware.js file in the project here)
	- Import our new file into postRoutes.js and add it as the first argument in the get(), post(), patch(), and delete() calls
- We can test this by lowering the maxAge value to 1 min or 30 seconds.. then logging into the API with Postman and trying to create a Post on our app. Then wait for the session to expire (can confirm with redis-cli from docker exec), and trying to create another Post. We shouldn't be able to create a Post or perform the other API operations from Postman with an expired session (or before logging in).


<span style="font-size:0.7em">(video timestamp [3:34:36](https://www.youtube.com/watch?v=9zUHg7xjIqQ&t=12876s))</span>


#### Architecture Review
- The presenter just discusses why/how we're going to use Nginx to load balance between multiple node/express containers that all connect to our mongodb container.


<span style="font-size:0.7em">(video timestamp [3:40:48](https://www.youtube.com/watch?v=9zUHg7xjIqQ&t=13248s))</span>


#### Nginx for load balancing to multiple node containers
- The nginx docker image details are found here: [https://hub.docker.com/_/nginx](https://hub.docker.com/_/nginx)
- We need to set up nginx specific configs
	- Create a new directory `nginx` at the root of the project
	- Create a new file `default.conf` in the new folder
	- In this conf file, we'll add all the proxy settings that nginx needs. For now, just see the nginx/default.conf file. (note to self.. read about these)
- Add 'nginx:' as a service in the docker-compose file above the 'node-app:' service
	- The image being used for nginx here is `image: nginx:stable-alpine`
	- We can remove the ports section of the node-app service in the docker-compose file now.
	- In the development docker-compose file, we include the nginx service and specify the ports option here as `- "3000:80"`
	- In the production docker-compose file, we include the nginx service and specify the ports option to be `- "80:80"`
- The nginx service in docker-compose needs to know where it's conf file is, this is added with the volumes option.
	- It expects the config file to be in '/etc/nginx/conf.d/default.conf'. Our volumes option will sync that with our './nginx/default.conf'.
	- So the nginx volumes option should be set as:
		 `- ./nginx/default.conf/:/etc/nginx/conf.d/default.conf:ro`
		 (We set nginx image side to be read only (ro) for some added security
- As an optional configuration on express, in a production environment we'll want to set express to trust the nginx proxy.
	- This is useful if you'd like access to the user's IP address in the node application, like for rate limiting.
	- All you need to do is add `app.enable("trust proxy");` to the index.js file of the node app just before the middleware section (the app.use() statements).
- To add a second node instance, we just run the docker-compose command with `--scale node-app=2` at the end of it
	- The complete docker-compose up command will now be something like: `docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d --scale node-app=2`
- Now we can test that two node-app instances are running by:
	- Add a `console.log("test!")` in the root GET response in index.js. Save the file.
	- Then open a split terminal in vscode (or run two terminal/powershell windows) and open the `docker logs node-docker_node-app_# -f` command in each. Where '#' is 1 in one terminal and 2 in the other terminal.
	- Making a GET request to that root URL should cause node-app_1 to give the console message, then a second GET request should cause node-app_2 to give a console message. They'll trade back and forth for each successive GET request!


<span style="font-size:0.7em">(video timestamp [3:54:33](https://www.youtube.com/watch?v=9zUHg7xjIqQ&t=14073s))</span>


#### Express CORS
- To allow different domains to access the API we need to enable cors (cross-origin resource sharing)
	- Details found at [https://www.npmjs.com/package/cors](https://www.npmjs.com/package/cors)
	- First install the package with `npm install cors`
	- Rebuild the image with a docker-compose...up -d --build -V
	- In the index.js file, import cors and add it to the middleware section with `app.use(cors({}))`, we can leave the cors config object being passed to it empty. Save the file when that's done so that nodemon can restart the server.


<span style="font-size:0.7em">(video timestamp [3:57:44](https://www.youtube.com/watch?v=9zUHg7xjIqQ&t=14264s))</span>


- We will be deploying the app the WRONG WAY, then steadily correcting things to illustrate why we're configuring it the way we are. It may be frustrating to follow point-to-point, but I agree with the presenter that this will show first-hand experience how things should be done with the reasoning included.

- These notes will be ALOT more sparse here. If you have any questions email me wforbes87@gmail.com!

#### Installing docker on Ubuntu (with Digital Ocean)
- Set up digital ocean account
- Create Ubuntu droplet, minimum specs ($5 per month)
- Open powershell and run `ssh root@000.00.00.000` ... replace the zeros for your droplet's ip address, enter the droplet password when prompted
- Next, we'll install **docker** and **docker-compose**
- Full docker install guide is at [https://docs.docker.com/engine/install/ubuntu/](https://docs.docker.com/engine/install/ubuntu/), but the easiest way to install is by following the comments in this file [https://get.docker.com/](https://get.docker.com/)
	- You'll run `curl -fsSL https://get.docker.com -o get-docker.sh`
	- Then run `sh get-docker.sh`
- The docker-compose installation guide is here [https://docs.docker.com/compose/install/](https://docs.docker.com/compose/install/)
	- First, run `sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose`
	- Then, when that's complete, run `sudo chmod +x /usr/local/bin/docker-compose`
- We can test installation worked by running `docker -v` and `docker-compose -v`


<span style="font-size:0.7em">(video timestamp [4:03:21](https://www.youtube.com/watch?v=9zUHg7xjIqQ&t=14601s))</span>


#### Setup Git
- Create a Github repo for the project (like this one)
- Create a .gitignore file at the root of your project with `node_modules/` in it
- Run `git init`
- Run `git add --all`
- Run `git commit -m "first commit"`
- Run `git branch -M main`
- Run `git remote add origin (your github repo url node-docker.git)`
- Run `git push -u origin main`
- Now your repo should be set up on github.com


<span style="font-size:0.7em">(video timestamp [4:05:37](https://www.youtube.com/watch?v=9zUHg7xjIqQ&t=14737s))</span>


#### Setup Ubuntu environment variables
- Copy the environment variables from docker-compose.dev into docker-compose.prod for the 'node-app' and 'mongo' services
- Replace the values with ${ENV_VAR_NAME} where ENV_VAR_NAME is the name of each environment variable name
- We can set environment variables on the Ubuntu machine one by one with a command like `export SESSION_SECRET="thesecret"`, however this won't persist across reboots on the server
- Instead, we should create an environment file for this
	- In the root folder (or somewhere AWAY from our project files), create a `.env` file with a `vi .env` command
	- This opens vi, a text editor of wizards. Press I to enable insert mode, now copy in the environment variables for mongo user, password, session secret, and the mongo init db user/password.
	- Press ESC to exit insert mode, then type :wq to save and close the file
- Now to have ubuntu copy in these environment variables we need to modify the `.profile` file in the root directory
	- Run `vi .profile` while in the root directory
	- At the bottom of the file add the following line:
		- `set -o allexport; source /root/.env; set +o allexport`
		- substitute '/root/.env' for wherever you put the .env file
	- This will loop through the contents of that file and set the environment variables on the machine
- Run `exit` to close out the ssh session
- SSH back into the server and run `printenv` to verify that the environment variables were set!


<span style="font-size:0.7em">(video timestamp [4:14:12](https://www.youtube.com/watch?v=9zUHg7xjIqQ&t=15252s))</span>


#### Deploying app to production server
- Create a directory called app in the root of the Ubuntu server `mkdir app`
- Move into that directory `cd app`
- Copy the url of your github repo and clone it into this directory
	- `git clone https://github.com/wforbes/node-docker.git .`
- Here's where you'll end up fixing mistakes in your .yml files ... the presenter in the video had to ... I have to as well on a different line :)
- Once docker is finished creating the containers, you should see them running with a `docker ps` like before
- Now we can test the api on production with Postman by now using the Digital Ocean Droplet's public IP address.
	- Try a GET request to (ip address)/api/v1
	- Try a POST request to ../api/v1/users/signup with a username and password
	- Then try logging in, creating a post, and viewing all posts


<span style="font-size:0.7em">(video timestamp [4:18:57](https://www.youtube.com/watch?v=9zUHg7xjIqQ&t=15537s))</span>


#### Pushing changes the hard way
- Make a minor change to the root GET response in index.js
- Commit the change to git
- Change directory into 'app' on production via SSH
- Run `git pull` to pull in that minor change
- We don't have nodemon to rebuild the project, so we need to rebuild the container for the change to take effect
	- It's suggested to simply do an 'docker-compose ... up -d --build', but we can add '--no-deps' flag to not rebuild the mongo, redis or nginx containers, AND add the name of the server 'node-app' to the end of the command to specify that we only want to rebuild the node app container:
		- `docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build --no-deps node-app`
- If we simply want to rebuild the node app without a change for whatever reason, we can use the '--force-recreate' flag in place of '--build':
	- `docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --force-recreate --no-deps node-app`

( The same section plays twice here in the freecodecamp version of the tutorial. )


<span style="font-size:0.7em">(video timestamp [4:27:32](https://www.youtube.com/watch?v=9zUHg7xjIqQ&t=16052s))</span>


#### Dev to Prod workflow review
- Building the docker image on the production image wastes resources. We just shouldn't do it.
- Instead we should build the image on our development machine, then push it to DockerHub or some other docker repository host, then pull the built image on the production server, and do a 'docker-compose ... up' that detects there's a new image which triggers a rebuild on the production server without the resource hog.


<span style="font-size:0.7em">(video timestamp [4:30:50](https://www.youtube.com/watch?v=9zUHg7xjIqQ&t=16250s))</span>


#### Improved Dockerhub workflow
- Create an account on Dockerhub [https://hub.docker.com](https://hub.docker.com)
- Create a new repository there, whatever you name this repository is what we will have to change our image name to match in the next step
- Now that we've created an image on Dockerhub, we'll have to run `docker image tag (old name) (new name)`
	- You can use `docker image ls` to see the 'latest' image and get the old name from the 'REPOSITORY' column there.
	- As an example, my command here was `docker image tag node-docker_node-app wforbes87/node-app`
- Next you'll have to login to dockerhub, run `docker login` and follow the prompts to enter your username and password
- Then, push our image to the new repository with `docker push (new name)`
	- You'll be able to see the image on your dockerhub page for your repository
- Finally, we need to update the docker-compose file to pull this image from dockerhub.
	- Add an "image:" option under the "node-app:" service in docker-compose.yml, give it a value of the name of your repository on dockerhub.. for example mine is 'wforbes87/node-app'
- Now we can run `docker-compose -f docker-compose.yml -f docker-compose.prod.yml build` using the 'build' command, instead of 'up'
- Next we can run `docker-compose -f docker-compose.yml -f docker-compose.prod.yml push node-app` using the 'push' command and specifying the service name, to push it to dockerhub. Without the service name, it will push the new build for all the images
- On the production machine, we just need to run `docker-compose -f docker-compose.yml -f docker-compose.prod.yml pull`, with the 'pull' command to pull in the new service image from dockerhub
- Then, on the prod machine, run `docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d` to bring that new service image up

- To recap the workflow:
	- Dev machine: Make changes to the node project
	- Dev machine: Run `docker-compose -f docker-compose.yml -f docker-compose.prod.yml build node-app`
	- Dev machine: Run `docker-compose -f docker-compose.yml -f docker-compose.prod.yml push node-app`
	- Prod machine: Run `docker-compose -f docker-compose.yml -f docker-compose.prod.yml pull node-app`
	- Prod machine: Run `docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d`
	- Changes are finalized on production


<span style="font-size:0.7em">(video timestamp [4:46:10](https://www.youtube.com/watch?v=9zUHg7xjIqQ&t=17170s))</span>


#### Automating with watchtower
- The last couple steps in our workflow, the 'pull' and 'up' command on the production side, can be automated.
	- Not everyone likes the idea of automating the production pull because it can result in outages if the code wasn't perfect, so many people prefer to keep this as a manual step.
- If it's desired, we can use [watchtower](https://containrrr.dev/watchtower/) to do this automation.
	- From the production ssh, run the following command to bring in watchtower for demonstration purposes:
		- `docker run -d --name watchtower -e WATCHTOWER_TRACE=true -e WATCHTOWER_DEBUG=true -e WATCHTOWER_POLL_INTERVAL=50 -v /var/run/docker.sock:/var/run/docker.sock containrrr/watchtower app_node-app_1`
		- This will run watchtower and poll dockerhub for changes on the specified container (app_node-app_1) every 50 seconds. If it sees a change, it will automatically pull and run that new image.
		- All the details in the flags and options in this command can be found in the watchtower documentation
	- Run `docker ps` to see watchtower in our list of running containers
	- Run `docker logs watchtower -f` to open the logs and monitor watchtower
- Let's try it out. Edit the code in some minor way, maybe modify the text on the root GET response
- Next, run the 'build' and 'push' commands from the workflow steps in the previous section
- With the changes pushed to dockerhub, watchtower should see those changes and bring them live on production in it's next 50 second poll interval
- When you're done checking it out you can remove watchtower from production with `docker rm watchtower -f`
- The watchtower documentation shows how to set it up in your docker-compose file if this is something you'd like to keep doing. Personally, I won't.


<span style="font-size:0.7em">(video timestamp [4:56:06](https://www.youtube.com/watch?v=9zUHg7xjIqQ&t=17766s))</span>


#### Why we need an orchestrator
- When we run the 'docker-compose ... up' command on production, we're essentially tearing down the old container and setting up a new one. During that time, our app will experience an outage. If someone hits the API during that small window of time, they won't be able to get a response.
- There are hacks we could do implement rolling updates to eliminate this window of outage, but they aren't recommended for production.
- Instead, we need an orchestrator.
	- One of the most popular container orchestrators is called "Kubernetes", but that won't take an incredibly long amount of time to get up and going.
	- Instead, we'll use "Docker Swarm" because it's fast and easy to get started with.
- Docker-Compose is a very simple tool, it's meant as a development tool for things like spinning up new containers and tearing down old ones. It can't do things like rolling updates and we can only use it to deploy containers to one server.
- Docker Swarm is an orchestrator, so there's more logic and brains behind it. We can distribute containers across multiple servers with it. It can spin up new containers and update them, then only when they're verified running they will be used live and the old ones torn down.
	- Docker Swarm uses a Manager Node to handle the brains behind everything, they push tasks to Worker Nodes and the workers carry out those tasks. Nodes can be both Manager Node and Worker Node, that's what we'll do since we only have one server.
	- We're mostly concern with the rolling updates that Docker Swarm can do.
	- Really we SHOULDN'T use docker-compose in a production environment.


<span style="font-size:0.7em">(video timestamp [5:03:32](https://www.youtube.com/watch?v=9zUHg7xjIqQ&t=17766s))</span>

#### Docker Swarm
- Docker Swarm gets shipped with Docker by default. It just defaults as inactive. To activate on the production server it run `docker swarm init --advertise-addr (your public ip)` and substitute in your production server's public ip address
- This should give a message like "Swarm initialized: current node is now a manager"
- Keep in mind there's not much different with what's available on docker swarm compared to regular docker
	- Running `docker --help` will show what commands we have available
	- Running `docker service --help` will show what swarm related commands we have available
- Thankfully, we can use the docker-compose files we've already made with Docker Swarm. We just need to add some extra swarm related configuration to them.
- The Deploy section of the docker compose file v3 docs will give us the info we need to get started. [https://docs.docker.com/compose/compose-file/compose-file-v3/#deploy](https://docs.docker.com/compose/compose-file/compose-file-v3/#deploy)
	- The "Replicas" section in those docs will explain that this option will specify the number of containers that should be running. As our application grows, we can use this to spin up more containers to handle the load.
	- The "RESTART_POLICY" will specify how and when it should restart containers.
- In the docker-compose.prod.yml file, add a 'deploy:' section under the 'node-app:' service
	- In the 'deploy:' section, add 'replicas:' with a value of 8.
	- In the 'deploy:' section, add 'restart_policy:' with 'condition:' inside that, give it a value of 'any'.
	- In the 'deploy:' section, add 'update_config:' with 'parallelism:' with a value of 2
	- In the 'deploy:' > 'update_config:' section, add 'delay:' with a value of 15s
	- The parallelism property defines how many containers swarm should update at a time when a new version is being pulled. During that time, the other replicas will pick up the slack. This is how rolling updates are achieved.
	- The delay just specifies the amount of time to wait between updating parallel groups of containers.
- Deploy these changes to production with Docker Swarm:
	- First, commit these changes to git and run `git pull` on the production server to pull these changes to the codebase there.
	- Next, bring down the running containers on production with `docker-compose -f docker-compose.yml -f docker-compose.prod.yml down`
	- Then, use the 'docker stack deploy' command to create our services. You can use the --help flag to see other options, but this is the command I'm using. Here I specify 'mynodeapp' to give the required name parameter something `docker stack deploy -c docker-compose.yml -c docker-compose.prod.yml mynodeapp`
		- You can do a `docker stack --help` to see available commands
		- You can `docker node ls` to list the current nodes in the swarm
		- You can `docker stack ls` to list the stacks
		- You can `docker stack services mynodeapp` to list the services, similar to running the `docker ps` we did before
		- Similarly you can `docker service ls` to list out the services across all stacks, but we only have one stack so it'll look the same as the previous command here
		- Finally, we can run `docker stack ps mynodeapp` to see all of the tasks that this Master Node has it's Worker Node running.


<span style="font-size:0.7em">(video timestamp [5:16:13](https://www.youtube.com/watch?v=9zUHg7xjIqQ&t=18973s))</span>


#### Pushing changes to Swarm stack
- Make another minor code change to the node project, save them, and build them with `docker-compose -f docker-compose.yml -f docker-compose.prod.yml build node-app`
- Now push the changes to dockerhub with `docker-compose -f docker-compose.yml -f docker-compose.prod.yml push node-app`
- On production, run our deploy command and this will pull in the changes from dockerhub and begin running through the parallel deployment we've configured `docker stack deploy -c docker-compose.yml -c docker-compose.prod.yml mynodeapp`
- If you run `docker stack ps mynodeapp` over the next minute or two, you should see our node service replicas begin to show up as "Shutdown" in the DESIRED STATE column, while another version of them have a "Running" state.
- If you hit GET requests during that time to the root route `ipaddress/api/v1`, you may see the old version of the code get returned or the new version. After a couple minutes, you will see the new version returned every request. This was the deployment rolling out changes!


<span style="font-size:0.7em">End of the video</span>

### Set up Vue front-end client
#### Create the vue boilerplate with vue-cli
- First, you'll need to globally install the vue-cli if you don't already have it
	- Run `npm install -g @vue/cli`
	- This will give you the ability to create our vue boilerplate code
- From project root, run `vue create client` to set up that boilerplate
- Pick you're favorite preset... 
	- Vue2: My main choice for now because our UI library doesn't have full Vue 3 support yet
	- pwa: I'd like to incorporate pwa/service-worker into this project
	- router: why not?
	- vuex: yes, please
	- eslint: clean code, clean brains
- Now you can run the local dev server with `npm run serve` to see the vue project at `http://localhost:8080`
	- In the interest of rapid development, this is how we will be working on the front-end. Modify some code, you'll see the hotupdate refresh the page at localhost:8080 with your changes.
	- Go ahead and CTRL+C to stop that running local dev server when you're done testing it

#### Setup dev docker container for client
- To get docker to build our front-end app and host it from an image when it creates the container, we can create a Dockerfile in the `./client` directory.
	- We can use the first 5 lines of [Vuejs Docker Cookbook (Real-World Example)](https://vuejs.org/v2/cookbook/dockerize-vuejs-app.html#Real-World-Example) to create the Dockerfile with one change.
	- We will want to call the FROM to get node, set the WORKDIR to /, COPY the package*.json files to ./, RUN npm install, and then COPY from root to root.
	- Since this is the dev container and we'll want it to run the hot-reload, we won't build it or copy it to nginx like the example does

----- Working on incorporating hot-reloading from the running container
----- picking this back up from here next time

- Next we can update our docker-compose files to trigger that Dockerfile script in ./client
	- In docker-compose.yml: Add a `vue-client:` image to the docker-compose.yml file. Give it a `build:` command with the value `./client` and an `image:` name like `wforbes87/vue-client`
	- In docker-compose.dev.yml: Add the `vue-client:` image with a `ports:` option that has a value of `8080:80`. This will point our localhost:8080 traffic to port 80 in the container.
- With the other containers running, run an up command specifying a build for our vue-client image: `docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d --build vue-client`
- Once that's complete:
	- You should be able to run SH on that container to pok around inside it: `docker exec -it node-docker_vue-client_1 sh`
	- You should also be able to navigate your web browser to localhost:8080 and see the built vue app served from nginx in the `node-docker_vue-client_1` container. If you made any changes to the vue boilerplate code, that should be present in this step

#### (Optional) Update the linting config for your preferences
- I'm a big fan of linters on the front-end. You may be too. #teamtabsoverspaces
- Update the `.eslintrc.js` to suit your needs.
	- The settings I've added in this project enforce:
	- Using tabs (not spaces, never spaces)
	- No trailing comma at the end of object and array member definitions
	- Sets the end of line to auto so I can code on either of my machines (windows or linux)
	- I have `no-async-promise-executor` set to off, because if I gave up that bad habit I'd be too perfect :)

#### Gut the boilerplate, Begin feature based directory structure
- Remove `/components/HelloWorld.vue` and remove it's references in `/views/Home.vue`
- Begin feature based directory structure
	- I prefer to group my Vue.js files into directories organized by the feature they're related to
	- This means `./client/src/views/Home.vue` will be moved to `./client/src/home/views/Home.vue`
		- In that example, 'home' is the feature. In each feature directory, there will be a 'views', 'components', and 'store' directory.
	- This differs from the common practice of using a flat structure with one views folder and one components folder
- (Optional) Update files to match your linting preferences

#### Test API interaction to client
- This is how I usually structure my 'data access layer' in Vue projects.
	- To save these notes from getting too extensive, I'll just jot down the main ideas here. Inspect the code I mention for yourself to see the details.
- Install [Axios](https://axios-http.com) to the client project with `npm install axios`
	- This is the library we'll use to make HTTP calls to the API
- Add directory called 'data' to the 'client' folder
	- Here, create two files called DataAccess and ApiDataAccess.
	- 'DataAccess' is a pseduo-interface that acts as an intermediary between the vuex data store and the 'dataContext' object.
	- In this case, the dataContext will be 'ApiDataAccess' using axios to make calls to our node-docker API.
	- If at some point we'd like to use a different dataContext for other situations or uses, we can add logic to make that happen.
- At startup, the App.vue will call the "setupStore" action on the Vuex store to stand up the DataAccess object. Then, the DataAccess object will stand up ApiDataAccess and be ready to make calls to the API.
- To test, add a `testGet()` function to ApiDataAccess which hits the API's 'posts' endpoint using axios.
	- Remove the 'protect' middleware from the .get() functions in 'postRoute.js'
	- Line up the Vue client to make a call that gets all the Posts from the API at startup.
	- console.log the response to ensure its all working as expected.
