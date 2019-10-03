defmodule Growbud.Accounts do
  @moduledoc """
  The Accounts context.
  """

  import Ecto.Query, warn: false
  alias Ecto.Multi
  alias Growbud.Repo
  alias Growbud.Accounts.{User, Credential, Role}

  @doc """
  Returns the list of users.

  ## Examples

      iex> list_users()
      [%User{}, ...]

  """
  def list_users do
    User
    |> Repo.all()
    |> Repo.preload(:roles)
  end

  @doc """
  Gets a single user.

  Raises `Ecto.NoResultsError` if the User does not exist.

  ## Examples

      iex> get_user!(123)
      %User{}

      iex> get_user!(456)
      ** (Ecto.NoResultsError)

  """
  def get_user!(id) do
    User
    |> Repo.get!(id)
    |> Repo.preload(:roles)
  end

  @doc """
  Register a user.

  ## Examples

      iex> register_user(%{field: value})
      {:ok, %User{}}

      iex> register_user(%{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def register_user(attrs \\ %{}) do
    result = Repo.transaction(create_user(attrs, "User"))

    case result do
      {:ok, %{user: user, roles: roles}} -> {:ok, %{user | roles: roles}}
      {:error, _failed_operation, failed_value, _changes_so_far} -> {:error, failed_value}
    end
  end

  @doc """
  Updates a user.

  ## Examples

      iex> update_user(user, %{field: new_value})
      {:ok, %User{}}

      iex> update_user(user, %{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def update_user(%User{} = user, attrs) do
    user
    |> User.changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Deletes a User.

  ## Examples

      iex> delete_user(user)
      {:ok, %User{}}

      iex> delete_user(user)
      {:error, %Ecto.Changeset{}}

  """
  def delete_user(%User{} = user) do
    Repo.delete(user)
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking user changes.

  ## Examples

      iex> change_user(user)
      %Ecto.Changeset{source: %User{}}

  """
  def change_user(%User{} = user) do
    User.changeset(user, %{})
  end

  defp create_user(attrs, role) do
    id = Ecto.UUID.generate()
    user_attrs = Map.put(attrs, :id, id)

    user =
      %User{}
      |> User.changeset(user_attrs)
      |> Ecto.Changeset.cast_assoc(:credential, with: &Credential.changeset/2)

    Multi.new()
    |> Multi.insert(:user, user)
    |> Multi.insert(:roles, Role.changeset(%Role{}, %{name: role, user_id: id}))
  end
end
