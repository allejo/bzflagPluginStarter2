# BZFlag Plugin Starter 2

Welcome to the spontaneous version 2 of a project that no one asked for. I have been wanting to learn [TypeScript](https://www.typescriptlang.org/), [Foundation](http://foundation.zurb.com/) and [Vue.js](https://vuejs.org/), so I decided that I would overhaul [version 1](https://github.com/allejo/bzflagPluginStarter) of the project to be entirely JavaScript based.

This Jekyll website is provided as a tool to generate the skeleton of a BZFlag plugin for developers to fill in the rest with whatever functionality the plugin requires. Here are the features that are currently supported or planned by this tool.

- [x] API Events
- [ ] Custom Poll Types
- [x] Generic Callbacks
- [ ] Custom Map Objects
- [x] Slash Commands
- [ ] URL Jobs

## Building

This is a standard Jekyll website with some dependencies. Building the website requires a few steps:

```bash
# npm install -g typescript
tsc --project lib/CodeBuilder

bash tools/fetchEvents.sh

bundle; bundle exec jekyll serve
```

or

```
make build
```

## Dependencies/Components

This project makes use of a few separate parts so here's a brief explanation of each.

### BZFS API Events

All BZFlag API events are generated automatically from BZFlag's [official documentation](https://github.com/BZFlag-Dev/bzflag.org/tree/master/_documentation) repository. The event documentation is not committed directly to this repository and instead is just fetched from the official docs during the deployment process; any changes to this information should be made in the respective repository.

Use the included script to fetch all of the events.

```
bash tools/fetchEvents.sh
```

### Licenses

The license headers available to be picked are stored in the `_licenses` directory. The given structure of the licenses is straightforward; if you'd like to submit a new license, please note that only open source licenses will be accepted.

### "CodeBuilder.js"

This website is largely built around a yet to be named JS library, for now dubbed "CodeBuilder" located in `lib/CodeBuilder`. The library is written in TypeScript and in order to compile the library, run the following command from the root of the project:

```bash
# npm install -g typescript
tsc --project lib/CodeBuilder
```

The compiled JS file and map should **not** be committed to version control. This script is automatically built during the deployment process.

## License

[MIT](https://github.com/allejo/bzflagPluginStarter2/blob/master/LICENSE.md)
