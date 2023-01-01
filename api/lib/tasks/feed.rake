# frozen_string_literal: true

require 'uri'

namespace :feed do
  desc 'Fetch RSS'
  task :fetch, [:url] => :environment do |_task, args|
    FetchFeedJob.perform_now args[:url]
  end
end

