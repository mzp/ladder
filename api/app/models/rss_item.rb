# frozen_string_literal: true

class RssItem < ApplicationRecord
  belongs_to :rss_channel

  scope :unread, -> { where(read_at: nil).order(published_at: :desc, id: :asc) }
  scope :read,   -> { where.not(read_at: nil).order(published_at: :desc, id: :asc) }
  scope :latest,
        lambda {
          order(Arel.sql('CASE WHEN read_at IS NULL THEN 0 ELSE 1 END, published_at DESC, id ASC'))
        }

  scope :proceeding,
        lambda { |item|
          where(
            '(? < published_at) OR (id <= ? AND published_at = ?)',
            item.published_at,
            item.id,
            item.published_at
          )
        }

  def read?
    read_at.present?
  end

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
end
