# frozen_string_literal: true

class ItemsController < ApplicationController
  include UnreadCount

  def index
    channels = RssChannel.all.includes(:items).order(:id)
    channels.each.with_index do |channel, index|
      channel.extend RssChannelResponse
      if channel.id == params[:initial].to_i || (params[:initial].blank? && index.zero?)
        channel.extend RssChannelResponse::WithLatestItem
      end
    end
    render json: { channels:, unreadCount: self.class.unread_count(channels) }
  end

  def mark_as_read
    item = RssItem.find(params[:item_id])
    read_at = Time.current
    item.update!(read_at:)

    item.rss_channel.items
        .where('? < published_at', item.published_at)
        .update(read_at:)
    RssItem.where(url: item.url).update(read_at:)
    render json: { readAt: read_at, unreadCount: self.class.unread_count(RssChannel.all) }
  end
end
