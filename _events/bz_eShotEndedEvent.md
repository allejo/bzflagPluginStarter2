---
dataType: bz_ShotEndedEventData_V1
description: This event is called each time a shot ends
name: bz_eShotEndedEvent
parameters:
- dataType: int
  description: The player ending the shot
  name: playerID
- dataType: int
  description: The shot ID
  name: shotID
- dataType: bool
  description: Whether the shot exploded or not
  name: explode
- dataType: double
  description: This value is the local server time of the event.
  name: eventTime
variable: shotEndData
---