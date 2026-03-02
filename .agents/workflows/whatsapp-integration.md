---
description: Comprehensive start-to-end implementation of WhatsApp API Integration via Meta WABA
---

# BXB Messaging Engine - WhatsApp WABA Integration Guide

This workflow documents the end-to-end technical implementation for integrating the Meta WhatsApp Business API (WABA) with the application, handling everything from App configuration to Supabase Edge Function deployment.

## 1. Meta App Configuration
Before writing any code, ensure your Meta Developer application is properly configured.

- **App ID:** `2347172119111059`
- **App Display Name:** `BXB Messaging Engine`
- **App Secret:** `da2aa40237801b4437b8352c9ccdcec4`
- **WABA Name:** `BXB Analytics`
- **WABA ID:** `943911108074452`
- **Phone Number:** `15557499742`
- **Phone Number ID:** `1073723905813415`

## 2. Environment Variables Setup
You must construct the core environment variables that will be consumed by local `.env.local` and remote Supabase Secrets.

```env
WHATSAPP_APP_ID=2347172119111059
WHATSAPP_APP_SECRET=da2aa40237801b4437b8352c9ccdcec4
WHATSAPP_WABA_ID=943911108074452
WHATSAPP_PHONE_NUMBER=15557499742
WHATSAPP_PHONE_NUMBER_ID=1073723905813415
WHATSAPP_ACCESS_TOKEN=EAAhWvZAhi5ZAMBQ3MpwZAvShNcRNT4tT36GAp8McTclA7FC43uqjNc9meZBkKIUO190CyvAsum3k5GrXnAhmWxwDcRLNxCHwz4CiRkEAO483CztquQa5paidEKcC9vgGWxr1hapWqWvZAiNsI9EdN47eAdHtC1HKqGrcDGsgzI88CIUZBvobgF180nCWeKaiwJVwZDZD
```

## 3. Creating WhatsApp Templates
Log into your WhatsApp Business Manager to create and approve templates.
To verify connectivity, use the following `test_tempalte`:
- **Name**: `test_tempalte`
- **Type**: `Utility`
- **Language**: `English (US)`
- **Format / Variables**: `Hi {{1}}, your delivery address has been successfully updated to {{2}}. Contact {{3}} for any inquiries.`
- **Status**: `Active`

## 4. Local Deployment Process (Supabase Edge Functions)
1. Write or update Deno Edge functions (such as `send-whatsapp-otp`, `send-order-confirmation`) to utilize the native `fetch` API against the Graph API (`https://graph.facebook.com/v17.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`).
2. Serve locally to test your logic using the environment configuration.
// turbo
```bash
supabase functions serve --env-file .env.local
```

## 5. Pushing Secrets to Production
Once you are confident the variables work locally via `.env.local`, upload them to your remote Supabase project.

// turbo-all
```bash
supabase secrets set WHATSAPP_ACCESS_TOKEN=EAAhWvZAhi5ZAMBQ3MpwZAvShNcRNT4tT36GAp8McTclA7FC43uqjNc9meZBkKIUO190CyvAsum3k5GrXnAhmWxwDcRLNxCHwz4CiRkEAO483CztquQa5paidEKcC9vgGWxr1hapWqWvZAiNsI9EdN47eAdHtC1HKqGrcDGsgzI88CIUZBvobgF180nCWeKaiwJVwZDZD
supabase secrets set WHATSAPP_PHONE_NUMBER_ID=1073723905813415
supabase secrets set WHATSAPP_PHONE_NUMBER=15557499742
supabase secrets set WHATSAPP_APP_ID=2347172119111059
supabase secrets set WHATSAPP_APP_SECRET=da2aa40237801b4437b8352c9ccdcec4
supabase secrets set WHATSAPP_WABA_ID=943911108074452
```

## 6. Deploying Edge Functions
Finally, deploy the updated edge functions to your remote repository so they can consume the newly synchronized secure variables.

// turbo-all
```bash
supabase functions deploy
```
