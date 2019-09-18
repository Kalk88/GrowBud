defmodule Growbud.Repo do
  use Ecto.Repo,
    otp_app: :growbud,
    adapter: Ecto.Adapters.Postgres
end
