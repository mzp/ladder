class CreateRssItems < ActiveRecord::Migration[7.0]
  def change
    create_table :rss_items do |t|
      t.references :rss_channel, null: false, foreign_key: true
      t.string :title
      t.string :url
      t.string :description
      t.string :imageurl
      t.time :published_at

      t.timestamps
    end
  end
end
