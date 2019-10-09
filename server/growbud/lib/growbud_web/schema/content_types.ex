defmodule GrowbudWeb.Schema.ContentTypes do
  use Absinthe.Schema.Notation

  object :registration do
    field :id, :id
    field :name, :string
    field :email, :string
    field :password, :string
  end
end
