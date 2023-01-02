# frozen_string_literal: true

namespace :unread do
  desc 'Reset Unread'
  task :reset, [] => :environment do
    RssItem.update!(read_at: nil)
  end
end
