---
dataType: bz_GetPlayerSpawnPosEventData_V1
description: This event is called each time the server needs a new spawn postion
name: bz_eGetPlayerSpawnPosEvent
parameters:
- dataType: int
  description: ID of the player that is requesting the spawn position.
  name: playerID
- dataType: bz_eTeamType
  description: The team the player is currently in.
  name: team
- dataType: bool
  description: The current state representing if other plug-ins have modified the
    spawn position.
  name: handled
- dataType: float[3]
  description: Position where the player will be spawned. This value is initialized
    to the server
  name: pos
- dataType: float
  description: The rotational direction that the player will be spawned at. This value
    is initialized
  name: rot
- dataType: double
  description: The local server time of the event.
  name: eventTime
variable: spawnData
---