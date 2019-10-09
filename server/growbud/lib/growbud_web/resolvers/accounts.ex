defmodule GrowbudWeb.Resolvers.Accounts do

  def register_user(_parent, args, _resolution) do
    IO.inspect(args)
    Growbud.Accounts.register_user(args)
  end

end
