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
- [ ] Capture all the changes / commits in a feature branch
- [ ] Rebase all changes from upstream to your local master branch
- [ ] Rebase feature branch with the master branch
- [ ] Tag the release with the following format: `MAJOR.MINOR.PATCH`
- [ ] Push the commits in the master branch and tags upstream
- [ ] In GitHub actions verify that the new tag passes the `Build & Test` workflow
- [ ] In GitHub create a release from the recently pushed tag
- [ ] In GitHub actions verify that the `Publish NPM` job has completed successfully
- [ ] Verify that everything is correct in the package's npm page: https://www.npmjs.com/package/@menadevs/objectron
