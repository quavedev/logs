/* eslint-disable no-console */
import { Meteor } from 'meteor/meteor';
import { logger } from 'meteor/quave:logs/logger';

const CLIENT_TAG = 'client';
Meteor.methods({
  quaveSendLogToServer({ level, args = {} }) {
    this.unblock();
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
