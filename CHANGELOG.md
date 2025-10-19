# Changelog

## [0.3.0](https://github.com/hiragram/vibe-monitor/compare/v0.2.9...v0.3.0) (2025-10-19)


### Features

* Add custom app icon ([687f298](https://github.com/hiragram/vibe-monitor/commit/687f2981f048ba405ee5901a3210f77a2e22bc62))

## [0.2.9](https://github.com/hiragram/vibe-monitor/compare/v0.2.8...v0.2.9) (2025-10-19)


### Performance Improvements

* Build Apple Silicon only to reduce app size ([099a66a](https://github.com/hiragram/vibe-monitor/commit/099a66a81db6b1414004d3974333908c7549b5c7))

## [0.2.8](https://github.com/hiragram/vibe-monitor/compare/v0.2.7...v0.2.8) (2025-10-19)


### Bug Fixes

* Enable static export for Electron app with direct GitHub API calls ([6c5f3dd](https://github.com/hiragram/vibe-monitor/commit/6c5f3dd3a6641543180fb47a22f3aae2a0ed6f22))
* Include electron-store in packaged app ([338893e](https://github.com/hiragram/vibe-monitor/commit/338893e60768e381aa79dbbf35764e72622fe42c))

## [0.2.7](https://github.com/hiragram/vibe-monitor/compare/v0.2.6...v0.2.7) (2025-10-19)


### Bug Fixes

* Remove duplicate Next.js build step in release workflow ([07203ab](https://github.com/hiragram/vibe-monitor/commit/07203aba98696d21db417bd08e2cb9afb9ed5d2e))

## [0.2.6](https://github.com/hiragram/vibe-monitor/compare/v0.2.5...v0.2.6) (2025-10-19)


### Bug Fixes

* Move build dependencies to devDependencies to reduce app size ([2a010ef](https://github.com/hiragram/vibe-monitor/commit/2a010efde4900c4383a01467ed2a65965fcbe3dc))

## [0.2.5](https://github.com/hiragram/vibe-monitor/compare/v0.2.4...v0.2.5) (2025-10-19)


### Bug Fixes

* Exclude .next and node_modules from packaged app ([3cc045e](https://github.com/hiragram/vibe-monitor/commit/3cc045e0be26957276902848f6801686c5720b8f))

## [0.2.4](https://github.com/hiragram/vibe-monitor/compare/v0.2.3...v0.2.4) (2025-10-19)


### Bug Fixes

* Use correct path for packaged Electron app ([86847df](https://github.com/hiragram/vibe-monitor/commit/86847df4e0539f8f3086c6367c6c484f3f037ff8))

## [0.2.3](https://github.com/hiragram/vibe-monitor/compare/v0.2.2...v0.2.3) (2025-10-19)


### Bug Fixes

* Re-add APPLE_TEAM_ID for notarization ([b8e8140](https://github.com/hiragram/vibe-monitor/commit/b8e8140b7bde8dcfb264e93121438a7e8b3b2208))

## [0.2.2](https://github.com/hiragram/vibe-monitor/compare/v0.2.1...v0.2.2) (2025-10-19)


### Bug Fixes

* Remove APPLE_TEAM_ID requirement for personal accounts ([3a373c2](https://github.com/hiragram/vibe-monitor/commit/3a373c2c472d52dd139dc314dd81cfd73323a5b6))

## [0.2.1](https://github.com/hiragram/vibe-monitor/compare/v0.2.0...v0.2.1) (2025-10-19)


### Bug Fixes

* Add static export configuration to API routes ([18b2060](https://github.com/hiragram/vibe-monitor/commit/18b20609553389433ef4d77d8c666fe5a1cfeb8c))

## 1.0.0 (2025-10-19)


### Features

* Add automated release workflow with release-please ([f01f685](https://github.com/hiragram/vibe-monitor/commit/f01f685c2fa337880fa03d76560ede56427aa4d3))

## 0.1.0 (2024-12-XX)

### Features

* Initial release of Vibe Monitor
* GitHub repository monitoring dashboard
* Real-time pull request tracking
* GitHub Actions workflow run monitoring
* Self-hosted runner status display
* Job queue monitoring
* Persistent configuration storage with electron-store
* Draggable window title bar for macOS
* Dark mode support
* Auto-refresh with configurable polling interval
* Electron desktop application for macOS
