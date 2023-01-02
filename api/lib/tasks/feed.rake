# frozen_string_literal: true

require 'uri'

namespace :feed do
  desc 'Fetch RSS'
  task :add, [:url] => :environment do |_task, args|
    FetchFeedJob.perform_now args[:url]
  end

  desc 'update'
  task :update, [] => :environment do 
    RssChannel.all.pluck(:feed_url).each do|url|
      FetchFeedJob.perform_now url
    end
  end
end
