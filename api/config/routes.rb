# frozen_string_literal: true

require 'sidekiq/web'

Rails.application.routes.draw do
  resources 'channels', only: %i[index show]
  post 'items/:id/markAsRead', to: 'items#mark_as_read', as: :item_mark_as_read
  mount Sidekiq::Web => '/sidekiq'
end
