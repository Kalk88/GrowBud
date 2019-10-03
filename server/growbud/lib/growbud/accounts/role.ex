defmodule Growbud.Accounts.Role do
  use Ecto.Schema
  import Ecto.Changeset
  alias Growbud.Accounts.User

  @primary_key {:id, :binary_id, autogenerate: true}
  @foreign_key_type :binary_id
  schema "roles" do
    field :name, :string
    belongs_to :user, User

    timestamps()
  end

  @doc false
  def changeset(role, attrs) do
    role
    |> cast(attrs, [:name, :user_id])
    |> validate_required([:name, :user_id])
  end
end
