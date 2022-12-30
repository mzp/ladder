#!/bin/bash
set -eu

docker compose run frontend npm install
docker compose run api bundle install
docker compose run api bundle exec rails db:setup