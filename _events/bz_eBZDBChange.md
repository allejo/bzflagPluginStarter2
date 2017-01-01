---
dataType: bz_BZDBChangeData_V1
description: This event is called each time a BZDB variable is changed
name: bz_eBZDBChange
parameters:
- dataType: bz_ApiString
  description: The variable that was changed
  name: key
- dataType: bz_ApiString
  description: What the variable was changed too
  name: value
- dataType: double
  description: This value is the local server time of the event.
  name: eventTime
variable: bzdbData
---