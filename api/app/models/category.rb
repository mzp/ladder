# frozen_string_literal: true

class Category < ApplicationRecord
  has_many :rss_channels, dependent: :nullify
  belongs_to :user

  scope :visible, -> { order(no_category: :desc, nsfw: :asc).order(:title) }
  scope :available, -> { where(no_category: false).where(nsfw: false).order(:title) }

  class << self
    def no_category
      find_by!(no_category: true)
    end

    def nsfw
      find_by!(nsfw: true)
    end
  end
end
