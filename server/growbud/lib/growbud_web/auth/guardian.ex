defmodule GrowbudWeb.Auth.Guardian do
  use Guardian, otp_app: :growbud

  def subject_for_token(resource, _claims) do
    sub = to_string(resource.id)
    {:ok, sub}
  end

  def subject_for_token(_, _) do
    {:error, :reason_for_error}
  end

  def resource_from_claims(claims) do
    id = claims["sub"]

    case Growbud.Accounts.get_user!(id) do
      resource -> {:ok, resource}
      nil -> {:error, :resource_not_found}
    end
  end

  def resource_from_claims(_claims) do
    {:error, :reason_for_error}
  end
end
