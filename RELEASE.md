# Release

## Semantic versioning

Given a version number MAJOR.MINOR.PATCH, increment the:

- `MAJOR` version when you make incompatible API changes,
- `MINOR` version when you add functionality in a backwards compatible manner, and
- `PATCH` version when you make backwards compatible bug fixes.

Additional labels for pre-release and build metadata are available as extensions to the `MAJOR.MINOR.PATCH` format.

Reference: https://semver.org/

## Pre-release checklist

Make sure you cover all the steps below for a new version release.

- [ ] Update the release version number in `package.json`
- [ ] Merge your feature branch with the `develop` branch
- [ ] Rebase all changes from upstream to your local develop branch
- [ ] Create a pull request from the `develop` branch to the master branch
- [ ] Make sure the title of your pull request contains the new release version
- [ ] In GitHub actions verify that your pull request passes the `Build & Test` workflow
- [ ] Get your pull request reviewed by at least 1 other contributor to the project
- [ ] If all the checks and code reviews are done, `rebase and merge` the develop branch with the `master` branch
- [ ] In GitHub create a tag and a release from the recently merged pull request
- [ ] In GitHub actions verify that the `Publish NPM` job has completed successfully
- [ ] Verify that everything is correct in the package's npm page: https://www.npmjs.com/package/@menadevs/objectron
