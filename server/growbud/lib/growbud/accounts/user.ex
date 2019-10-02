defmodule Growbud.Accounts.User do
  use Ecto.Schema
  import Ecto.Changeset
  alias Growbud.Accounts.Credential
  alias Growbud.Accounts.Role

  @primary_key {:id, :binary_id, autogenerate: true}
  @foreign_key_type :binary_id
  schema "users" do
    field :name, :string
    has_one :credential, Credential
    has_many :roles, Role

    timestamps()
  end

  @doc false
  def changeset(user, attrs) do
    user
    |> cast(attrs, [:name])
    |> validate_required([:name])
  end
end
