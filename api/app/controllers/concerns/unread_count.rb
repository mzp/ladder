# frozen_string_literal: true

module UnreadCount
  extend ActiveSupport::Concern

  class_methods do
    def unread_count(channels)
      {
        channels: channels.to_h { |channel| [channel.id, channel.items.unread.count] }
      }
    end
  end
end
