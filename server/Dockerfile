FROM elixir:1.9

ENV DEBIAN_FRONTEND=noninteractive
# Install dependencies
RUN mix local.hex --force && mix local.rebar --force
RUN mix archive.install hex phx_new 1.4.10

# Install nodejs and inotify for web content and hot reloading
RUN curl -sL https://deb.nodesource.com/setup_10.x | bash -
RUN apt-get install -y -q --no-install-recommends nodejs inotify-tools

# Copy over source code
COPY ./growbud /app
WORKDIR /app


# Install application
RUN mix deps.get && mix deps.compile
