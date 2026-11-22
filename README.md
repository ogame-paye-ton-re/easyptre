# PTRE - Paye Ton RE

PTRE is an easy-to-use [tolerated tool](https://forum.origin.ogame.gameforge.com/forum/thread/37-ptre-spy-report-sharing-tool-over-discord-oglight-infinity/) to save and share spy reports for OGame browser game. You can save spy reports from:
- Discord, by installing the [PTRE bot](https://discordapp.com/oauth2/authorize?&client_id=512294332058042388&scope=bot)
- [OGLight script](https://openuserjs.org/scripts/nullNaN/OGLight), by installing the add-on into your browser
- [OGame Infinity](https://ogameinfinity.com/)
- Directly through the [PTRE website](https://ptre.chez.gg/)
- And now, through [EasyPTRE](https://openuserjs.org/scripts/GeGe_GM/EasyPTRE)

Your spy reports will be shared only with your team mates. PTRE can also create an ingame activity profiles, manage and sort spy reports, and more...

# EasyPTRE

## Presentation

**EasyPTRE** is a browser script providing PTRE basic features **working with** [AGR extention](https://www.antiga.me), OGLight and Infinity.
You may check [PTRE website](https://ptre.chez.gg/) or [OGame Origin post](https://forum.origin.ogame.gameforge.com/forum/thread/60-easyptre-ig-script-for-ptre-compatible-with-agr/) for details.

## Tolerated tool

**EasyPTRE is a Gameforge tolerated tool**. You may check official post here: [OGame Origin post](https://forum.origin.ogame.gameforge.com/forum/thread/60-easyptre-ig-script-for-ptre-compatible-with-agr/).

## Setup

- Install Tampermonkey: [Chrome](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo?hl=fr) or [Firefox](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/)
- Install [EasyPTRE](https://openuserjs.org/scripts/GeGe_GM/EasyPTRE)
- Login to you OGame account and add your PTRE TeamKey to EasyPTRE settings

## Features

### Core features:

- Sync **lifeforms researchs** to PTRE (so you can use PTRE links with your own techs)
- Fetching **Galaxy Event Explorer** events from Team events **directly ingame**
- Finding **closest friend phalanx**

### Features dedicated to AGR:

- **Saving spy reports** to PTRE Team
- Pushing spy report **to Discord**
- **Ingame activities push** to PTRE Team's database
- **Galaxy events tracking** to PTRE Team's database (+ Discord notifications)
- Push **counter spy messages** as activities
- Fetching **player's fleet** (best report) directly ingame
- **Sharing targets** across PTRE Team (it's still possible to keep some targets private to yourself)

Full compatibility table:
![enter image description here](https://ptre.chez.gg/img/ptre_tool_compatibility.png)

## Changelog

See [CHANGELOG.md](CHANGELOG.md). It is also displayed ingame (EasyPTRE menu > Changelog), generated at build time.

To prepare the next release notes, `node scripts/changelog-draft.js` prints a draft of the `[Unreleased]` section from the commits since the last release.

## Contribution

If interested, you may contribute to EasyPTRE. You can also contact me here: [PTRE Discord server](https://discord.gg/WsJGC9G).

## Donation

Since November 2023, you may [donate to support PTRE](https://ko-fi.com/ptreforogame). Thanks.