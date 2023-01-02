class AddCategoryIdToRssChannel < ActiveRecord::Migration[7.0]
  def change
    add_reference :rss_channels, :category_id
  end
end
