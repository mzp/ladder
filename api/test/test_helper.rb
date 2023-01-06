# frozen_string_literal: true

ENV['RAILS_ENV'] ||= 'test'
require_relative '../config/environment'
require 'rails/test_help'
require 'database_cleaner/active_record'
require 'rr'

DatabaseCleaner.clean_with :truncation
DatabaseCleaner.strategy = :transaction

module DatabaseCleanerSupport
  def before_setup
    super
    DatabaseCleaner.start
  end

  def after_teardown
    DatabaseCleaner.clean
    super
  end
end

module SorceryHelper
  def before_setup
    super
    https!
  end

  def current_user
    @current_user ||= FactoryBot.create(:user)
  end

  def login(user = current_user, password = 'password')
    post session_url, params: { username: user.username, password: }
  end
end

module ActionDispatch
  class IntegrationTest
    include DatabaseCleanerSupport
    include FactoryBot::Syntax::Methods
    include SorceryHelper
  end
end

module ActiveSupport
  class TestCase
    parallelize(workers: :number_of_processors)

    include DatabaseCleanerSupport
    include FactoryBot::Syntax::Methods
  end
end
