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
  const message = variable.length ? variable.join(' | ') : variable;
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

const sendLog = ({ message: finalMessage, error, tags, level }) => {
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

  if (loggly.token) {
    if (isVerbose) {
      console.log(`${PACKAGE_NAME} sendLog winston.log level`, level);
    }
    winston.log({
      level,
      message,
      tags: [
        ...(tags || []),
        ...(graphqlErrorMessage ? ['graphql'] : []),
        ...(Meteor.settings &&
        Meteor.settings.public &&
        Meteor.settings.public.env
          ? [Meteor.settings.public.env]
          : []),
      ],
    });
  }
};

export const logger = {
  info({ message, error, tags }) {
    console.log(message);
    sendLog({
      message,
      error,
      tags,
      level: LOG_LEVELS.INFO,
    });
  },
  warn({ message, error, tags }) {
    console.warn(message, error);
    sendLog({
      message,
      error,
      tags,
      level: LOG_LEVELS.WARN,
    });
  },
  error({ message, error, tags }) {
    console.error(message, error);
    sendLog({
      message,
      error,
      tags,
      level: LOG_LEVELS.ERROR,
    });
  },
};
