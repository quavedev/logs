/* eslint-disable no-console */
import {Meteor} from 'meteor/meteor';
import {LOG_LEVELS, settings} from './loggerCommon';

const { sendToServer = [] } = settings;

const treatArgs = args => {
  const errorOrEmpty = args.error
    ? { error: { message: args.error.message, stack: args.error.stack } }
    : {};

  return {
    ...args,
    ...errorOrEmpty,
    message: args.message || errorOrEmpty.message,
  };
};

export const loggerClient = {
  info(args = {}) {
    console.log(JSON.stringify(args, null, 4));
    if (sendToServer.includes(LOG_LEVELS.INFO)) {
      Meteor.call('quaveSendLogToServer', {
        level: LOG_LEVELS.INFO,
        args: treatArgs(args),
      });
    }
  },
  warn(args = {}) {
    console.warn(args);
    if (sendToServer.includes(LOG_LEVELS.WARN)) {
      Meteor.call('quaveSendLogToServer', {
        level: LOG_LEVELS.WARN,
        args: treatArgs(args),
      });
    }
  },
  error(args = {}) {
    console.error(args);
    if (sendToServer.includes(LOG_LEVELS.ERROR)) {
      Meteor.call('quaveSendLogToServer', {
        level: LOG_LEVELS.ERROR,
        args: treatArgs(args),
      });
    }
  },
};
