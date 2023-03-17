# A Dockerfile is a text file that contains instructions for building a Docker image.
# An image is a lightweight, stand-alone, executable package that includes everything 
# needed to run a piece of software, including the code, a runtime, libraries, 
# environment variables, and config files.

# specifies the base image to use
FROM node:lts-alpine
# Create folder for our application
WORKDIR /app
# copy all files and directories in the current directory into the /app directory in 
# the Docker image. The source is the NASA Project, the destination is the /app folder 
# i created
COPY package*.json ./

COPY client/package*.json client/
RUN npm run install-client 

COPY server/package*.json server/
RUN npm run install-server

COPY client client/
RUN npm run build --prefix client

COPY server/ server/

# right before i start the server, set the user to use this container when running. the
# user has less previlege than the root user
USER node

# What to do when this Docker container start up
CMD [ "npm", "start", "--prefix", "server"]

EXPOSE 8000 