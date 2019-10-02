defmodule Growbud.Repo.Migrations.CreateCredentials do
  use Ecto.Migration

  def change do
    create table(:credentials, primary_key: false) do
      add :id, :binary_id, primary_key: true
      add :email, :string
      add :password, :string
      add :user_id, references(:users, on_delete: :delete_all, type: :binary_id), null: false

      timestamps()
    end

    create unique_index(:credentials, [:email])
    create index(:credentials, [:user_id])
  end
end
