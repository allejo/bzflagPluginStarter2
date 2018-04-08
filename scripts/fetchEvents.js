#!/usr/bin/env node

const fs = require('fs-extra');
const git = require('nodegit');
const path = require('path');

// Location for event docs to go
const eventsFolder = path.join(__dirname, '..', 'src', 'events');

async function process() {
    try {
        // Remove the old workspace, if it exists
        await fs.remove('workspace');

        // Initialize a new workspace directory
        fs.mkdirp('workspace');

        // Clone bzflag.org to the workspace
        const repo = await git.Clone('https://github.com/bzflag-dev/bzflag.org', 'workspace/bzflag.org/');
        const commit = await repo.getMasterCommit();

        console.log(`Using API events from commit: ${commit.toString().slice(-7)}`);

        // Remove any markdown files that may exist so we only use what we copy from the repo
        fs.remove(path.join(eventsFolder, '*.md'));

        // Move what we cloned over to the events folder
        await fs.copy('workspace/bzflag.org/_documentation/developer/bzfs_api_events/', eventsFolder, {
            dereference: true
        });
    } catch (error) {
        console.error(error);
    }
}

process();
