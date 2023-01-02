class Category < ApplicationRecord
  has_many :rss_channels, dependant: :nullify
end
