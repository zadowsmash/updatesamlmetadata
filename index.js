const AWS = require('aws-sdk');
const https = require('https');

const sts = new AWS.STS();

const {
  adfsUrl, iamRoleName, externalId, serviceAccountIds, samlProvider,
} = process.env;
const downurl = `https://${adfsUrl}/FederationMetadata/2007-06/FederationMetadata.xml`;
const accountId = serviceAccountIds.replace(/\s/g, '').split(',');

exports.handler = (event, context, callback) => {
  https.get(downurl, (res) => {
      console.log('statusCode:', res.statusCode); // eslint-disable-line
      console.log('headers:', res.headers); // eslint-disable-line
    let downbody = '';
    res.on('data', (d) => {
      downbody += d;
    });
    res.on('end', () => {
      accountId.forEach((accountIds) => {
        const stsparams = {
          DurationSeconds: 900,
          ExternalId: externalId,
          RoleArn: `arn:aws:iam::${accountIds}:role/${iamRoleName}`,
          RoleSessionName: `${accountIds}-adfsmetadataupdate`,
        };
        sts.assumeRole(stsparams, (stserr, stsdata) => {
          if (stserr) {
            callback(stserr);
          }
          const iam = new AWS.IAM({
            accessKeyId: stsdata.Credentials.AccessKeyId,
            secretAccessKey: stsdata.Credentials.SecretAccessKey,
            sessionToken: stsdata.Credentials.SessionToken,
          });
          const iamparams = {
            SAMLMetadataDocument: downbody,
            SAMLProviderArn: `arn:aws:iam::${accountIds}:saml-provider/${samlProvider}`,
          };
          iam.updateSAMLProvider(iamparams, (iamerr, iamdata) => {
            if (!iamerr) console.log(iamdata); // eslint-disable-line
          });
        });
      });
    });
  }).on('error', (e) => {
    console.error(e); // eslint-disable-line
  });
};
