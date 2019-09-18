defmodule Growbud.Application do
  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  @moduledoc false

  use Application

  def start(_type, _args) do
    # List all child processes to be supervised
    children = [
      # Start the Ecto repository
      Growbud.Repo,
      # Start the endpoint when the application starts
      GrowbudWeb.Endpoint
      # Starts a worker by calling: Growbud.Worker.start_link(arg)
      # {Growbud.Worker, arg},
    ]

    # See https://hexdocs.pm/elixir/Supervisor.html
    # for other strategies and supported options
    opts = [strategy: :one_for_one, name: Growbud.Supervisor]
    Supervisor.start_link(children, opts)
  end

  # Tell Phoenix to update the endpoint configuration
  # whenever the application is updated.
  def config_change(changed, _new, removed) do
    GrowbudWeb.Endpoint.config_change(changed, removed)
    :ok
  end
end
