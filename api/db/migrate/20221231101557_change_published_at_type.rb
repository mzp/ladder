class ChangePublishedAtType < ActiveRecord::Migration[7.0]
  def change
    remove_column(:rss_items, :published_at)
    add_column(:rss_items, :published_at, :datetime)
  end
end
