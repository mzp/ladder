# frozen_string_literal: true

class UserSessionsController < ApplicationController
  skip_before_action :require_login, only: %i[new create]
  def new
    session[:return_to] = params[:return_to]
  end

  def create
    @user = login(params[:username], params[:password])

    if @user
      redirect_to(session[:return_to] || user_path(@user), allow_other_host: true)
    else
      flash.now[:alert] = 'Login failed'
      render action: 'new'
    end
  end

  def destroy
    logout
    redirect_to(:users, notice: 'Logged out!')
  end
end
