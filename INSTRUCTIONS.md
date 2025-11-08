# Ts Utils Lib

## Chore Instructions

Here are some chore instructions.

### Run Test
# Run test
npm run test

### Build Docs
# Builddocs
npm run docs

### Publish
# Update changelog
git log --pretty="- %s"

# Update version
- Update version in package.json
- `git commit -a -m "vx.y.z"`
- `git tag vx.y.z`

# Build production version
npm run build

# Test package
npm pack

# Publish
npm login
npm publish --access public
