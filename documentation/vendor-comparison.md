# Vendor Comparison

Considering factors such as team size, cost of operation, budget and developer comfort, the product will be hosted on one of the vendors Google Cloud Platform or Amazon Web Services. This documents aims both with the goals of the project in mind.

|Service| GCP   | AWS   | Comments |
|-------|-------|-------|-------|
|Frontend hosting|Firebase|Appsync|Firebase is easier to use, while Appsync is more flexible. Appsync also has built in support for Vue and GraphQL.|
|Document database|Firestore|DocumentDB|About the same|
|Event log|No equivalent|Kinesis |We want the ordering of the events to be garantued. A pub/sub on GCP is not enough.|
|Serverless|Cloud functions|Lambda| Lambda is more mature, has local dev support with [SAM](https://github.com/awslabs/aws-sam-cli)|
|DNS|CloudDNS|Route53||