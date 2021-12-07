# Optic Expo

[![ci](https://github.com/nearform/optic-expo/actions/workflows/ci.yml/badge.svg)](https://github.com/nearform/optic-expo/actions/workflows/ci.yml)
[![cd](https://github.com/nearform/optic-expo/actions/workflows/cd.yml/badge.svg)](https://github.com/nearform/optic-expo/actions/workflows/cd.yml)

Optic is an app that helps you securely generate OTP tokens for 2FA protected npm accounts. It allows auto-publish npm packages using CI.

## Requirements

- Node LTS
- yarn

## Setup

1. `cp .env.sample .env`
2. `yarn`
3. `yarn start`

## Development
In order to successfully run the Optic-expo app locally you will need the following:
1. Expo user account. You can sign up [here](https://expo.dev/signup).
2. Once you have an Expo account, your account needs to be added to the NearForm organization (ask @simoneb to do that for you).

## Figma Design

The figma designs can be found [here](https://www.figma.com/file/xsPf6IIM9AevLN5gZlXM4q/Optic-(Copy))

## Sequence diagram

[![](docs/images/architecture.png)](https://docs.google.com/presentation/d/16038cTBefSKQezJk0IZKNXnSqaG2PnU07Sb2_qIkNe8/edit?usp=sharing)
