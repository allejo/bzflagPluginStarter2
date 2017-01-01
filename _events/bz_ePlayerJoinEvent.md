---
dataType: bz_PlayerJoinPartEventData_V1
description: This event is called each time a player joins the game
name: bz_ePlayerJoinEvent
parameters:
- dataType: int
  description: The player ID that is joining
  name: playerID
- dataType: bz_BasePlayerRecord*
  description: The player record for the joining player
  name: record
- dataType: double
  description: Time of event.
  name: eventTime
variable: joinData
---