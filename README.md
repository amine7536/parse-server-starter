# parse-server-starter

## Use with Docker and mLab
Docker : Installation https://docs.docker.com/engine/installation/  
mLab : https://mlab.com/  

```
docker run -p 8080:8080 -e DATABASE_URI='mongodb://<user>:<pass>@ds051913.mlab.com:51913/<database>' -e NODE_ENV='production' -d pixelfactory/docker-parse-server
```

