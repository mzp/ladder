# frozen_string_literal: true

require 'sidekiq/web'

Rails.application.routes.draw do
  resources 'channels', only: %i[index show update]
  resources 'categories', only: %i[index create update destroy]

  post 'items/:id/markAsRead', to: 'items#mark_as_read', as: :item_mark_as_read
  mount Sidekiq::Web => '/sidekiq'
end
