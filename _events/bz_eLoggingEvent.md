---
dataType: bz_LoggingEventData_V1
description: This event is called whenever a debug message is outputted
name: bz_eLoggingEvent
parameters:
- dataType: int
  description: The debug level that this debug message is being triggered at. -d corresponds
    to level 1, -dd to level 2, etc.
  name: level
- dataType: bz_ApiString
  description: The debug message that is being outputted.
  name: message
- dataType: double
  description: The server time the event occurred (in seconds.)
  name: eventTime
variable: logData
---