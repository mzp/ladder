require "test_helper"

class ReaderControllerTest < ActionDispatch::IntegrationTest
  test "should get unread" do
    get reader_unread_url
    assert_response :success
  end
end
