# node-docker
 Sample API to learn docker with node/express.
 
 Following along with: [https://freecodecamp.com/news/learn-docker-by-building-a-node-express-app](https://freecodecamp.com/news/learn-docker-by-building-a-node-express-app)

 Using the full video found here: [https://www.youtube.com/watch?v=9zUHg7xjIqQ](https://www.youtube.com/watch?v=9zUHg7xjIqQ)

## Notes

- **Dockerfile** specifies the docker build steps for the app

- **.dockerignore** specifies files that shouldn't be copied into the docker container

### terminal commands for working with docker
- Build docker image and name it with the -t flag:
	- `docker build -t node-app-image .`
- Run docker image with the -p flag to open in/out ports and the --name flag to specify a name, using the name of the image:
	- `docker run -p 3000:3000 --name node-app node-app-image`
- List the running docker containers:
	- `docker ps`
- Log in to the docker container and see files in it:
	- `docker exec -it node-app bash`
	- `exit` to exit bash
- Run image with volume flag to bind mount a volume. This updates changes to code with the /app dir in container
	- On powershell: `docker run -v ${pwd}:/app -p 3000:3000 --name node-app node-app-image`
	- On cmd: `docker run -v %cd%:/app -p 3000:3000 --name node-app node-app-image`
	- On unix: `docker run -v $(pwd):/app -p 3000:3000 --name node-app node-app-image`
	- Install nodemon to restart node.js in container upon dev changes `npm install nodemon --save-dev`
	- Can delete node_modules locally and keep bind mount from deleting node_modules in container by creating an anonymous volume with another -v flag `-v /app/node_modules` in run command
	- Add `:ro` to the end of the bind mount volume to specify 'read-only' so that file changes on the container aren't pushed to our dev code files, and files can't be changed on container.
	- New form (on powershell): `docker run -v ${pwd}:/app:ro -v /app/node_modules -p 3000:3000 --name node-app node-app-image`

**Pausing work at video ts 55:10**