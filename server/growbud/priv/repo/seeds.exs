# Script for populating the database. You can run it as:
#
#     mix run priv/repo/seeds.exs
#
# Inside the script, you can read and write to any of your
# repositories directly:
#
#     Growbud.Repo.insert!(%Growbud.SomeSchema{})
#
# We recommend using the bang functions (`insert!`, `update!`
# and so on) as they will fail if something goes wrong.
alias Growbud.Accounts

if Mix.env() == :dev do
  Accounts.register_user(%{name: "mister", email: "mister@test", password: "p"})
end
