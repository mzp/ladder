# frozen_string_literal: true

# Be sure to restart your server when you modify this file.

# Avoid CORS issues when API is called from the frontend app.
# Handle Cross-Origin Resource Sharing (CORS) in order to accept cross-origin AJAX requests.

# Read more: https://github.com/cyu/rack-cors

Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    allowed_origins = []
    allowed_origins << 'http://localhost:8080' unless Rails.env.production?

    allowed_origins << "https://#{ENV['CODESPACE_NAME']}-8080.preview.app.github.dev" if ENV['CODESPACE_NAME']

    origins(*allowed_origins)

    resource '*',
             headers: :any,
             methods: %i[get post put patch delete options head]
  end
end
