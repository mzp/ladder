# frozen_string_literal: true

# Be sure to restart your server when you modify this file.

# Avoid CORS issues when API is called from the frontend app.
# Handle Cross-Origin Resource Sharing (CORS) in order to accept cross-origin AJAX requests.

# Read more: https://github.com/cyu/rack-cors

Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    allowed_origins = []
    if Rails.env.development?
      allowed_origins << 'http://localhost:8080'
      allowed_origins << 'https://app.localhost.letsrss.com:8443'
      allowed_origins << "https://#{ENV.fetch('CODESPACE_NAME', nil)}-8080.preview.app.github.dev"
    elsif Rails.env.production?
      allowed_origins << 'https://app.letsrss.com'
    end

    origins(*allowed_origins)

    resource '*',
             headers: :any,
             methods: %i[get post put patch delete options head],
             credentials: true
  end
end
