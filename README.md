# node-docker
 Sample API to learn docker with node/express.
 
 Following along with: [https://freecodecamp.com/news/learn-docker-by-building-a-node-express-app](https://freecodecamp.com/news/learn-docker-by-building-a-node-express-app)

 Using the full video found here: [https://www.youtube.com/watch?v=9zUHg7xjIqQ](https://www.youtube.com/watch?v=9zUHg7xjIqQ)

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

<span style="font-size:0.7em">(video timestamp 1:44:48)</span>

### Working with multiple containers
#### Using a MongoDB container
- For the second container in our project, we'll set up a MongoDB container to begin persisting data.
	- On Docker Hub, searching for mongodb provides information on the official mongoDB container ([hub.docker.com/_/mongo](hub.docker.com/_/mongo))
	- Here starting a mongo server instance uses the `docker run --name (instance-name) -d mongo:tag` command, where tag is the MongoDB version you want
- In our 'docker-compose.yml' file, we can add another option under 'services' with a name for the mongo instance. Here, we're using 'mongo' but it can be anything.
- Instead of customizing the build like we did on the 'node-app' container with the 'build' option, with 'mongo' we can use the 'image' option to copy in the provided image. `image: mongo`
	- We'd like to use the most up to date image version, so we won't specify the 'tag'
- In the 'Environment Variables' section of ([hub.docker.com/_/mongo](hub.docker.com/_/mongo)), the two env vars we need to specify are described: **MONGO_INITDB_ROOT_USERNAME** and **MONGO_INITDB_ROOT_PASSWORD**
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