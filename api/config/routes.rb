# frozen_string_literal: true

require 'sidekiq/web'

Rails.application.routes.draw do
  get 'login', to: 'user_sessions#new', as: :login
  post 'login', to: 'user_sessions#create'
  post 'logout', to: 'user_sessions#destroy', as: :logout

  resources :users
  resources 'channels', only: %i[index show update] do
    post 'markAllAsRead', to: 'channels#mark_all_as_read', as: :mark_all_as_read
  end
  resources 'categories', only: %i[index create update destroy]

  resources 'items', only: %i[index] do
    post 'markAsRead', to: 'items#mark_as_read', as: :mark_as_read
  end
  mount Sidekiq::Web => '/sidekiq'
end
