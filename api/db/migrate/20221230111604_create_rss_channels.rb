class CreateRssChannels < ActiveRecord::Migration[7.0]
  def change
    create_table :rss_channels do |t|
      t.string :title
      t.string :url

      t.timestamps
    end
  end
end
