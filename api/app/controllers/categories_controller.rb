class CategoriesController < ApplicationController
  def index
    render json: Category.all 
  end

  def create
   category =  Category.create
   category.update(params.permit(:title))
    render json: Category.all 
  end

  def update
    Category.find(params[:id]).update(params.permit(:title))
    render json: Category.all 
  end
end
