# frozen_string_literal: true

FactoryBot.define do
  factory :rss_item do
    rss_channel { association :rss_channel }
    title { 'RSS Entry' }
    description { 'Content' }
    sequence(:url) { |i| "https://example.com/#{i}.html" }
    published_at { Time.current }
  end
end
