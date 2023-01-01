class AddDescriptionToChannel < ActiveRecord::Migration[7.0]
  def change
    add_column :rss_channels, :description, :string
  end
end
