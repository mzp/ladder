# frozen_string_literal: true

class ItemsController < ApplicationController
  skip_before_action :verify_authenticity_token

  include UnreadCount

  def index
    target_id = params[:initial].presence || first_channel_id

    categories = if current_user.no_category.rss_channels.empty?
                   current_user.categories.available
                 else
                   current_user.categories.visible
                 end
    categories = categories.includes(rss_channels: [:items])

    categories.each do |category|
      category.extend CategoryResponse
      category.rss_channels.each do |channel|
        channel.extend RssChannelResponse
        if channel.id == target_id.to_i
          category.selected = true
          channel.extend RssChannelResponse::WithLatestItem
        end
      end
    end
    render json: { categories:, unreadCount: self.class.unread_count }
  end

  def mark_as_read
    read_at = Time.current
    items = current_user.items.where(id: params[:ids])
    if !items.empty?
      urls = items.pluck(:url)
      item = items.last
      current_user.items
          .unread
          .where('? < published_at AND rss_channel_id = ?', item.published_at, item.rss_channel_id)
          .or(RssItem.where(url: urls))
          .update(read_at:)
    end
    render json: { readAt: read_at, unreadCount: self.class.unread_count }
  end

  private

  def first_channel_id
    current_user.no_category.rss_channels.first&.id ||
      current_user.rss_channels.first&.id
  end
end
