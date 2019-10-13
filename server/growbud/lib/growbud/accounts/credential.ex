defmodule Growbud.Accounts.Credential do
  use Ecto.Schema
  import Ecto.Changeset
  alias Growbud.Accounts.User
  alias Bcrypt

  @primary_key {:id, :binary_id, autogenerate: true}
  @foreign_key_type :binary_id
  schema "credentials" do
    field(:email, :string)
    field(:password, :string)
    belongs_to(:user, User)

    timestamps()
  end

  @doc false
  def changeset(credential, attrs) do
    credential
    |> cast(attrs, [:email, :password, :user_id])
    |> validate_required([:email, :password, :user_id])
    |> unique_constraint(:email)
    |> validate_format(:email, ~r/@/)
    |> validate_length(:password, min: 8)
    |> update_change(:password, &Bcrypt.hash_pwd_salt/1)
  end
end
