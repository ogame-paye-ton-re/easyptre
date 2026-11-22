# Changelog

All notable changes to EasyPTRE are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

This file is also displayed ingame (EasyPTRE menu > Changelog): it is converted at build time by `scripts/changelog-to-html.js`.

## [0.21.0] - 2026-11-22

### Changed
- Redesigned EasyPTRE panel: cleaner layout, adapts to small screens, can be moved (drag the title, double-click to reset), closes with Escape
- New notifications: colored by type (success, warning, error), can be closed, stay displayed while hovered
- Galaxy toolbar, galaxy pop-up and Orion pop-up redesigned with the same look

## [0.20.0] - 2026-11-22

### Added
- Inactive universes are automatically cleaned: galaxy data after 7 days of inactivity, every key (except Team Key) after 1 year
- TM Keys menu: option to also delete the Team Key when purging a universe
- Changelog is now available on [GitHub](https://github.com/ogame-paye-ton-re/easyptre/blob/master/CHANGELOG.md)

### Changed
- All calls to PTRE now use a single HTTP client: an error message is displayed instead of an endless "Loading..." when PTRE cannot be reached
- Galaxy storage is written after 2 seconds of inactivity instead of after each system
- Live check is paused while the OGame tab is hidden
- Notifications: each message is removed independently

### Removed
- jQuery library
- OGame V12 compatibility code

## [0.19.1] - 2026-11-06

### Fixed
- Orion: PTRE button moved to the lithium cost cell on scanner page

## [0.19.0] - 2026-11-06

### Added
- Orion: PTRE button on scanner and missions anomalies, showing players of the system and the military top X within Y systems (settings)

## [0.18.1] - 2026-11-05

### Fixed
- Lifeform researches not saved anymore from fleet page (OGame changed the fleet API tooltip format)

## [0.18.0] - 2026-08-06

### Added
- Integrate Fight Events module from [Expedetector.eu](https://www.expedetector.eu)

## [0.17.1] - 2026-08-06

### Fixed
- Missing menu reload for GEE and F&P

## [0.17.0] - 2026-08-02

### Added
- Full rework of the Galaxy Events Explorer (GEE)

### Changed
- Integrate Friends & Phalanx to main menu
- Rework menu icons

## [0.16.0] - 2026-07-28

### Changed
- Phalanx list sorted by coordinates

### Fixed
- OGame V13 compatibility (should still work on V12)
- Lifeform researches are now auto-injected into the simulator when you open a PTRE spy report link (from Discord / Website)

## [0.15.1] - 2026-04-05

### Changed
- Add pop-up button legend

### Fixed
- Disable galaxy pop-up button when no Team Key

## [0.15.0] - 2026-03-29

### Added
- Ingame notes menu
- Improve Phalanx update (all at once)
- Move galaxy pop-up feature from Beta to release
- Setting to disable galaxy pop-up
- Tampermonkey Keys management menu

### Changed
- Refacto menus and design

### Fixed
- Galaxy pop-up conflict with OGLight

## [0.14.3] - 2026-03-25

### Fixed
- Add openuserjs.org to connect list

## [0.14.2] - 2026-03-22

### Added
- In-memory cache during galaxy browsing
- Little alert when Team Key is missing or EasyPTRE is not up-to-date

### Fixed
- Timestamp management
- Several code cleaning and optimizations

## [0.14.0] - 2026-01-13

### Changed
- Global code refacto and polish

## [0.13.3] - 2026-01-13

### Fixed
- Several bugfix and polish

## [0.13.0] - 2026-01-07

### Added
- Sync galaxy events and recent targets from PTRE
- Highlight galaxy events and targets in galaxy view (beta)
- Improve galaxy pop-up (beta)
- Send debris fields alongside activities

### Changed
- Improve galaxy info storage

## [0.12.2] - 2026-01-03

### Added
- Ingame shared notes, linked to targets (beta)

## [0.12.0] - 2026-01-02

### Added
- Improve galaxy view with recent targets highlighting and ranks (beta)
- Do Not Probe feature (beta)
- Setting: Toggle events on Overview page
- Setting: Miner mode (if you want to help your Team without every UX improvements)
- Setting: Beta mode (to get Tech Preview features in advance)
- Logs system (for debug)

### Changed
- Refacto targets display
- A lot of background improvements

## [0.11.4] - 2025-10-21

### Fixed
- Phalanx purge and update

## [0.11.3] - 2025-10-20

### Added
- Manual update procedure

### Changed
- Improve update visibility

## [0.11.2] - 2024-11-10

### Fixed
- Galaxy pushs

## [0.11.1] - 2024-10-23

### Added
- Buddies in Friends & Phalanx feature
- Filters in Friends & Phalanx feature

## [0.11.0] - 2024-10-21

### Added
- Friends & Phalanx feature

## [0.10.4] - 2024-10-19

### Added
- Changelog feature

### Fixed
- Some minor CSS issues

## [0.10.3] - 2024-10-18

### Added
- Manage moon ID and relocation related to phalanx sharing

### Changed
- Rework global design

## [0.10.2] - 2024-10-17

### Fixed
- Counter-spy timestamp after V12 update

## [0.10.1] - 2024-09-16

### Added
- Allow removing Team Key from settings

## [0.10.0] - 2024-09-09

### Added
- Galaxy events tracking and sharing (same feature as OGL/OGI but for AGR)
- Share Phalanx level with PTRE Team (AGR/OGL/OGI)
- PTRE Toolbar in galaxy view (AGR/OGL/OGI)
- New button to fetch events from Galaxy Event Explorer (AGR/OGL/OGI)
- New button to fetch closest friend Phalanx (AGR/OGL/OGI)
- Save lifeform researches to PTRE in order to send them from website to simulator (AGR/OGL/OGI)

### Changed
- Rework buttons and UI

## [0.8.0] - 2024-06-28

### Added
- Send counter spy messages as activities

### Fixed
- AGR spy table customization (following message page rework)
- Send spy report button in message page (following message page rework)

## [0.7.6] - 2024-01-09

### Added
- Import AGR custom lists to PTRE tracking list (in addition of basic lists)

### Changed
- Improve notification system (keep 5 sec history)

## [0.7.5] - 2023-12-25

### Added
- Display target top fleet directly into EasyPTRE panel
- Help menu

## [0.7.4] - 2023-11-30

### Added
- Sync AGR/PTRE targets list with teammates via PTRE (non-mandatory)
- Private targets list management system (in order to not share)
- Debug mode option
- Script will check, once a day, for updates and display a label

### Fixed
- Pushing activities when refreshing same system
- Remove AGR "Traders" from targets lists ("Friends" were already removed)
- Galaxy page detection (depending on from where player clicks)
- Add scrollbar to targets list
- Move EasyPTRE panel to right side in order to not overlap with AGR
