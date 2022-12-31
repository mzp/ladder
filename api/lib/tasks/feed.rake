# frozen_string_literal: true

require 'uri'

namespace :feed do
  desc 'Fetch RSS'
  task :fetch, [:url] => :environment do |_task, args|
    RssChannel.fetch URI(args[:url])
  end
end
