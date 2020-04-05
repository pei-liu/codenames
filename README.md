# Running locally using Docker
```
# Create Postgres container
sudo docker run --name codenames-pg \
            -e POSTGRES_USER=postgres \
            -e POSTGRES_PASSWORD=postgres \
            -p 5432:5432 \
            -d postgres

# Create Redis container
sudo docker run --name codenames-redis \
            -p 6379:6379 \
            -d redis

# Build docker image
docker build . -t codenames

# Create app container
sudo docker run --name codenames-web \
            -e DATABASE_USERNAME=postgres \
            -e DATABASE_PASSWORD=postgres \
            -e REDIS_URL=redis://172.17.0.1:6379/1 \
            -p 3000:3000 \
            codenames

# Connect to app container to vew logs
sudo docker exec -it codenames-web bash
cat /application/logs/production.log
```