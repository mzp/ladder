# frozen_string_literal: true

class RssItem < ApplicationRecord
  belongs_to :rss_channel

  def update_from_rss!(item)
    logger.info "#{self.class}##{__callee__}: Update #{item.title} - #{item.link}"
    update!(
      title: item.title,
      published_at: item.date,
      description: item.description,
      imageurl: item.hatena_imageurl
    )
  end
end
