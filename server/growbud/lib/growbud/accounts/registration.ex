defmodule Growbud.Accounts.Registration do
  use Ecto.Schema
  import Ecto.Changeset

  embedded_schema do
    field :email, :string
    field :name, :string
    field :password, :string
  end

  @doc false
  def changeset(registration, attrs) do

    registration
    |> cast(attrs, [:id, :name, :email, :password])
    |> validate_required([:id, :name, :email, :password])
  end

  def to_user(registration) do
    Map.take(registration, [:id, :name])
  end

  def to_credentials(registration) do
    Map.take(registration, [:id, :email, :password])
  end
end
