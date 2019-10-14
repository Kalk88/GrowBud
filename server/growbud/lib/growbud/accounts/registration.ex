defmodule Growbud.Accounts.Registration do
  use Ecto.Schema
  import Ecto.Changeset

  embedded_schema do
    field(:email, :string)
    field(:name, :string)
    field(:password, :string)
  end

  @doc false
  def changeset(registration, attrs) do
    registration
    |> cast(attrs, [:name, :email, :password])
    |> validate_required([:name, :email, :password])
    |> put_change(:id, Ecto.UUID.generate())
  end

  def to_user(registration) do
    Map.take(registration, [:id, :name])
  end

  def to_credentials(registration) do
    Map.take(registration, [:email, :password])
    |> Map.put(:user_id, registration.id)
  end
end
