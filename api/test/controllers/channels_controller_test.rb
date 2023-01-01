# frozen_string_literal: true

require 'test_helper'

class ChannelsControllerTest < ActionDispatch::IntegrationTest
  test 'should get index' do
    FactoryBot.create(:rss_channel_with_items, items_count: 10)
    get channels_url
    assert_response :success

    response.parsed_body.each do |channel|
      assert_operator channel['items'].count, :<=, 10
    end
  end
end
