defmodule GrowbudWeb.AuthControllerTest do
  use GrowbudWeb.ConnCase
  alias Growbud.Accounts

  describe "authentication" do
    @valid_create %{name: "some name", email: "test@growbud.email", password: "somefancypassword"}
    def user_fixture(attrs \\ %{}) do
      {:ok, registration} =
        attrs
        |> Enum.into(@valid_create)
        |> Accounts.register_user()

      Accounts.get_user!(registration.id)
    end

    test "POST /api/login", %{conn: conn} do
      user_fixture()

      conn
      |> post("api/login", email: "test@growbud.email", password: "somefancypassword")
      |> json_response(200)
    end

    test "POST /api/logout", %{conn: conn} do
      user_fixture()

      conn
      |> post("api/logout")
      |> json_response(200)
    end
  end
end
