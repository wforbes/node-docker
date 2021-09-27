# node-docker
 Sample API to learn docker with node/express.
 
 Following along with: [https://freecodecamp.com/news/learn-docker-by-building-a-node-express-app](https://freecodecamp.com/news/learn-docker-by-building-a-node-express-app)

 Using the full video found here: [https://www.youtube.com/watch?v=9zUHg7xjIqQ](https://www.youtube.com/watch?v=9zUHg7xjIqQ)

## Notes
### files mentioned in video (in order)
- **Dockerfile** specifies the docker build steps for the app
- **.dockerignore** specifies files that shouldn't be copied into the docker container
- **.env** specifies environment variables that should be set when the container runs

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

