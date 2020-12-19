# Setup
TO DO
- Figure out the issue I had installing Bootstrap and Jquery using yarn ([removal commit](https://github.com/pei-liu/codenames/commit/20ef8933d49f01a7c7d395b755c827bf2f68bb2d)). Currently fetching libraries from CDN.

## Run Locally
```
git clone git@github.com:pei-liu/codenames.git
bundle && yarn install
rails s
```
Visit localhost:3000
## Heroku
### Setup
```
heroku login
heroku git:remote -a codenames2-staging && git remote rename heroku heroku-staging
heroku git:remote -a codenames2 && git remote rename heroku heroku-production
```

### Commands
Commands must specify the remote (e.g. `heroku open -r heroku-staging`)

Alternatively, set the default remote: `git config heroku.remote heroku-staging`.

See Heroku's [multiple env doc](https://devcenter.heroku.com/articles/multiple-environments).
```
# Open app
heroku open

# Deploy local `staging` branch to `heroku-staging` remote
git push heroku-staging staging:master

# Deploy to production
git push heroku-production master

# Run commands on heroku remote
heroku run rake db:migrate
heroku run rails c
```

# Learnings
* How to Dockerize Rails and deploy to Heroku (ended up ripping out Docker b/c I couldn't execute remote commands like migrations and `rails c`)
* How to use ActionCable
* How to set up React in Rails using webpacker

## Tutorialis Used
* [Set up RoR Project with React](https://www.digitalocean.com/community/tutorials/how-to-set-up-a-ruby-on-rails-project-with-a-react-frontend)
* [Dockerizing Rails](https://iridakos.com/programming/2019/04/07/dockerizing-a-rails-application)
* [React and ActionCable](https://dev.to/christiankastner/react-and-actioncable-1gbh)
* [Another React and ActionCable](https://medium.com/javascript-in-plain-english/integrating-actioncable-with-react-9f946b61556e)
* [Deploying ActionCable to Heroku](https://willschenk.com/articles/2016/deploying-actioncable-on-heroku/)
