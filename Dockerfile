# https://iridakos.com/programming/2019/04/07/dockerizing-a-rails-application


FROM ruby:2.6.3

# Copy application code to the Docker container
COPY . /application
# Change to the application's directory
WORKDIR /application

# Set Rails environment to production
ENV RAILS_ENV production

# Install gems, nodejs
RUN bundle install --deployment --without development test \
    && curl -sL https://deb.nodesource.com/setup_10.x | bash - \
    && apt install -y nodejs

# Precompile assets and start the application server
ENTRYPOINT ./entrypoint.sh