class Category < ApplicationRecord
  has_many :rss_channels, dependent: :nullify
end
