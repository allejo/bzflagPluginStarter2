---
dataType: bz_SlashCommandEventData_V1
description: This event is called each time a player sends a slash command
name: bz_eSlashCommandEvent
parameters:
- dataType: int
  description: The player who sent the slash command
  name: from
- dataType: bz_ApiString
  description: The full text of the chat message for the slash command, containing
    the command and all associated parameters
  name: message
- dataType: double
  description: The local server time of the event
  name: eventTime
variable: slashCommandData
---