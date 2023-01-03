# frozen_string_literal: true

class Category < ApplicationRecord
  has_many :rss_channels, dependent: :nullify
end
