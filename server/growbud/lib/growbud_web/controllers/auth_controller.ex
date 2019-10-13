defmodule GrowbudWeb.AuthController do
  use GrowbudWeb, :controller

  def login(conn, params) do
    resource = Growbud.Accounts.get_user!(id)
    {:ok, token, claims} = GrowbudWeb.Guardian.encode_and_sign(resource)

    json(conn, %{token: token})
  end
end
