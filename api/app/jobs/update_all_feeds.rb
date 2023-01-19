# frozen_string_literal: true

class UpdateAllFeeds < ApplicationJob
  queue_as :default

  def perform
    User.all.includes(:rss_channels).each do |user|
      user.rss_channels.each do |channel|
        logger.info "#{self}.#{__callee__}: Fetch #{channel.feed_url}"
        FetchFeedJob.perform_later channel.feed_url, user.id
      end
    end
  end
end
