require "test_helper"

class CategoryControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get category_index_url
    assert_response :success
  end

  test "should get create" do
    get category_create_url
    assert_response :success
  end
end
