# BZFlag Plug-in Starter

A [Vue.js](https://vuejs.org/) powered website used to generate the skeleton of a BZFlag 2.4 compatible plug-in. The roadmap and currently supported features for this website are as follows:

- [x] API Events
- [ ] Custom Poll Types
- [x] Generic Callbacks
- [ ] Custom Map Objects
- [x] Slash Commands
- [ ] URL Jobs

## Building

The website is built with [Webpack](https://webpack.js.org/) and has npm scripts to build the site for a development environment or for production.

```bash
npm install
npm run fetch-events

# for a production build
npm run build

# for development
npm run dev
```

When running the website in a development environment, the website will be available at `localhost:8080`. When building the website for production, deploy everything in the `app/` folder.

## Dependencies/Components

This project makes use of a few separate parts so here's a brief explanation of each.

### BZFS API Events

All BZFlag API events are generated automatically from BZFlag's [official documentation](https://github.com/BZFlag-Dev/bzflag.org/tree/master/_documentation) repository. The event documentation is not committed directly to this repository and instead is just fetched from the official docs during the deployment process; any changes to the documentation need be made in the official documentation and will be automatically updated on this website the next deployment.

```bash
npm run fetch-events
```

### Licenses

The license headers available to be picked are stored in the `src/licenses` directory. The given structure of the licenses is straightforward; if you'd like to submit a new license, please note that only open source licenses will be accepted.

## License

[MIT](https://github.com/allejo/bzflagPluginStarter2/blob/master/LICENSE.md)
