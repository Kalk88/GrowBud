defmodule GrowbudWeb.Router do
  use GrowbudWeb, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/", GrowbudWeb do
    pipe_through :browser

    get "/", PageController, :index
  end

  scope "/api" do
    forward "/graph", Absinthe.Plug.GraphiQL, schema: GrowbudWeb.Schema

    forward "/", Absinthe.Plug, schema: GrowbudWeb.Schema
  end
end
