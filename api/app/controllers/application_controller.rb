# frozen_string_literal: true

class ApplicationController < ActionController::Base
  before_action :require_login

  private

  def not_authenticated
    render json: { error: 'login rquired' }
  end
end
