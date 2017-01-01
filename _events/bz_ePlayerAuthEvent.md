---
dataType: bz_PlayerAuthEvent_V1
description: This event is triggered when a player's authorization status changes
name: bz_ePlayerAuthEvent
parameters:
- dataType: int
  description: The ID of the player who's authorization changed
  name: playerID
- dataType: double
  description: This value is the local server time of the event.
  name: eventTime
variable: authData
---