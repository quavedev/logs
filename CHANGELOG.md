# CHANGELOG

## v1.0.9 - 2023-11-15
### Breaking Changes
- N/A

### Changes
- Adds a explicit relationship to ddp-server to avoid errors in Meteor 3 when loading packages

## v1.0.8 - 07/10/2020
### Breaking Changes
- N/A

### Changes
- Fix error on skipping messages to send

## v1.0.6 - 22/07/2020
### Breaking Changes
- N/A

### Changes
- Adds other properties to console as well and not only message and error

## v1.0.5 - 06/07/2020
### Breaking Changes
- N/A

### Changes
- Adds a way to skip sending some logs to Loggly on settings: `messagesToSkip`
- Adds a way to log something without sending to Loggly: `isSend`

## v1.0.4 - 05/22/2020
### Breaking Changes
- N/A

### Changes
- Removes internal log added by mistake

## v1.0.3 - 05/22/2020
### Breaking Changes
- N/A

### Changes
- Adds data option
- Prevents message field to have a type different than String, that causes MappingConflict on Loggly

## v1.0.2 - 05/19/2020
### Breaking Changes
- N/A

### Changes
- Improve logs from client adding more details from errors


## v1.0.1 - 05/19/2020
### Breaking Changes
- N/A

### Changes
- Fixes variable.join is not a function
