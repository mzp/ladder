# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.0].define(version: 2023_02_09_051845) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "categories", force: :cascade do |t|
    t.string "title"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.boolean "no_category", default: false
    t.boolean "nsfw", default: false
    t.bigint "user_id"
    t.index ["user_id"], name: "index_categories_on_user_id"
  end

  create_table "rss_channels", force: :cascade do |t|
    t.string "title"
    t.string "url"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "description"
    t.string "feed_url"
    t.bigint "category_id"
    t.boolean "image_media"
    t.bigint "user_id"
    t.string "override_title"
    t.index ["category_id"], name: "index_rss_channels_on_category_id"
    t.index ["user_id"], name: "index_rss_channels_on_user_id"
  end

  create_table "rss_items", force: :cascade do |t|
    t.bigint "rss_channel_id", null: false
    t.string "title"
    t.string "url"
    t.string "description"
    t.string "imageurl"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.datetime "published_at"
    t.integer "hatena_bookmark_count"
    t.datetime "read_at"
    t.string "original_description"
    t.string "content"
    t.string "original_content"
    t.index ["published_at"], name: "index_rss_items_on_published_at"
    t.index ["read_at"], name: "index_rss_items_on_read_at"
    t.index ["rss_channel_id"], name: "index_rss_items_on_rss_channel_id"
    t.index ["url"], name: "index_rss_items_on_url"
  end

  create_table "users", force: :cascade do |t|
    t.string "username", null: false
    t.string "crypted_password"
    t.string "salt"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["username"], name: "index_users_on_username", unique: true
  end

  add_foreign_key "rss_items", "rss_channels"
end
