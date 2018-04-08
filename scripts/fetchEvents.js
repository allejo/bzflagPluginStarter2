#!/usr/bin/env node

const octokit = require('@octokit/rest')();
const http = require('https');
const path = require('path');
const fs = require('fs');

// Location for event docs to go
const eventsFolder = path.join(__dirname, '..', 'src', 'events');

octokit.repos
    .getContent({
        owner: 'bzflag-dev',
        repo: 'bzflag.org',
        path: '_documentation/developer/bzfs_api_events'
    })
    .then(function(result) {
        result.data.forEach(function(value) {
            const filename = value.name;

            http.get(value.download_url, function(res) {
                res.on('data', function(chunk) {
                    fs.writeFile(path.join(eventsFolder, filename), chunk, function(err) {
                        if (err) {
                            console.error(err);
                        }
                    });
                });
            });
        });
    })
    .catch(function(error) {
        console.error(error);
    });
