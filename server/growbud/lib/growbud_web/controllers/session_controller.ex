defmodule GrowbudWeb.SessionController do
  use GrowbudWeb, :controller
  alias GrowbudWeb.Auth.Guardian
  alias Growbud.Accounts

  def login(conn, params) do
    {:ok, resource} = Accounts.authenticate_by_email_password(params["email"], params["password"])

    Guardian.Plug.sign_in(conn, resource.user)
    {:ok, token, _claims} = Guardian.encode_and_sign(resource.user)
    json(conn, %{token: token})
  end

  def logout(conn, _params) do
    Guardian.Plug.sign_out(conn, _opts = [])
    json(conn, %{status: "success"})
  end
end
