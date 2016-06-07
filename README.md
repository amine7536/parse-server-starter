# parse-server-starter

## Use with Docker and mLab :
Docker : Installation https://docs.docker.com/engine/installation/  
mLab : https://mlab.com/  

```
docker run -p 8080:8080 -e DATABASE_URI='mongodb://<user>:<pass>@ds051913.mlab.com:51913/<database>' -e NODE_ENV='production' -d pixelfactory/docker-parse-server
```

## Use with PM2 :
PM2 : http://pm2.keymetrics.io/  

```
npm install pm2 -g
cd /opt
git clone https://github.com/amine7536/parse-server-starter.git
cd parse-server-starter
export NODE_ENV='production'
pm2 start start.sh --name ParseServer
```
