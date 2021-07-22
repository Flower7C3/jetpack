#!/usr/bin/env node

/* eslint-disable no-console, no-process-exit */
const { spawnSync } = require( 'child_process' );
const chalk = require( 'chalk' );

// Check if any touched files need a changelog file
console.log( chalk.green( 'Checking if changelog files are needed. Just a sec...' ) );
const needChangelog = checkChangelogFiles();

// If a changelog file is needed, quit the push. 
if ( needChangelog.status === 1 ) {
	process.exitCode = 1;
}

if ( needChangelog.status === 0 ) {
	console.log( chalk.green( 'Changelog check passed.' ) );
}
/**
 * Checks if changelog files are required.
 *
 * @param {string} command - Command to run. Expects output like `git diff --name-only […]`
 * @returns {Array} Paths output from git command
 */
function checkChangelogFiles() {
	return spawnSync( 'tools/check-changelogger-use.php', [ 'origin/master', 'HEAD' ], { stdio: 'inherit' } );
}

process.exitCode;
