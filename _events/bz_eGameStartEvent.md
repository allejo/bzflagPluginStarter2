---
dataType: bz_GameStartEndEventData_V1
description: This event is triggered when a timed game begins
name: bz_eGameStartEvent
parameters:
- dataType: double
  description: The duration (in seconds) of the game.
  name: duration
- dataType: double
  description: The server time the event occurred (in seconds).
  name: eventTime
variable: gameStartData
---