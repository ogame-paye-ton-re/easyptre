// ****************************************
// Add PTRE styles
// Every color / size used by EasyPTRE is a --ptre-* variable (OGame look)
// ****************************************
GM_addStyle(`
:root {
    --ptre-success: #99CC00;
    --ptre-error: #D43635;
    --ptre-warning: #D29D00;
    --ptre-vacation: aqua;
    --ptre-title: #6f9fc8;
    --ptre-accent: #299f9b;
    --ptre-bg: #171d22;
    --ptre-bg-dark: #101518;
    --ptre-border: #2a3540;
    --ptre-border-dark: black;
    --ptre-cell: #12171C;
    --ptre-cell-alt: #0d1014;
    --ptre-cell-highlight: #1031a0;
    --ptre-radius: 8px;
    --ptre-radius-small: 6px;
}
.ptreSuccess {
    color: var(--ptre-success);
}
.ptreError {
    color: var(--ptre-error);
}
.ptreWarning {
    color: var(--ptre-warning);
}
.ptreVacation {
    color: var(--ptre-vacation);
}
.ptreBold {
    font-weight: bold;
}
.ptreSmall {
    font-size: 8pt;
    font-weight: normal;
}
.ptreBoxTitle {
    color: var(--ptre-title);
    font-weight: bold;
    text-decoration: underline;
    margin: 5px;
}
.ptreCategoryTitle {
    color: var(--ptre-title);
    font-weight: bold;
    margin: 10px;
}
.ptreSubTitle {
    color: var(--ptre-title);
    margin: 10px;
}
.ptreNotificationTitle {
    color: var(--ptre-title);
    font-weight: bold;
}
.td_cell {
    padding: 3px;
}
.tr_cell_radius {
    background-color: transparent;
}
.td_cell_radius_0 {
    background-color: var(--ptre-cell);
    padding: 3px;
    border-radius: var(--ptre-radius-small);
    border: 1px solid black;
}
.td_cell_radius_1 {
    background-color: var(--ptre-cell-alt);
    padding: 3px;
    border-radius: var(--ptre-radius-small);
    border: 1px solid black;
}
.td_cell_radius_2 {
    background-color: var(--ptre-cell-highlight);
    padding: 3px;
    border-radius: var(--ptre-radius-small);
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
/* ---------- UI helpers (13-ui.js) ---------- */
.ptreTable {
    width: 100%;
    border-collapse: separate;
    border-spacing: 2px;
}
.ptreTable th, .ptreTable td {
    padding: 3px 6px;
    border: 1px solid var(--ptre-border-dark);
    border-radius: var(--ptre-radius-small);
    background-color: var(--ptre-cell-alt);
    font-weight: normal;
    vertical-align: middle;
}
.ptreTable th {
    background-color: var(--ptre-cell);
    color: var(--ptre-title);
    text-align: center;
}
.ptreTable tbody tr:nth-child(even) td {
    background-color: var(--ptre-cell);
}
.ptreAlign-left {
    text-align: left;
}
.ptreAlign-center {
    text-align: center;
}
.ptreAlign-right {
    text-align: right;
}
.ptreInfoTable td:last-child {
    width: 35%;
}
.ptreSection {
    margin-bottom: 14px;
}
.ptreSectionHeader {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 6px;
}
.ptreSectionHeader .ptreCategoryTitle {
    margin: 0;
}
.ptreSectionActions {
    display: flex;
    gap: 4px;
}
.ptreButton {
    cursor: pointer;
}
.ptreLoading {
    text-align: center;
    padding: 20px;
    color: var(--ptre-warning);
}
.ptreSpinner {
    display: inline-block;
    width: 12px;
    height: 12px;
    margin-right: 8px;
    vertical-align: middle;
    border: 2px solid var(--ptre-title);
    border-top-color: transparent;
    border-radius: 50%;
    animation: ptreSpin 0.8s linear infinite;
}
@keyframes ptreSpin {
    to { transform: rotate(360deg); }
}
.ptreMessageBlock {
    padding: 6px 10px;
    margin: 6px 0;
    border-left: 3px solid var(--ptre-title);
    border-radius: var(--ptre-radius-small);
    background-color: var(--ptre-bg-dark);
}
.ptreMessageBlock-success {
    border-left-color: var(--ptre-success);
}
.ptreMessageBlock-error {
    border-left-color: var(--ptre-error);
}
.ptreMessageBlock-warning {
    border-left-color: var(--ptre-warning);
}
/* ---------- Main panel ---------- */
#ptreMainWrapper {
    position: fixed;
    top: 30px;
    right: 10px;
    z-index: 11000;
    width: min(750px, calc(100vw - 20px));
    font-size: 10pt;
}
#ptreMainBox {
    display: flex;
    flex-direction: column;
    /* Keep room for the OGame fixed footer bar (#siteFooter) */
    max-height: min(820px, calc(100vh - 60px));
    background-color: var(--ptre-bg);
    border: 2px solid var(--ptre-border-dark);
    border-radius: var(--ptre-radius);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.6);
    overflow: hidden;
}
#ptreMainHeader {
    display: flex;
    flex-direction: column;
    padding: 5px 10px;
    border-bottom: 1px solid var(--ptre-border);
    background-color: var(--ptre-bg-dark);
}
#ptreMainHeaderTop {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
    cursor: move;
    user-select: none;
}
#ptreMainTitle {
    color: var(--ptre-title);
    font-weight: bold;
    font-size: 11pt;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
#ptreMainHeaderButtons {
    display: flex;
    gap: 4px;
    flex-shrink: 0;
    cursor: default;
}
.ptreHeaderBtn {
    cursor: pointer;
    padding: 4px 8px;
    min-width: 0;
}
#messageDivInPanel {
    min-height: 0;
    padding: 4px 10px 2px 10px;
    font-size: 9pt;
    text-align: center;
}
#messageDivInPanel:empty {
    display: none;
}
#ptreMainBody {
    display: flex;
    flex: 1 1 auto;
    min-height: 0;
}
#ptreMainContent {
    flex: 1;
    padding: 10px;
    overflow-y: auto;
    min-width: 0;
}
#ptreMainNav {
    width: 110px;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 8px 6px;
    overflow-y: auto;
    border-left: 1px solid var(--ptre-border);
    background-color: var(--ptre-bg-dark);
}
.ptreNavBtn {
    display: block;
    text-align: center;
    cursor: pointer;
    padding: 4px 2px;
    min-width: 0;
}
.ptreNavBtn.ptreNavActive {
    outline: 2px solid var(--ptre-accent);
}
.ptreNavSeparator {
    border-top: 1px solid var(--ptre-border);
    margin: 4px 0;
}
#ptreMainWrapper.ptreMinimized #ptreMainBody,
#ptreMainWrapper.ptreMinimized #ptreMainFooter,
#ptreMainWrapper.ptreMinimized #ptreMainFooterMsg,
#ptreMainWrapper.ptreMinimized #messageDivInPanel {
    display: none;
}
#ptreMainWrapper.ptreMinimized #ptreMainHeader {
    border-bottom: none;
}
#ptreMainWrapper.ptreDragging {
    opacity: 0.85;
}
/* Narrow windows: icons only in navigation and header buttons */
@media (max-width: 900px) {
    #ptreMainNav {
        width: 36px;
    }
    .ptreNavLabel, .ptreHeaderBtnLabel {
        display: none;
    }
}
#ptreMainFooter {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 4px 10px;
    border-top: 1px solid var(--ptre-border);
    background-color: var(--ptre-bg-dark);
    font-size: 9pt;
}
#ptreMainFooterMsg {
    padding: 2px 10px 4px 10px;
    background-color: var(--ptre-bg-dark);
    font-size: 9pt;
    text-align: center;
}
#ptreMainFooterMsg:has(#ptreUpdateVersionMessage:empty) {
    display: none;
}
#boxPTREMessage {
    position: fixed;
    bottom: 30px;
    right: 10px;
    z-index: 10000;
    padding:10px;
    border: solid black 2px;
    background-color: var(--ptre-bg);
    border-radius: var(--ptre-radius);
}
#btnSaveOptPTRE {
    cursor:pointer;
}
#ptreGalaxyToolBar {
    background-color: var(--ptre-bg);
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
    min-width: 250px;
    position: absolute;
    border: solid black 2px;
    border-radius: var(--ptre-radius);
    background-color: var(--ptre-bg);
    z-index: 10000;
    padding: 5px;
}
#ptreOrionPopUp {
    position: fixed;
    top: 30px;
    right: 10px;
    min-width: 350px;
    max-width: 600px;
    max-height: calc(100vh - 60px);
    overflow-y: auto;
    border: solid black 2px;
    border-radius: var(--ptre-radius);
    background-color: var(--ptre-bg);
    z-index: 11000;
    padding: 5px;
}
.ptreOrionButton {
    vertical-align: middle;
    margin-left: 4px;
}
.ptreIconAnim {
    cursor: pointer;
    transition: transform 0.15s ease, filter 0.15s ease;
}
.ptreIconAnim:hover {
    transform: scale(1.25);
    filter: brightness(1.3);
}
.ptreIconAnim:active {
    transform: scale(0.9);
}
.ptreIconActive {
    animation: ptreIconPulse 1s ease-in-out infinite;
}
@keyframes ptreIconPulse {
    0%, 100% { transform: scale(1); filter: drop-shadow(0 0 0 var(--ptre-title)); }
    50% { transform: scale(1.3); filter: drop-shadow(0 0 4px var(--ptre-title)); }
}
#optionPTRE {
    position: relative;
}
#ptreTopRightMenuButton {
    position: fixed;
    top: 10px;
    right: 10px;
    z-index: 10000;
    padding: 3px 0;
    cursor: pointer;
}
#ptreMissingTKBadge {
    position: absolute;
    top: 2px;
    right: 2px;
    background-color: var(--ptre-error);
    color: white;
    border-radius: 50%;
    width: 14px;
    height: 14px;
    font-size: 9px;
    font-weight: bold;
    text-align: center;
    line-height: 14px;
    z-index: 10000;
    cursor: pointer;
}
`);

