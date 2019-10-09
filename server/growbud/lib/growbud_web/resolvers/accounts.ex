defmodule GrowbudWeb.Resolvers.Accounts do

  def register_user(_parent, args, _resolution) do
    {:ok, Growbud.Accounts.register_user(args)}
  end

end
