import builder, { Platform } from 'electron-builder'
import { platform } from 'process'

const appName = 'AssistMeButton'
const applicationId = `com.denzere.${appName}`

/**
 * @type {import("electron-builder").Configuration}
 * @see https://www.electron.build/configuration
 */
const options = {
  appId: applicationId,
  executableName: appName,
  productName: appName,
  // nodeGypRebuild: true,
  icon: 'resources/icon.png',
  directories: {
    buildResources: 'build'
  },
  files: [
    '!**/.vscode/*',
    '!src/*',
    '!electron.vite.config.{js,ts,mjs,cjs}',
    '!{.eslintignore,.eslintrc.cjs,.prettierignore,.prettierrc.yaml,dev-app-update.yml,CHANGELOG.md,README.md}',
    '!{.env,.env.*,.npmrc,pnpm-lock.yaml}',
    '!{tsconfig.json,tsconfig.node.json,tsconfig.web.json}'
  ],
  asarUnpack: 'resources/**',
  win: {
    executableName: appName,
    target: [{ target: 'nsis', arch: ['ia32', 'x64'] }]
  },
  nsis: {
    artifactName: '${name}-${version}-setup.${ext}',
    shortcutName: '${productName}',
    uninstallDisplayName: '${productName}',
    createDesktopShortcut: 'always'
  },
  mac: {
    entitlementsInherit: 'build/entitlements.mac.plist',
    extendInfo: {
      NSCameraUsageDescription:
        "Application requests access to the device's camera.",
      NSMicrophoneUsageDescription:
        "Application requests access to the device's microphone.",
      NSDocumentsFolderUsageDescription:
        "Application requests access to the user's Documents folder.",
      NSDownloadsFolderUsageDescription:
        "Application requests access to the user's Downloads folder."
    },
    notarize: false
  },
  dmg: {
    artifactName: '${name}-${version}.${ext}'
  },
  linux: {
    target: ['AppImage', 'snap', 'deb'],
    // maintainer: ""
    category: 'Utility'
  },
  appImage: {
    artifactName: '${name}-${version}.${ext}'
  },
  npmRebuild: false,
  publish: {
    provider: 'generic',
    url: 'https://bucket_name.s3.amazonaws.com'
  },
  electronDownload: {
    cache: './electron-cache',
    mirror: 'https://npmmirror.com/mirrors/electron/'
  }
}

/**
 *  @type {Platform}
 */
const targetPlatform = {
  darwin: Platform.MAC,
  win32: Platform.WINDOWS,
  linux: Platform.LINUX
}[platform]

builder
  .build({
    targets: targetPlatform.createTarget(),
    config: options
  })
  .then((x) => console.log(x))
  .catch((x) => {
    console.error(JSON.stringify(x.message, null, 2))
    process.exit(1)
  })
