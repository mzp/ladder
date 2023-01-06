# frozen_string_literal: true

class CategoriesController < ApplicationController
  skip_before_action :verify_authenticity_token
  def index
    render json: current_user.categories.available
  end

  def create
    category = current_user.categories.create
    category.update(params.permit(:title))
    render json: current_user.categories.available
  end

  def update
    current_user.categories.find(params[:id]).update(params.permit(:title))
    render json: current_user.categories.available
  end

  def destroy
    current_user.categories.find(params[:id]).destroy
    render json: current_user.categories.available
  end
end
