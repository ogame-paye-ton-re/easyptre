// ****************************************
// Add PTRE styles
// Ugly style... yes!
// ****************************************
GM_addStyle(`
.ptreSuccess {
    color: #99CC00;
}
.ptreError {
    color: #D43635;
}
.ptreWarning {
    color: #D29D00;
}
.ptreBold {
    font-weight: bold;
}
.ptreSmall {
    font-size: 8pt;
    font-weight: normal;
}
.ptreBoxTitle {
    color: #6f9fc8;
    font-weight: bold;
    text-decoration: underline;
    margin: 5px;
}
.ptreCategoryTitle {
    color: #6f9fc8;
    font-weight: bold;
    margin: 5px;
}
.ptreSubTitle {
    color: #6f9fc8;
    margin: 5px;
}
.td_cell {
    padding: 3px;
}
.tr_cell_radius {
    background-color: transparent;
}
.td_cell_radius_0 {
    background-color: #12171C;
    padding: 3px;
    border-radius: 6px;
    border: 1px solid black;
}
.td_cell_radius_1 {
    background-color: #0d1014;
    padding: 3px;
    border-radius: 6px;
    border: 1px solid black;
}
.td_cell_radius_2 {
    background-color: #1031a0;
    padding: 3px;
    border-radius: 6px;
    border: 1px solid black;
}
.ptre_ship {
    background-image: url('https://gf3.geo.gfsrv.net/cdn84/3b19b4263662f5a383524052047f4f.png');
    background-repeat: no-repeat;
    height: 28px;
    width: 28px;
    display: block;
}
.ptre_ship_202 {
    background-position: 0 0;
}
.ptre_ship_203 {
    background-position: -28px 0;
}
.ptre_ship_204 {
    background-position: -56px 0;
}
.ptre_ship_205 {
    background-position: -84px 0;
}
.ptre_ship_206 {
    background-position: -112px 0;
}
.ptre_ship_207 {
    background-position: -140px 0;
}
.ptre_ship_208 {
    background-position: -168px 0;
}
.ptre_ship_209 {
    background-position: -196px 0;
}
.ptre_ship_210 {
    background-position: -224px 0;
}
.ptre_ship_211 {
    background-position: -252px 0;
}
.ptre_ship_212 {
    background-position: -280px 0;
}
.ptre_ship_213 {
    background-position: -308px 0;
}
.ptre_ship_214 {
    background-position: -336px 0;
}
.ptre_ship_215 {
    background-position: -364px 0;
}
.ptre_ship_217 {
    background-position: -448px 0;
}
.ptre_ship_218 {
    background-position: -392px 0;
}
.ptre_ship_219 {
    background-position: -420px 0;
}
.td_ship {
    padding: 3px;
}
.button {
    padding: 0px;
}
#divPTRESettings {
    position: fixed;
    top: 30px;
    right: 10px;
    z-index: 1000;
    font-size: 10pt;
}
#boxPTRESettings {
    width: 550px;
    padding:10px;
    border: solid black 2px;
    background-color: #171d22;
}
#boxPTREMessage {
    position: fixed;
    bottom: 30px;
    right: 10px;
    z-index: 1100;
    padding:10px;
    border: solid black 2px;
    background-color: #171d22;
}
#boxPTREInfos {
    position: fixed;
    top: 30px;
    right: 590px;
    z-index: 1000;
    font-size: 10pt;
    min-width: 300px;
    padding:10px;
    border: solid black 2px;
    background-color: #171d22;
}
#infoBoxContent {
    overflow-y: scroll;
    max-height: 600px;
}
#btnSaveOptPTRE {
    cursor:pointer;
}
#ptreGalaxyToolBar {
    background-color: #171d22;
    font-weight: revert;
    padding: 5px;
}
#ptreGalaxyMessageBoxContent {
    padding-left: 10px;
    padding-top: 3px;
    text-align: left;
    display: block;
    line-height: 1.3em;
}
#ptreGalaxyPopUp {
    width-min: 250px;
    position: absolute;
    border: solid black 2px;
    background-color: #171d22;
    z-index: 1001;
    padding: 5px;
}
`);

