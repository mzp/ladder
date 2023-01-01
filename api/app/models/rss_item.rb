# frozen_string_literal: true

class RssItem < ApplicationRecord
  belongs_to :rss_channel

  def update_from_rss!(item)
    logger.info "#{self.class}##{__callee__}: Update #{item.title} - #{item.link}"
    update!(
      title: item.title,
      published_at: item.date || Time.zone.now,
      description: item.description,
      imageurl: item.try(:hatena_imageurl) || thumbnail_enclosure(item),
      hatena_bookmark_count: item.try(:hatena_bookmarkcount).to_i
    )
  end

  private

  def thumbnail_enclosure(item)
    return unless item.try(:enclosure).try(:type) =~ %r{image/*}

    item.enclosure.url
  end
end
