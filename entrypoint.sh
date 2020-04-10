# NOTE: Make sure this files is executable by running `chmod +x ./entrypoint.sh`

yarn install --check-files

# Compile the assets
bundle exec rake assets:precompile

# Start the server
bundle exec rails server
