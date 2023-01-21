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
    items = current_user.items.unread.where(id: params[:ids])
    items.update!(read_at:)

    # mark newer items as read
    item = items.last
    item&.rss_channel
        &.items
        &.unread
        &.where('? < published_at', item.published_at)
        &.update(read_at:)

    # mark same url items as read
    current_user.items
                .unread
                .where(url: items.pluck(:url))
                .update(read_at:)
    render json: { readAt: read_at, unreadCount: self.class.unread_count }
  end

  private

  def first_channel_id
    current_user.no_category.rss_channels.first&.id ||
      current_user.rss_channels.first&.id
  end
end
