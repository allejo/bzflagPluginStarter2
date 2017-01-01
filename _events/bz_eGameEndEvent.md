---
dataType: bz_GameStartEndEventData_V1
description: This event is called each time a game ends
name: bz_eGameEndEvent
parameters:
- dataType: double
  description: The duration (in seconds) of the game.
  name: duration
- dataType: double
  description: The server time the event occurred (in seconds).
  name: eventTime
variable: gameEndData
---