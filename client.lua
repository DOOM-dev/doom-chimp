local MinigameStarted = false
local MinigameFinished = false
local MinigameFailed = false
local MinigameCB = {}

local QBCore = exports['qb-core']:GetCoreObject()

RegisterCommand('chimpminigame', function(source, args)
    local time = tonumber(args[1])
    local startLevel = tonumber(args[2])
    local endLevel = tonumber(args[3])

    TriggerEvent('doom-chimp:start', time, startLevel, endLevel, function(result)
        if result then
            print('success')
        else
            print('failed')
        end
    end)
end)

RegisterNetEvent('doom-chimp:start')
AddEventHandler('doom-chimp:start', function(time, startLevel, endLevel, cb)
    if not MinigameStarted then
        MinigameCB = cb
        MinigameStarted = true

        SendNUIMessage({
            action = "show",
            time = time,
            startLevel = startLevel,
            endLevel = endLevel,
        })
        SetNuiFocus(true, true)
        SetNuiFocusKeepInput(false)

        Citizen.CreateThread(function()
            while MinigameStarted do
                Citizen.Wait(7)
                if MinigameFinished then
                    if MinigameFailed then
                        cb(false)
                        ResetMinigame()
                    else
                        cb(true)
                        ResetMinigame()
                    end
                end
            end
        end)
    end
end)

function ResetMinigame()
    MinigameStarted = false
    MinigameFinished = false
    MinigameFailed = false
    MinigameCB = {}
    SendNUIMessage({action = "reset"})
end

RegisterNUICallback('GameFinished', function(data)
    SetNuiFocus(false, false)
    MinigameFailed = not data.status
    MinigameFinished = true
end)
