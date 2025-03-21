# Optic Expo

[![ci](https://github.com/nearform/optic-expo/actions/workflows/ci.yml/badge.svg)](https://github.com/nearform/optic-expo/actions/workflows/ci.yml)
[![cd](https://github.com/nearform/optic-expo/actions/workflows/cd.yml/badge.svg)](https://github.com/nearform/optic-expo/actions/workflows/cd.yml)

[Optic](https://expo.dev/@nearform/optic-expo) is an app that helps you securely generate OTP tokens for 2FA protected npm accounts. It allows auto-publish npm packages using CI.

<a href='https://play.google.com/store/apps/details?id=com.nearform.optic'>
  <img alt='Get it on Google Play' src='https://user-images.githubusercontent.com/84892/191009274-938f5cc3-03ac-4bd3-a923-bd2629d77a44.png' style="height:40px"/>
</a>

<a href='https://apps.apple.com/us/app/nearform-optic/id1643969791'>
  <img alt='Download on the App Store' src='https://user-images.githubusercontent.com/84892/191009257-86f3b83e-b2d9-4252-ac05-98732328df2f.png' style="height:40px" />
</a>

## Documentation

The Optic documentation is available [on the website](https://optic.nearform.com/)

To get started, visit the [Getting Started](https://optic.nearform.com/getting-started) page for a brief overview.

## Requirements

- Node LTS
- Yarn
- The latest development build app installed via TestFlight (_instructions update needed_) if you are using an iPhone.
If you are using an android phone or emulator, or an iPhone simulator, a build should be created and installed automatically.

A development build is essentially a modified version of the expo go app, with custom native code added in - the standard method of using Expo nowadays.

## Setup & Development (Android)

Ensure an Android emulator is set up on your machine, or connect a real android device and enable [USB debugging](https://developer.android.com/studio/debug/dev-options#debugging)
1. `yarn`
1. `yarn android`

This should build a new expo development build and install it automatically on your device, as well as start the Expo server. Changes to the typescript in the codebase should now be automatically reflected on your device.

## Builds

In order to successfully create EAS builds or edit EAS config, you will need the following:

1. Expo user account. You can sign up [here](https://expo.dev/signup).
1. Once you have an Expo account, your account needs to be added to the NearForm organization (ask @simoneb to do that for you).
1.  See [EAS builds](https://docs.expo.dev/build/introduction/) for the various commands to run. EAS is a cloud-based service, but the cli offers the choice to build locally too.

Creating builds is necessary if you want to generate standalone applications for ios or android for testing or publishing.

## Running on a iOS device
_Outdated - written when the app was using Expo Go (and npm?!) rather than development builds (and yarn). Should be rewritten to support this._

1. Create an issue in this repo asking for apple connect developer access for the app (see section: [Providing Apple Developer Access](##providing-apple-developer-access))
1. Install expo-cli globally: `npm i -g expo-cli`
1. Run in the simulator first: `npm run ios`
1. Install [expo go](https://apps.apple.com/us/app/expo-go/id982107779) on your device
1. Connect the ios device to your mac and select trust computer when prompted.
1. Confirm your device is in [developer mode](https://developer.apple.com/documentation/xcode/enabling-developer-mode-on-a-device)
1. [Setup code signing certificates in xcode for developement](https://github.com/expo/fyi/blob/main/setup-xcode-signing.md)
1. In Xcode select your device as deployment target and select the development certificate (you may need to connect the device to your account if it was not done before)
   ![select device](https://user-images.githubusercontent.com/84892/191241139-5db5b905-228f-4af2-a633-47f601de993a.png)
1. Run: `expo run:ios --device`
1. Select your device from the list

## Setup Android Studio (MacOS)

1. Running `yarn android` will help you throughout the process.
1. Follow the [expo tutorial](https://docs.expo.dev/workflow/android-studio-emulator/).
1. Java Runtime will be necessary. OpenJDK version 11 worked. [Homebrew](https://formulae.brew.sh/formula/openjdk@11)
1. Read the output of the installation and execute the suggested commands related to symlink and including in the PATH variable.

## Setup Xcode/Simulator (MacOS)

1. Running `yarn ios` will help you throughout the following steps;
1. Create an Apple ID if you don't have one. If applicable, use your NearForm email.
1. Download Xcode from the App Store.
1. Open Xcode, navigate to "Preferences / Locations" and select the appropriate version in Command Line Tools.

## Providing Apple Developer Access

1. Login to Apple Developer using an account with "App Manager" role
1. You might need to use the nearform root account to provide permission above 'developer'
1. 'App Manager' role is needed if you want to give access to create new releases in play store
1. Navigate to [https://appstoreconnect.apple.com/access/users](https://appstoreconnect.apple.com/access/users)
1. Click on the "+" button on the top left corner and add the user info (most of the time will be developer or app manager) and choose what apps they have access to

## Troubleshooting

### Setup / Debug Google Signin

This should already be all set up, but in case of Google Signin errors such as `DEVELOPER_ERROR`, ensure OAuth 2.0 Client IDs are set up for each build method keystore's `SHA-1`

1. Run `eas credentials` to obtain SHA-1 fingerprint for EAS build
2. Run `cd android && ./gradlew signingReport` to obtain local build SHA-1 fingerprints (if you have run a local build)
3. Ensure each SHA-1 has a matching OAuth Client ID in GCC

## Notes

- The app doesn't run on the web, as it utilises native functionality. This could be potentially supported, but web-specific setup would need to be added to support things like push-notifications, camera qr-scanning and Google Signin

## Figma Design

The figma designs can be found [here](https://www.figma.com/design/SZygq93AtTJQHx1ajTmdls/Optic-Expo---UI-Refresh?node-id=1-1615&t=mROoK95Oxvv8d4FP-1).

## Sequence diagram

[![](docs/images/architecture.png)](https://docs.google.com/presentation/d/16038cTBefSKQezJk0IZKNXnSqaG2PnU07Sb2_qIkNe8/edit?usp=sharing)

## Store release Guide

The Android app is published to the Play Store once the release workflow is run.

For the iOS version, please follow [this guide](IOS_RELEASE.md).
