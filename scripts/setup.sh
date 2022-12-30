#!/bin/bash
set -eu

docker-compose run api bundle exec rails db:setup


