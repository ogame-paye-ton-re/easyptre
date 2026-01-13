// ****************************************
// RUNNING ON WEBSITE
// ****************************************

// Convert IG API 2 JSON to Prefill format
// mode can be "prefill" or "tab"
function parsePlayerResearchs(json, mode) {
    const obj = JSON.parse(json);
    const characterClassId = obj.characterClassId;
    const allianceClassId = obj.allianceClassId;
    let out = {};

    if (mode == "tab") {
        var str = '<table width="60%" border="1"><tr><td style="padding: 5px" align="center">Ships</td>';
        str+='<td style="padding: 5px" align="center"><img src="/img/ogame/speed.png" width="30px"><br>Speed</td>';
        str+='<td style="padding: 5px" align="center"><img src="/img/ogame/armor.png" width="30px"><br>Armor</td>';
        str+='<td style="padding: 5px" align="center"><img src="/img/ogame/shield.png" width="30px"><br>Shield</td>';
        str+='<td style="padding: 5px" align="center"><img src="/img/ogame/weapon.png" width="30px"><br>Weapon</td>';
        str+='<td style="padding: 5px" align="center"><img src="/img/ogame/cargo.png" width="30px"><br>Cargo</td>';
        str+='<td style="padding: 5px" align="center"><br>Fuel</td></tr>';
    } else {
        out["0"] = {
            "class": characterClassId,
            "playerClass": characterClassId,
            "allianceClass": allianceClassId,
            "research": {},
            "lifeformBonuses": {
                "BaseStatsBooster": {},
                "CharacterClassBooster": {}
            }
        };
        for (const key in obj.researches) {
            out["0"]["research"][key] = JSON.parse('{"level":'+obj.researches[key]+'}');
        }
    }

    for (const key in obj.ships) {
        if (mode == "tab") {
            var type = 'ship';
            if (key > 400) {
                type = 'def';
            }
            str+= '<tr><td align="center"><img src="/img/ogame/mini/'+type+'_'+key+'.png"></td>';
            var temp = '-'; if (obj.ships[key].speed > 0) { temp = '<span class="ptreSuccess">'+round(obj.ships[key].speed*100, 2)+' %<span>'; }
            str+= '<td align="center">'+temp+'</td>';
            temp = '-'; if (obj.ships[key].armor > 0) { temp = '<span class="ptreSuccess">'+round(obj.ships[key].armor*100, 2)+' %<span>'; }
            str+= '<td align="center">'+temp+'</td>';
            temp = '-'; if (obj.ships[key].shield > 0) { temp = '<span class="ptreSuccess">'+round(obj.ships[key].shield*100, 2)+' %<span>'; }
            str+= '<td align="center">'+temp+'</td>';
            temp = '-'; if (obj.ships[key].weapon > 0) { temp = '<span class="ptreSuccess">'+round(obj.ships[key].weapon*100, 2)+' %<span>'; }
            str+= '<td align="center">'+temp+'</td>';
            temp = '-'; if (obj.ships[key].cargo > 0) { temp = '<span class="ptreSuccess">'+round(obj.ships[key].cargo*100, 2)+' %<span>'; }
            str+= '<td align="center">'+temp+'</td>';
            temp = '-'; if (obj.ships[key].fuel > 0) { temp = '<span class="ptreSuccess">'+round(obj.ships[key].fuel*100, 2)+' %<span>'; }
            str+= '<td align="center">'+temp+'</td></tr>';
        } else {
            out["0"]["lifeformBonuses"]["BaseStatsBooster"][key] = {
                "armor": obj.ships[key].armor,
                "shield": obj.ships[key].shield,
                "weapon": obj.ships[key].weapon,
                "cargo": obj.ships[key].cargo,
                "speed": obj.ships[key].speed,
                "fuel": obj.ships[key].fuel
            };
        }
    }

    if (mode == "tab") {
        str+= '</table>';
        return str;
    }

    out["0"]["lifeformBonuses"]["CharacterClassBooster"]["1"] = obj.bonuses.characterClassBooster["1"];
    out["0"]["lifeformBonuses"]["CharacterClassBooster"]["2"] = obj.bonuses.characterClassBooster["2"];
    out["0"]["lifeformBonuses"]["CharacterClassBooster"]["3"] = obj.bonuses.characterClassBooster["3"];

    // Hook for simulator
    let ARR_ATT = [];
    ARR_ATT.push(out["0"]);
    const jsonOut = JSON.stringify({ "0": ARR_ATT });

    return btoa(jsonOut);
}

