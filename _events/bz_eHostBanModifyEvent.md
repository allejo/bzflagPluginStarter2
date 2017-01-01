---
dataType: bz_HostBanEventData_V1
description: This event is called each time before a hostban is going to happen
name: bz_eHostBanModifyEvent
parameters:
- dataType: int
  description: This value is the player ID for the banner.
  name: bannerID
- dataType: int
  description: This value is the duration of the ban in minutes.
  name: duration
- dataType: bz_ApiString
  description: This value contains the reason why and by who a player got banned.
  name: reason
- dataType: bz_ApiString
  description: This value contains the host pattern that is banned.
  name: hostPattern
- dataType: double
  description: This value is the local server time of the event.
  name: eventTime
variable: hostBanData
---