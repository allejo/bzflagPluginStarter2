---
dataType: bz_eServerMsgEvent_V1
description: This event is called each time the server sends a message
name: bz_eServerMsgEvent
parameters:
- dataType: int
  description: ID of the player receiving the message
  name: to
- dataType: bz_eTeamType
  description: The team/group receiving the message
  name: team
- dataType: bz_ApiString
  description: The message text
  name: message
- dataType: double
  description: Time local server time for the event.
  name: eventTime
variable: serverMsgData
---