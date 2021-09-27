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
	- Specify the version with `version: #`, here we use `version: 3`
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
	- Adding the `--build` option to the command forces it to rebuild the image
	- Full command: `docker-compose up -d --build`

<span style="font-size:0.7em">(video timestamp 1:20:25)</span>
