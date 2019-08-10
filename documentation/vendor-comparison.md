# Vendor Comparison

Considering factors such as team size, cost of operation, budget and developer comfort, the product will be hosted on one of the vendors Google Cloud Platform or Amazon Web Services. This documents aims both with the goals of the project in mind.

|Service| GCP   | AWS   | Comments |
|-------|-------|-------|-------|
|Hosting|Firebase|Appsync| |
|Document database|Firestore|        | |
|Event log|No equivalent|Kinesis |We want the ordering of the events to be garantued. A pub/sub on GCP is not enough.|
|Serverless|Cloud functions|Lambda||
|DNS|CloudDNS|Route53||