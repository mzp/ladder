# frozen_string_literal: true

class Category < ApplicationRecord
  has_many :rss_channels, dependent: :nullify
  scope :visible, -> { order(no_category: :desc).order(:title) }
  scope :available, -> { where(no_category: false).order(:title) }

  def self.no_category
    find_by!(no_category: true)
  end
end
