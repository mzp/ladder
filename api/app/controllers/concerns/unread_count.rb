# frozen_string_literal: true

module UnreadCount
  extend ActiveSupport::Concern

  class_methods do
    def unread_count
      channels = {}
      categories = {}

      Category.visible.includes(rss_channels: [:items]).each do |category|
        total = 0
        category.rss_channels.each do |channel|
          count = channel.items.unread.count
          channels[channel.id.to_s] = count
          total += count
        end
        categories[category.id.to_s] = total
      end

      {
        channels:, categories:
      }
    end
  end
end
