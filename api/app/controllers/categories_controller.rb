# frozen_string_literal: true

class CategoriesController < ApplicationController
  def index
    render json: Category.available
  end

  def create
    category = Category.create
    category.update(params.permit(:title))
    render json: Category.available
  end

  def update
    Category.find(params[:id]).update(params.permit(:title))
    render json: Category.available
  end

  def destroy
    Category.find(params[:id]).destroy
    render json: Category.available
  end
end
