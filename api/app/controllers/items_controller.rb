class ItemsController < ApplicationController
  def mark_as_read
    item = RssItem.find(params[:id])
    item.update!(read_at: Time.current)
    render json: item.read_at
  end
end
