# frozen_string_literal: true

require 'sidekiq/web'

Rails.application.routes.draw do
  resources 'channels', only: %i[index show update]
  resources 'categories', only: %i[index create update destroy]

  resources 'items', only: %i[index] do
    post 'markAsRead', to: 'items#mark_as_read', as: :mark_as_read
  end
  mount Sidekiq::Web => '/sidekiq'
end
