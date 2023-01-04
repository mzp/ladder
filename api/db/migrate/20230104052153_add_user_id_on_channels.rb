class AddUserIdOnChannels < ActiveRecord::Migration[7.0]
  def change
    add_reference :rss_channels, :user
    add_reference :categories, :user
  end
end
