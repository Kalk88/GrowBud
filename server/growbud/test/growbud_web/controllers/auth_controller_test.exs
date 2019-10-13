defmodule GrowbudWeb.AuthControllerTest do
  use GrowbudWeb.ConnCase
  describe "authentication" do

    @valid_create %{name: "some name", email: "test@growbud.email", password: "somefancypassword"}
    test "POST /api/login", %{conn: conn} do

    response =
      conn
      |> post(Routes.auth_path(conn, :login))
      |> json_response(200)

    end

  end
end
