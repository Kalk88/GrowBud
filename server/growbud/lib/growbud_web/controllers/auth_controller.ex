defmodule GrowbudWeb.AuthController do
  use GrowbudWeb, :controller
  alias Growbud.Guardian

  def login(conn, params) do
    IO.inspect(params)
    resource = Growbud.Accounts.authenticate_by_email_password(params)
    Guardian.Plug.sign_in(conn, resource)
    {:ok, token, claims} = GrowbudWeb.Guardian.encode_and_sign(resource)

    json(conn, %{token: token})
  end
end
