# updatesamlmetadata
Lamdba Function to update SAML metadata across multiple AWS accounts that utilise Microsoft ADFS.

## Situation
From time to time, SAML metadata needs to be updated within the AWS account. (after public SSL cert renewals etc).

## Pre-Requisites
A central account that can assume a role within each account you want to make the SAML metadata update to.

## Paramaters

* **serviceAccountIds** - A list of service account ID's that you want to update the SAML metadata for.

    **Must be comma seperated. (ie. 123456789101,098765432345,876543129865)**

* **adfsUrl** - URL of adfs server
* **iamRoleName** - Role name that has cross account access to your service accounts
* **externalId** - externalId for the above mentioned cross account role
* **samlProvider** - Name of the SAML provider to update
* **EnableCron** - Enable cloudwatch cron to run function automatically






    **By ZadowSmAsh**