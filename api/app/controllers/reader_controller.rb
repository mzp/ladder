# frozen_string_literal: true

class ReaderController < ApplicationController
  def unread
    render json: { items: RssItem.all }
  end
end
