/* eslint-disable no-console */
import { Meteor } from 'meteor/meteor';
import winston from 'winston';
import { Loggly } from 'winston-loggly-bulk';
import { LOG_LEVELS, settings, PACKAGE_NAME } from './loggerCommon';

// register method
import './quaveSendLogToServerMethod.js';

if (Meteor.isClient) {
  throw new Error(
    'logger.js should be used only in the server, in the client use loggerClient'
  );
}

const { loggly = {}, isVerbose } = settings;

if (isVerbose) {
  console.log(`${PACKAGE_NAME} settings`, settings);
}

if (loggly.token) {
  if (isVerbose) {
    console.log(`${PACKAGE_NAME} winston.add`);
  }

  winston.add(
    new Loggly({
      token: loggly.token,
      subdomain: loggly.subdomain,
      tags: loggly.tags,
      json: true,
    })
  );
}

const includeIfExist = (text, variable) => {
  if (!variable) {
    return '';
  }
  if (variable.length === 0) {
    return '';
  }
  const message = Array.isArray(variable) ? variable.join(' | ') : variable;
  return `, ${text}: ${message}`;
};

const extractGraphqlError = error => {
  if (!error) {
    return '';
  }
  if (!error.graphQLErrors || !error.graphQLErrors.length) {
    return '';
  }
  return `${error.graphQLErrors
    .map(
      e =>
        `${e.message}${includeIfExist(
          'locations',
          e.locations
        )}${includeIfExist('path', e.path)}`
    )
    .join('\n')}`;
};

const sendLog = ({
  message: finalMessage,
  error,
  tags,
  level,
  isSend = true,
  ...rest
}) => {
  const graphqlErrorMessage = extractGraphqlError(error);
  const message =
    error && (error.message || error.stack)
      ? `${finalMessage}${includeIfExist(
          'graphql',
          graphqlErrorMessage
        )}${includeIfExist('error', error.message)}${includeIfExist(
          'stack',
          error.stack
        )}`
      : finalMessage;

  const { messagesToSkip } = loggly || {};
  const messageToSend =
    message && message.toString ? message.toString() : undefined;
  const isMessageToSkipSend =
    messagesToSkip &&
    messagesToSkip.length &&
    messagesToSkip.some(message => messageToSend.includes(message));

  if (loggly.token && isSend && !isMessageToSkipSend) {
    const log = {
      level,
      ...(messageToSend ? { message: messageToSend } : {}),
      tags: [
        ...(tags || []),
        ...(graphqlErrorMessage ? ['graphql'] : []),
        ...(Meteor.settings &&
        Meteor.settings.public &&
        Meteor.settings.public.env
          ? [Meteor.settings.public.env]
          : []),
      ],
      ...rest,
    };
    if (isVerbose) {
      console.log(`${PACKAGE_NAME} sendLog winston.log`, log);
    }
    winston.log(log);
  }
};

export const logger = {
  info({ message, ...rest }) {
    console.log(message, rest);
    sendLog({
      message,
      ...rest,
      level: LOG_LEVELS.INFO,
    });
  },
  warn({ message, error, ...rest }) {
    console.warn(message, rest, error);
    sendLog({
      message,
      error,
      ...rest,
      level: LOG_LEVELS.WARN,
    });
  },
  error({ message, error, ...rest }) {
    console.error(message, rest, error);
    sendLog({
      message,
      error,
      ...rest,
      level: LOG_LEVELS.ERROR,
    });
  },
};
