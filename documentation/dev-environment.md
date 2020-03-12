# Setting up an dev environment

Growbud consists of 3 projects:
* data-store hosted on google cloud app-engine
* client hosted on firebase hosting
* and cloud-functions hosted on firebase functions

All 3 projects should have the same project id e.g growbud-developer.

# How to setup
* Create a new firebase project and add an hosting app. Save the config variables in client/.env. Copy the example.env as a base
* Create a new google cloud project

# Deploying
Run the deploy_all.sh script with the environment name and firebase api key as arguments
``` ./deploy_all.sh growbud-developer example_key ```