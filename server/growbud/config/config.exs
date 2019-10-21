# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.

# General application configuration
use Mix.Config

config :growbud,
  ecto_repos: [Growbud.Repo],
  generators: [binary_id: true]

# Configures the endpoint
config :growbud, GrowbudWeb.Endpoint,
  url: [host: "localhost"],
  secret_key_base: "ykqaHCxcBV2rAND91zOONshodLSdSGgfg+RppHdy5kga0xQR40MvPR/HROVUPH1J",
  render_errors: [view: GrowbudWeb.ErrorView, accepts: ~w(html json)],
  pubsub: [name: Growbud.PubSub, adapter: Phoenix.PubSub.PG2]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Use Jason for JSON parsing in Phoenix
config :phoenix, :json_library, Jason

config :growbud, GrowbudWeb.Auth.Guardian,
  issuer: "growbud",
  secret_key: "zjcPc6aF4x6fOz+OfhwLmy9qc4WBZZaKLwq17fxem5b2vXDxmJOqLeR6qV+eq/Qu"

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env()}.exs"
