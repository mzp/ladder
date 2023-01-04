# frozen_string_literal: true

require 'open-uri'

class RssChannel < ApplicationRecord
  has_many :items, class_name: 'RssItem', dependent: :destroy
  belongs_to :user
  belongs_to :category, default: lambda {
    user.no_category
  }

  def update_from_rss!(channel)
    logger.info "#{self.class}##{__callee__}: Update #{channel.title} - #{channel.link}"
    update!(title: channel.title, description: channel.description, url: channel.link)
  end
end
