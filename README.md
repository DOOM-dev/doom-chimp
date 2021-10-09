# doom-chimp
This is a minigame based on the Human Benchmark's Chimp Test (https://humanbenchmark.com/tests/chimp).

# Example Video
https://streamable.com/8lc3yw

# How to use

Use this trigger where you want to activate the hack.
```lua
local time = 80
local startLevel = 9
local endLevel = 12
TriggerEvent('doom-chimp:start', time, startLevel, endLevel, function(result)
    if result then
         print('success')
    else
         print('failed')
    end
end)
```
