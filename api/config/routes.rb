# frozen_string_literal: true
require 'sidekiq/web'

Rails.application.routes.draw do
  resources 'channels', only: [:index]
  mount Sidekiq::Web => "/sidekiq"
end
