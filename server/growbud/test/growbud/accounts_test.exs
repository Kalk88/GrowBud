defmodule Growbud.AccountsTest do
  use Growbud.DataCase

  alias Growbud.Accounts

  describe "users" do
    alias Growbud.Accounts.User

    @valid_create %{name: "some name", email: "test@growbud.email", password: "somefancypassword"}
    @update_attrs %{name: "some updated name"}
    @invalid_attrs %{name: nil}

    def user_fixture(attrs \\ %{}) do
      {:ok, registration} =
        attrs
        |> Enum.into(@valid_create)
        |> Accounts.register_user()
      user = Accounts.get_user!(registration.id)
    end

    test "list_users/0 returns all users" do
      user = user_fixture()
      assert Accounts.list_users() == [user]
    end

    test "get_user!/1 returns the user with given id" do
      user = user_fixture()
      assert Accounts.get_user!(user.id) == user
    end

    test "update_user/2 with valid data updates the user" do
      user = user_fixture()
      assert {:ok, %User{} = user} = Accounts.update_user(user, @update_attrs)
      assert user.name == "some updated name"
    end

    test "update_user/2 with invalid data returns error changeset" do
      user = user_fixture()
      assert {:error, %Ecto.Changeset{}} = Accounts.update_user(user, @invalid_attrs)
      assert user == Accounts.get_user!(user.id)
    end

    test "delete_user/1 deletes the user" do
      user = user_fixture()
      assert {:ok, %User{}} = Accounts.delete_user(user)
      assert_raise Ecto.NoResultsError, fn -> Accounts.get_user!(user.id) end
    end

    test "change_user/1 returns a user changeset" do
      user = user_fixture()
      assert %Ecto.Changeset{} = Accounts.change_user(user)
    end
  end

  describe "registration" do
    alias Growbud.Accounts.Registration

    @valid_attrs %{email: "some@email", name: "some name", password: "some password"}
    @invalid_attrs %{email: nil, name: nil, password: nil}

    test "register_user/1 with valid data creates a user" do
      assert {:ok, %Registration{} = registration} = Accounts.register_user(@valid_attrs)
      assert registration.email == "some@email"
      assert registration.name == "some name"
    end

    test "register_user/1 with invalid data returns error changeset" do
      assert {:error, %Ecto.Changeset{}} = Accounts.register_user(@invalid_attrs)
    end

    test "register_admin/1 with valid data creates a user" do
      assert {:ok, %Registration{} = registration} = Accounts.register_admin(@valid_attrs)
      assert registration.name == "some name"
      assert registration.email == "some@email"
    end
  end
end
