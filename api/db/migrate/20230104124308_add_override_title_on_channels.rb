class AddOverrideTitleOnChannels < ActiveRecord::Migration[7.0]
  def change
    add_column :rss_channels, :override_title, :string
  end
end
