# frozen_string_literal: true

FactoryBot.define do
  factory :rss_channel do
    title { 'RSS Feed' }
    description { 'The RSS Feed' }
    user { association(:user) }

    sequence :url do |n|
      "http://#{n}.example.comperson"
    end

    factory :rss_channel_with_items do
      transient do
        items_count { 10 }
      end

      items do
        Array.new(items_count) { association(:rss_item) }
      end
    end
  end
end
