---
dataType: bz_PollEndEventData_V1
description: This event is called whenever a poll ends successfully
name: bz_ePollEndEvent
parameters:
- dataType: bool
  description: Whether or not the poll was successful
  name: successful
- dataType: int
  description: Amount of players in favor of the poll
  name: yesCount
- dataType: int
  description: Amount of players against the poll
  name: noCount
- dataType: int
  description: Amount of players who did not cast their vote
  name: abstentionCount
- dataType: double
  description: The time of the event.
  name: eventTime
variable: pollData
---