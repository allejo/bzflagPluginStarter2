---
dataType: bz_ChatEventData_V1
description: This event is called for each chat message the server receives; after
  the server or any plug-ins have done filtering
name: bz_eFilteredChatMessageEvent
parameters:
- dataType: int
  description: The player ID sending the message.
  name: from
- dataType: int
  description: The player ID that the message is to if the message is to an individual,
    or a
  name: to
- dataType: bz_eTeamType
  description: The team the message is for if it not for an individual or a broadcast.
    If it
  name: team
- dataType: bz_ApiString
  description: The filtered final text of the message.
  name: message
- dataType: double
  description: The time of the event.
  name: eventTime
variable: chatData
---