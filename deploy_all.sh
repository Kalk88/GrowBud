#!/usr/bin/env bash

set -euo pipefail

PROJECT_ID=$1
FIREBASEAPIKEY=$2

echo "Deploying all projects to $PROJECT_ID abort now if unsure!..."

#Deploy data-store
echo "Deploying data-store"
cd server/data-store
pwd
npm install
npm run build
cp example.app.yaml $PROJECT_ID.app.yaml
 sed -i "s/fbapikey/$FIREBASEAPIKEY/g" $PROJECT_ID.app.yaml
 sed -i "s/prjectId/$PROJECT_ID/g" $PROJECT_ID.app.yaml
echo y | gcloud app deploy $PROJECT_ID.app.yaml --project=$PROJECT_ID --promote
rm $PROJECT_ID.app.yaml
cd ../../

#Deploy client
echo "Deploying client"
cd client
pwd
npm install
npm run build
echo y | firebase deploy --only hosting:$PROJECT_ID
cd ../

#Deploy cloud-functions
echo "Deploying cloud functions"
cd server/cloud-functions/functions
pwd
npm install
npm run build
echo y | firebase deploy --only functions --project=$PROJECT_ID
cd ../../../