class AddSlideshowTypeOnChannel < ActiveRecord::Migration[7.0]
  def change
    add_column :rss_channels, :image_media, :boolean
  end
end
