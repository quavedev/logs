/* eslint-disable no-console */
import { Meteor } from 'meteor/meteor';
import { logger } from './logger';
import { PACKAGE_NAME, settings } from './loggerCommon';

const { isVerbose } = settings;

const CLIENT_TAG = 'client';
Meteor.methods({
  quaveSendLogToServer({ level, args = {} }) {
    this.unblock();
    if (isVerbose) {
      console.log(`${PACKAGE_NAME} quaveSendLogToServer`, JSON.stringify(args));
    }
    const scope = {
      userId: this.userId,
      userAgent:
        this.connection &&
        this.connection.httpHeaders &&
        this.connection.httpHeaders['user-agent'],
    };
    // ignoring error from Lighthouse, at least for now, it's generating error trying to install SW
    if (scope.userAgent && scope.userAgent.includes('Chrome-Lighthouse')) {
      return;
    }
    const logFn = logger[level];
    if (!logFn) {
      return;
    }
    logFn({
      ...scope,
      ...args,
      tags: [CLIENT_TAG, ...(args.tags || [])],
    });
  },
});
