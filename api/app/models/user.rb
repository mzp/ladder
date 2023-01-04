# frozen_string_literal: true

class User < ApplicationRecord
  authenticates_with_sorcery!
  validates :password, length: { minimum: 3 }, if: -> { new_record? || changes[:crypted_password] }
  validates :username, uniqueness: true

  has_many :rss_channels, dependent: :destroy
  has_many :items, through: :rss_channels
  has_many :categories, dependent: :destroy

  after_create do
    categories.create(no_category: true, title: 'No category')
    categories.create(nsfw: true, title: 'NSFW')
  end

  def no_category
    categories.find_by!(no_category: true)
  end

  def nsfw
    categories.find_by!(nsfw: true)
  end
end
