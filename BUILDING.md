To build fantasyDJ, you will need to install NodeJS, Cordova, Ionic 2, and 
typescript. If you wish to build for Android and/or iOS, you will also need
the Android SDK and/or XCode, respectively.

### Clone this repo:
```
git clone https://github.com/SCCapstone2/FantasyDJ
```

### use `npm` to install dependencies:
```
cd FantasyDJ
npm install -g typescript cordova ionic
npm install
```

### run in the browser:
```
ionic serve
```

### Android

#### setup:
```
cordova platform add android
```

#### build:
```
ionic build android
```

#### emulate:
```
ionic emulate android
```

### ios: 

#### setup (including cocoapods):
```
sudo gem install cocoapods
cordova platform add ios
npm install -g ios-sim ios-deploy
```

#### build:
```
ionic build ios
```

#### emulate:
```
ionic emulate ios
```
