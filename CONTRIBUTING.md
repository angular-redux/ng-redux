# Contributing to ng-redux

## Developing ng-redux

To run the project, simply `npm install`. Then, run tests via `npm run test` or build the entire project via `npm build`.

## Commit convention

ng-redux uses [`standard-version` convention](https://github.com/conventional-changelog/standard-version) which basically looks like this:

```bash
typeOfCommit(locationOfChanges): Commit message
```

Examples:

```bash
fix(lib): Fix ng-redux library issue
feat(build): Build system test watch
```

And so on. The commits are then compiled into the changelog along with each release.

## Release process

For any contributors with release rights:

1. update package.json with new version bump. Refer to [semver](http://semver.org/) for versioning guidelines
2. run `npm publish` to publish new version (the command wil create new build files)
3. commit package.json and build files
4. tag commit with newest version
5. use Github UI to create a new release
