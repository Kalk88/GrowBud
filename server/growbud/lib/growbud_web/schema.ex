defmodule GrowbudWeb.Schema do
  use Absinthe.Schema
  import_types GrowbudWeb.Schema.ContentTypes

  alias GrowbudWeb.Resolvers

  query do

  end

  mutation do

    @desc "Register a user"
    field :register_user, type: :registration do
      arg :name, non_null(:string)
      arg :email, non_null(:string)
      arg :password, non_null(:string)

      resolve &Resolvers.Accounts.register_user/3
    end
  end
end
