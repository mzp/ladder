class ItemsController < ApplicationController
  def mark_as_read
    render json: Time.current
  end
end
