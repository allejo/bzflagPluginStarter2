# BZFlag Plugin Starter 2

Welcome to the spontaneous version 2 of a project that no one asked for. I have been wanting to learn [TypeScript](https://www.typescriptlang.org/), [Foundation](http://foundation.zurb.com/) and [Vue.js](https://vuejs.org/), so I decided that I would overhaul [version 1](https://github.com/allejo/bzflagPluginStarter) of the project to be entirely JavaScript based.

This Jekyll website is provided as a tool to generate the skeleton of a BZFlag plugin for developers to fill in the rest with whatever functionality the plugin requires. Here are the features that are currently supported or planned by this tool.

- [x] API Events
- [ ] Generic Callbacks
- [ ] Map Objects
- [ ] Slash Commands
- [ ] URL Jobs

## Development

This is a standard Jekyll website with some JavaScript dependencies. Building the website is as simple as cloning the project and running the following command:

```bash
bundle; bundle exec jekyll serve
```

All BZFlag API events are located under `_events` as collection items and all supported licenses are located under `_licenses`; the given structure of the respective items should be straightforward. All of the data of these collection items are then compiled together into single JSON files located in the `data/` folder. If you'd like to submit a new license, please note that only open source licenses will be accepted.

This website is largely built around a yet to be named JS library, for now dubbed "CodeBuilder" located in `lib/CodeBuilder`. The library is written in TypeScript and in order to compile the library, run the following command from the root of the project:

```bash
# npm install -g typescript
tsc --project lib/CodeBuilder
```

Because Jekyll only supports CoffeeScript compilation, the compiled version of this project is committed to version control at `assets/js/CodeBuilder.js`.

## License

[MIT](https://github.com/allejo/bzflagPluginStarter2/blob/master/LICENSE.md)
