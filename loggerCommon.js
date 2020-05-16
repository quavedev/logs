/* eslint-disable no-console */
import { getSettings } from 'meteor/quave:settings';

export const LOG_LEVELS = {
  INFO: 'info',
  WARN: 'warn',
  ERROR: 'error',
};

export const EXPECTED_ERRORS = [
  // we expect this error when we reset store on logout
  'Network error: Store reset while query was in flight (not completed in link chain)',
  // on Cordova
  'Error registering serviceWorker',
];

export const isErrorExpected = (...args) =>
  args.find(arg =>
    EXPECTED_ERRORS.find(
      error =>
        (arg && arg.includes && arg.includes(error)) ||
        (arg && arg.error && arg.error.includes && arg.error.includes(error)) ||
        (arg &&
          arg.message &&
          arg.message.includes &&
          arg.message.includes(error))
    )
  );

export const PACKAGE_NAME = 'quave:logs';
export const settings = getSettings({ packageName: PACKAGE_NAME });
