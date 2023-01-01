# frozen_string_literal: true

require 'open-uri'
require 'rss/hatena'

class RssChannel < ApplicationRecord
  has_many :items, class_name: 'RssItem', dependent: :destroy

  def update_from_rss!(channel)
    logger.info "#{self.class}##{__callee__}: Update #{channel.title} - #{channel.link}"
    update!(title: channel.title)
  end
end
