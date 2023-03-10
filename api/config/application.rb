# frozen_string_literal: true

require_relative 'boot'

require 'rails'
require 'active_model/railtie'
require 'active_job/railtie'
require 'active_record/railtie'
require 'active_storage/engine'
require 'action_controller/railtie'
require 'action_view/railtie'
require 'action_cable/engine'
require 'rails/test_unit/railtie'

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module Ladder
  class Application < Rails::Application
    config.load_defaults 7.0
    config.autoload_paths << "#{root}/responses"

    # Sorcery
    config.action_dispatch.cookies_same_site_protection = :none

    # Sidekiq
    config.active_job.queue_adapter = :sidekiq

    # For sidekiq monitor
    config.session_store :cookie_store, key: '_interslice_session', secure: true
    config.middleware.use ActionDispatch::Cookies
    config.middleware.use config.session_store, config.session_options
  end
end
