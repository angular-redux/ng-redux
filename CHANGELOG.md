# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

<a name="4.2.0"></a>
# [4.2.0](https://github.com/wbuchwalter/ng-redux/compare/v4.1.0-alpha...v4.2.0) (2018-10-12)


### Features

* **chore:** document provide store functionality ([0b3ff32](https://github.com/wbuchwalter/ng-redux/commit/0b3ff32))
* **typings:** add provideStore typings ([7ea48db](https://github.com/wbuchwalter/ng-redux/commit/7ea48db))



<a name="4.1.0-alpha"></a>
## [4.0.3](https://github.com/wbuchwalter/ng-redux/compare/v4.0.3...v4.1.0-alpha) (2018-07-11)

### Features

* **typings** add provider config types ([3eb5euu](https://github.com/angular-redux/ng-redux/commit/3eb5e42a056f9d01c7adecd7ed85c9262bb65bb4))
* Debounce of the digests triggered by store modification

<a name="4.0.3"></a>
## [4.0.3](https://github.com/wbuchwalter/ng-redux/compare/v4.0.1...v4.0.3) (2018-03-18)



<a name="4.0.1"></a>
## [4.0.1](https://github.com/wbuchwalter/ng-redux/compare/v4.0.0...v4.0.1) (2018-02-07)



<a name="4.0.0"></a>
# [4.0.0](https://github.com/wbuchwalter/ng-redux/compare/3.5.2...4.0.0) (2018-02-07)


### Chores

* **build:** makes redux a peerDependency ([187534a](https://github.com/wbuchwalter/ng-redux/commit/187534a))


### Features

* **lib:** added initial populate dispatch ([b94282b](https://github.com/wbuchwalter/ng-redux/commit/b94282b))
* **lib:** fixes bugs with proposed provided-store logic ([745f3c7](https://github.com/wbuchwalter/ng-redux/commit/745f3c7))
* **lib:** provide store functionality ([5bc1583](https://github.com/wbuchwalter/ng-redux/commit/5bc1583))
* **lib:** reverted a change to the store initialization ([8128828](https://github.com/wbuchwalter/ng-redux/commit/8128828))


### BREAKING CHANGES

* **build:** we aren't including redux to our umd build anymore.

Also added back the umd (dist) build since we still need to support it,
but it will be .gitignored

Added some bower support workaround in Readme
