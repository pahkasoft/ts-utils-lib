# Instructions

## Run Test
    npm run test

## Create Docs
    npm run docs

## Build
    npm run build:prod

## Publish
    // Update changelog
    git log --pretty="- %s"

    // Update version number
    npm version major|minor|patch

    // Build production version
    npm run build

    // Test package
    npm pack

    // Publish
    npm login
    npm publish --access public
    