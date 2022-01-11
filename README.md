# Optic Expo

[![ci](https://github.com/nearform/optic-expo/actions/workflows/ci.yml/badge.svg)](https://github.com/nearform/optic-expo/actions/workflows/ci.yml)
[![cd](https://github.com/nearform/optic-expo/actions/workflows/cd.yml/badge.svg)](https://github.com/nearform/optic-expo/actions/workflows/cd.yml)

[Optic](https://expo.dev/@nearform/optic-expo) is an app that helps you securely generate OTP tokens for 2FA protected npm accounts. It allows auto-publish npm packages using CI.

## Requirements

- Node LTS
- yarn
- expo go app (on your ios/android phone or you can use the ios simulator)

## Setup

1. `cp .env.sample .env`
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
