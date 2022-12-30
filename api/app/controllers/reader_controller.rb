class ReaderController < ApplicationController
  def unread
    render json: { items: RssItem.all }
  end
end
