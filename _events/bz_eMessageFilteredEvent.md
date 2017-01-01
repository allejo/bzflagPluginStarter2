---
dataType: bz_MessageFilteredEventData_V1
description: This event is called whenever a message is censored by the swear filter
name: bz_eMessageFilteredEvent
parameters:
- dataType: int
  description: The player who sent the filtered message
  name: player
- dataType: bz_ApiString
  description: The unfiltered text of the message
  name: rawMessage
- dataType: bz_ApiString
  description: The text of the message after passing through the filter
  name: filteredMessage
- dataType: double
  description: The local server time at which the message was sent
  name: eventTime
variable: msgFilteredData
---