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