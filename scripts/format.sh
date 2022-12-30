#!/bin/bash
set -eu

docker-compose run frontend npm run format
docker-compose run api bundle exec rubocop -A
