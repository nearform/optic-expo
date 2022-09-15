# Optic Expo

[![ci](https://github.com/nearform/optic-expo/actions/workflows/ci.yml/badge.svg)](https://github.com/nearform/optic-expo/actions/workflows/ci.yml)

[![cd](https://github.com/nearform/optic-expo/actions/workflows/cd.yml/badge.svg)](https://github.com/nearform/optic-expo/actions/workflows/cd.yml)

[Optic](https://expo.dev/@nearform/optic-expo) is an app that helps you securely generate OTP tokens for 2FA protected npm accounts. It allows auto-publish npm packages using CI.

## Requirements

- Node LTS
- yarn
- expo go app (on your ios/android phone or you can use the ios simulator)

## Setup

1. `yarn`
1. `yarn start`

## Development
In order to successfully run the Optic-expo app locally you will need the following:
1. Expo user account. You can sign up [here](https://expo.dev/signup).
1. Once you have an Expo account, your account needs to be added to the NearForm organization (ask @simoneb to do that for you).
1. Scan the QR code on your terminal or go to `exp://172.22.22.56:19000`
1. Once the app loads, if you get the signin screen, in your terminal run `expo login -u <username> -p <password>` and reload the app

* Note: The app doesn't run on the web

## Figma Design

The figma designs can be found [here](https://www.figma.com/file/xsPf6IIM9AevLN5gZlXM4q/Optic-(Copy))

## Sequence diagram

[![](docs/images/architecture.png)](https://docs.google.com/presentation/d/16038cTBefSKQezJk0IZKNXnSqaG2PnU07Sb2_qIkNe8/edit?usp=sharing)

## User guide

The first step to use the `optic-expo` application is adding a Secret. You can add it by scanning a QR code provided by the OTP Issuer or by inputing it manually.

An example adding an NPM user secret:

![image](https://user-images.githubusercontent.com/11404065/159178304-09a9fa80-a73c-433a-9a29-b6a48aa6af7a.png)

You will see your secret added to the application home page:

![image](https://user-images.githubusercontent.com/11404065/159178421-25e1f0c0-46b5-4c4a-8005-39a5fa5c4fd8.png)

Finally, you need to generate your `optic-token`s by adding a new token:

![image](https://user-images.githubusercontent.com/11404065/159178473-f533f308-e1a6-4240-9ad5-ce8680be0ebd.png)

You can save this token to any system that need to sent to you a notification.
The notification will ask you to approve or deny the system's read to your Secret's OTP.

As you can see by the home page layout, you can generate many tokens to read the same Secret's OTP:

![image](https://user-images.githubusercontent.com/11404065/159178635-418e231c-aa9c-4828-bb41-6f68cfb18059.png)

By doing so, you will be able to understand who is the caller that wants to read your OTP.

Few notes on the NPM secret:
- the NPM secret (QR or the textual code) is the one that you get, when you enable 2FA in your [npm](https://www.npmjs.com/) profile
- if you already have 2FA activated (with a different authenticatior app e.g. Google Authenticator) and you need to get the secret, the easiest way is to get is to open the authenticator app you were using previously and get the QR code from that app and scan it with Optic Expo
