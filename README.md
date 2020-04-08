# Setup
TO DO
- install redis
- bi
- yarn
## Run Locally
```
# dev env
rails s

# production env
redis-server
rails assets:precompile && RAILS_ENV=production bundle exec rails s
```
## Using Docker Locally
```
# Create Postgres container
docker run --name codenames-pg \
            -e POSTGRES_USER=postgres \
            -e POSTGRES_PASSWORD=postgres \
            -p 5432:5432 \
            -d postgres

# Create Redis container
docker run --name codenames-redis \
            -p 6379:6379 \
            -d redis

# Build docker image
docker build . -t codenames

# Create app container
docker run --name codenames-web \
            -e DATABASE_USERNAME=postgres \
            -e DATABASE_PASSWORD=postgres \
            -e REDIS_URL=redis://172.17.0.1:6379/1 \
            -p 3000:3000 \
            codenames

# Connect to app container to vew logs
sudo docker exec -it codenames-web bash
cat /application/logs/production.log
```

# Pushing to Heroku
https://devcenter.heroku.com/articles/container-registry-and-runtime

```
# Build the image and push to Container Registry:
heroku container:login
heroku container:push web

# Then release the image to your app:
heroku container:release web

# Now open the app in your browser:
heroku open
```

Note: I can't figure out how to get `heroku run rails c` to work with Docker. If you need to access the rails console, first deploy to Heroku using Git rather than Docker.

# Learnings
* How to Dockerize Rails and deploy to Heroku
* How to use ActionCable
* How to set up React in Rails using webpacker

## Tutorialis Used
* [Set up RoR Project with Reach](https://www.digitalocean.com/community/tutorials/how-to-set-up-a-ruby-on-rails-project-with-a-react-frontend)
* [Dockerizing Rails](https://iridakos.com/programming/2019/04/07/dockerizing-a-rails-application)
* [React and ActionCable](https://dev.to/christiankastner/react-and-actioncable-1gbh)
* [Another React and ActionCable](https://medium.com/javascript-in-plain-english/integrating-actioncable-with-react-9f946b61556e)
* [Deploying ActionCable to Heroku](https://willschenk.com/articles/2016/deploying-actioncable-on-heroku/)
