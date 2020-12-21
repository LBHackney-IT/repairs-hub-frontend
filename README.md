## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

## Continuous Delivery

Our serverless deployment service is configured in [serverless.yml](serverless.yml).

The serverless service includes the following:

- a single serverless function: repairs-hub-frontend
- Description of the Cloudfront CDN in CloudFormation
- Custom subdomain under hackney.gov.uk
