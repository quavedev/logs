/* eslint-disable no-console */
import { Meteor } from 'meteor/meteor';
import { LOG_LEVELS, settings } from './loggerCommon';

const { sendToServer = [] } = settings;

export const loggerClient = {
  info(args) {
    console.log(args);
    if (sendToServer.includes(LOG_LEVELS.INFO)) {
      Meteor.call('quaveSendLogToServer', { level: LOG_LEVELS.INFO, args });
    }
  },
  warn(args) {
    console.warn(args);
    if (sendToServer.includes(LOG_LEVELS.WARN)) {
      Meteor.call('quaveSendLogToServer', { level: LOG_LEVELS.WARN, args });
    }
  },
  error(args) {
    console.error(args);
    if (sendToServer.includes(LOG_LEVELS.ERROR)) {
      Meteor.call('quaveSendLogToServer', { level: LOG_LEVELS.ERROR, args });
    }
  },
};
