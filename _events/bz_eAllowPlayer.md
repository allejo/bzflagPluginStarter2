---
dataType: bz_AllowPlayerEventData_V1
description: This event is called each time a player connects to the server
name: bz_eAllowPlayer
parameters:
- dataType: int
  description: This value is the player ID for the joining player.
  name: playerID
- dataType: bz_ApiString
  description: This value is the callsign for the player.
  name: callsign
- dataType: bz_ApiString
  description: This value is the IPv4 address of the player.
  name: ipAddress
- dataType: bz_ApiString
  description: This value is the reason for any denials of admittance, it will be
    reported back to the player.
  name: reason
- dataType: bool
  description: This value is the current allow/deny state for the join. Plug-ins wishing
    to overide the server
  name: allow
- dataType: double
  description: This value is the local server time of the event.
  name: eventTime
variable: allowPlayerData
---