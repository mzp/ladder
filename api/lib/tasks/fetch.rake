# frozen_string_literal: true

require 'uri'

namespace :fetch do
  desc 'Fetch RSS'
  task :rss, [:url] => :environment do |_task, args|
    RssChannel.fetch URI(args[:url])
  end
end
