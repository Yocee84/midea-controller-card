// Midea M-thermal wired controller emulator card for Home Assistant.
// Works with the Mosibi/Midea-heat-pump-ESPHome entities (number.heatpump_set_water_temperature_t1s_zone_1)
// and with register-numbered names (number.heatpump_002_set_water_temperature_t1s_zone_1). Options:
//   device: heatpump   (the ESPHome devicename substitution)
//   lang: en | hu      (on-screen messages; menu texts are always the controller's English)
// Navigation like the real wired controller: MENU, arrows, OK (enter), BACK, ON/OFF, long-press UNLOCK.
const H = "heatpump_";
const n = (s, label, step) => ({ t: "num", e: "number." + H + s, label, step });
const sw = (s, label) => ({ t: "sw", e: "switch." + H + s, label });
const sel = (s, label) => ({ t: "sel", e: "select." + H + s, label });
const info = (s, label, dom) => ({ t: "info", e: (dom || "sensor") + "." + H + s, label });
const note = (label, text) => ({ t: "note", label, text });
const sub = (label, items, extra) => ({ t: "menu", label, items, ...(extra || {}) });
const P1 = "210_parameter_setting_1_", P2 = "211_parameter_setting_2_";

const SERVICE = sub("FOR SERVICEMAN", [
  sub("1.DHW MODE SETTING", [sw(P1 + "enable_water_heating", "1.1 DHW MODE"), sw(P1 + "supports_disinfection", "1.2 DISINFECT"),
    sw(P1 + "heating_and_cooling_first_or_water_first", "1.3 DHW PRIORITY"), sw(P1 + "dhw_pump_supported", "1.4 PUMP_D"),
    n("212_dt5_on", "dT5_ON"), n("213_dt1s5", "dT1S5"), n("215_t4_dhw_max", "T4DHWMAX"), n("216_t4_dhw_min", "T4DHWMIN"),
    n("214_t_interval_dhw", "t_INTERVAL_DHW"), n("219_t4_tbh_on", "T4_TBH_ON"), n("218_dt5_tbh_off", "dT5_TBH_OFF"),
    n("217_t_tbh_delay", "t_TBH_DELAY"), n("220_temperature_for_disinfection_operation", "T5S_DI"),
    n("222_disinfection_high_temperature_duration", "t_DI_HIGHTEMP"), n("221_maximum_disinfection_duration", "t_DI_MAX"),
    n("241_water_heating_max_duration", "t_DHWHP_MAX"), n("242_t_dhwhp_restrict", "t_DHWHP_RESTRICT"),
    n("209_dhw_pump_return_running_time", "PUMP_D RUN TIME"), sw(P1 + "dhw_pump_supports_pipe_disinfect", "1.21 PUMP_D DISINFECT")]),
  sub("2.COOL MODE SETTING", [sw(P1 + "enable_cooling", "2.1 COOL MODE"), n("270_t_t4_fresh_c", "t_T4_FRESH_C"),
    n("226_t4cmax", "T4CMAX"), n("227_t4cmin", "T4CMIN"), n("224_dt1sc", "dT1SC"), n("225_dtsc", "dTSC"),
    n("223_time_interval_of_compressor_startup_in_cooling_mode", "t_INTERVAL_C"),
    sw(P2 + "setting_the_high_low_temperature_of_cooling_mode_t1s", "T1SetC HIGH/LOW"),
    n("261_t1setc1", "T1SetC1"), n("262_t1setc2", "T1SetC2"), n("263_t4c1", "T4C1"), n("264_t4c2", "T4C2"),
    sel("272_zone_1_end_cooling_mode_emission_type", "ZONE1 C-EMISSION"), sel("272_zone_2_end_cooling_mode_emission_type", "ZONE2 C-EMISSION")]),
  sub("3.HEAT MODE SETTING", [sw(P1 + "enable_heating", "3.1 HEAT MODE"), n("270_t_t4_fresh_h", "t_T4_FRESH_H"),
    n("231_t4hmax", "T4HMAX"), n("232_t4hmin", "T4HMIN"), n("229_dt1sh", "dT1SH"), n("230_dtsh", "dTSH"),
    n("228_time_interval_of_compressor_startup_in_heating_mode", "t_INTERVAL_H"),
    sw(P2 + "setting_the_high_low_temperature_of_heating_mode_t1s", "T1SetH HIGH/LOW"),
    n("265_t1seth1", "T1SetH1"), n("266_t1seth2", "T1SetH2"), n("267_t4h1", "T4H1"), n("268_t4h2", "T4H2"),
    sel("272_zone_1_end_heating_mode_emission_type", "ZONE1 H-EMISSION"), sel("272_zone_2_end_heating_mode_emission_type", "ZONE2 H-EMISSION")]),
  sub("4.AUTO MODE SETTING", [n("243_t4autocmin", "T4AUTOCMIN"), n("244_t4autohmax", "T4AUTOHMAX")]),
  sub("5.TEMP. TYPE SETTING", [sw(P1 + "supports_room_temperature_sensor_ta", "ROOM TEMP. (Ta)"),
    sw(P2 + "double_zone_setting_is_valid", "DOUBLE ZONE"), sw(P1 + "supports_t1_sensor", "T1 SENSOR")]),
  sub("6.ROOM THERMOSTAT", [sw(P1 + "supports_room_thermostat", "ROOM THERMOSTAT"), sw(P1 + "room_thermostat", "RT MODE"),
    sw(P1 + "dual_room_thermostat_supported", "DUAL RT")]),
  sub("7.OTHER HEATING SOURCE", [n("233_ambient_temperature_for_enabling_hydraulic_module_auxiliary_electric_heating_ibh", "T4_IBH_ON"),
    n("234_temperature_return_difference_for_enabling_the_hydraulic_module_auxiliary_ibh", "dT1_IBH_ON"),
    n("235_delay_time_of_enabling_the_hydraulic_module_auxiliary_electric_heating_ibh", "t_IBH_DELAY"),
    n("237_ambient_temperature_trigger_for_ahs", "T4_AHS_ON"),
    n("238_trigger_temperature_difference_between_t1s_and_current_heat_for_ahs", "dT1_AHS_ON"),
    n("240_delay_time_for_enabling_ahs", "t_AHS_DELAY"), sw(P2 + "ibh_ahs_installation_position", "IBH LOCATE"),
    sw(P2 + "m1m2_is_used_for_ahs_control", "M1M2 = AHS"), n("250_ibh1_power", "P_IBH1"), n("251_ibh2_power", "P_IBH2"), n("252_tbh_power", "P_TBH")]),
  sub("8.HOLIDAY AWAY SETTING", [n("245_heating_or_cooling_temperature_when_holiday_mode_is_active", "T1S_H.A_H"),
    n("246_domestic_hot_water_temperature_when_holiday_mode_is_active", "T5S_H.A_DHW")]),
  note("9.SERVICE CALL", { en: "Only on the wired controller.", hu: "Csak a valódi kijelzőn állítható." }),
  { t: "factory", label: "10.RESTORE FACTORY SET.", e: "switch." + H + "restart_with_factory_default_settings" },
  note("11.TEST RUN", { en: "Only on the wired controller.", hu: "Csak a valódi kijelzőn indítható." }),
  sub("12.SPECIAL FUNCTION", [n("259_running_time_of_floor_heating_for_the_first_time", "t_FIRSTFH"),
    n("260_t1s_of_floor_heating_for_the_first_time", "T1S_FIRSTFH"), n("255_temperature_rise_day_number", "t_DRYUP"),
    n("256_drying_day_number", "t_HIGHPEAK"), n("257_temperature_drop_day_number", "t_DRYD"), n("258_highest_drying_temperature", "T_DRYPEAK")]),
  note("13.AUTO RESTART", { en: "Only on the wired controller.", hu: "Csak a valódi kijelzőn állítható." }),
  sub("14.POWER INPUT LIMIT.", [sel("269_power_input_limitation_type", "POWER INPUT LIMIT")]),
  sub("15.INPUT DEFINE", [sw(P2 + "m1m2_is_used_for_ahs_control", "15.1 M1M2"), sw(P2 + "smart_grid", "15.2 SMART GRID"),
    sw(P2 + "tw2_enabled", "15.3 Tw2"), sw(P2 + "tbt_sensor_enable", "15.4 Tbt1"), sw(P2 + "tbt2_sensor_is_valid", "15.5 Tbt2"),
    n("249_dtbt2", "dTbt2"), sw(P2 + "ta_sensor_position", "15.6 Ta"), sw(P2 + "solar_energy_input_port", "15.7 SOLAR INPUT"),
    sw(P2 + "solar_energy_kit_enable", "SOLAR KIT"), sw(P2 + "piping_length_selection", "15.8 F-PIPE LENGTH"),
    sw(P2 + "port_definition", "PORT DEF."), sw(P2 + "enable_temperature_collection_kit", "TEMP. KIT")]),
  sub("16.CASCADE SET", [n("247_per_start_ratio", "PER_START"), n("248_time_adjust", "TIME_ADJUST")]),
  note("17.HMI ADDRESS SET", { en: "Only on the wired controller.", hu: "Csak a valódi kijelzőn állítható." }),
], { password: true });

// OPERATION PARAMETER pages, labelled like the real display (labels are a best match to the Modbus registers).
const OP = [["123_unit_capacity", "ODU MODEL"], ["118_outdoor_unit_current", "COMP. CURRENT"],
  ["100_compressor_operating_frequency", "COMP. FREQUENCY"], ["122_compressor_operation_time", "COMP.TOTAL RUN TIME"],
  ["103_pmv_openness", "EXPANSION VALVE"], ["102_fan_speed", "FAN SPEED"], ["132_compressor_target_frequency", "COMP. TARGET FREQ."],
  ["104_water_inlet_temperature", "TW_IN"], ["105_water_outlet_temperature", "TW_OUT"], ["110_total_water_outlet_temperature_t1", "T1"],
  ["111_system_total_water_outlet_temperature_t1b", "T1B"], ["114_room_temperature_ta", "Ta"], ["115_water_tank_temperature_t5", "T5"],
  ["106_condensor_temperature_t3", "T3"], ["107_outdoor_ambient_temperature", "T4"], ["108_discharge_temperature", "TP"],
  ["109_return_air_temperature", "TH"], ["112_refrigerant_liquid_side_temperature_t2", "T2"], ["113_refrigerant_gas_side_temperature_t2b", "T2B"],
  ["116_outdoor_unit_high_pressure", "P1 HIGH PRESSURE"], ["117_outdoor_unit_low_pressure", "P2 LOW PRESSURE"],
  ["119_outdoor_unit_voltage", "ODU VOLTAGE"], ["133_dc_bus_current", "DC BUS CURRENT"], ["134_dc_bus_voltage", "DC BUS VOLTAGE"],
  ["135_tf_module_temperature", "TF MODULE TEMP."], ["138_water_flow", "WATER FLOW"], ["140_ability_of_hydraulic_module", "HP CAPACITY"],
  ["143_electricity_consumption", "POWER CONSUMPTION"], ["145_power_output", "HEAT OUTPUT"], ["130_software_version", "ODU SOFTWARE"],
  ["131_wired_controller_version_number", "HMI SOFTWARE"]];
const opParams = (card) => OP.filter(([s]) => card.st("sensor." + H + s))
  .map(([s, label]) => ({ t: "info", e: "sensor." + H + s, label }));
const MENU = (hass) => sub("MENU", [
  sub("OPERATION MODE", [sel("001_operational_mode", "MODE"), sw("000_water_flow_temperature_control_zone_1", "ZONE1 ON/OFF"),
    sw("000_water_flow_temperature_control_zone_2", "ZONE2 ON/OFF"), sw("000_room_temperature_control", "ROOM CTRL ON/OFF")]),
  sub("PRESET TEMPERATURE", [n("002_set_water_temperature_t1s_zone_1", "WATER TEMP. ZONE1"), n("002_set_water_temperature_t1s_zone_2", "WATER TEMP. ZONE2"),
    n("003_air_temperature_ts", "ROOM TEMP. Ts", 0.5), sw("005_weather_compensation_zone_1", "WEATHER COMP. Z1"),
    n("006_weather_compensation_curve_zone_1", "CURVE ZONE1"), sw("005_weather_compensation_zone_2", "WEATHER COMP. Z2"),
    n("006_weather_compensation_curve_zone_2", "CURVE ZONE2"), sw("005_function_setting_eco_mode", "ECO MODE")]),
  sub("DOMESTIC HOT WATER(DHW)", [sw("000_power_dhw_t5s", "DHW ON/OFF"), n("004_set_dhw_tank_temperature_t5s", "TANK TEMP. T5S"),
    info("115_water_tank_temperature_t5", "TANK T5"), sw("005_function_setting_disinfect", "DISINFECT"),
    sw("007_forced_water_tank_heating_on_off", "FAST DHW"),
    sw("005_function_setting_dhw_pumps_running_constant_temperature_water_recycling", "DHW PUMP")]),
  note("SCHEDULE", { en: "Schedules are not available over Modbus; set them on the wired controller.", hu: "Az ütemezés nem érhető el Modbuson, a valódi kijelzőn állítható." }),
  sub("OPTIONS", [sw("005_function_setting_silent_mode", "SILENT MODE"), sw("005_function_setting_silent_mode_level", "SILENT LEVEL 2"),
    sw("005_function_setting_holiday_home", "HOLIDAY HOME"),
    n("245_heating_or_cooling_temperature_when_holiday_mode_is_active", "HOLIDAY AWAY T1S"),
    n("246_domestic_hot_water_temperature_when_holiday_mode_is_active", "HOLIDAY AWAY T5S")]),
  { t: "childlock", label: "CHILD LOCK" },
  sub("SERVICE INFORMATION", [info("current_fault_error_code_description", "ERROR"), info("fault_1_error_code", "FAULT 1"),
    info("fault_2_error_code", "FAULT 2"), info("fault_3_error_code", "FAULT 3"), info("122_compressor_operation_time", "COMP. RUN TIME"),
    info("143_electricity_consumption", "ELEC. CONSUMPTION"), info("145_power_output", "HEAT OUTPUT"),
    info("coefficient_of_performance", "COP"), info("130_software_version", "SOFTWARE VER."), info("131_wired_controller_version_number", "HMI VER.")]),
  sub("OPERATION PARAMRTER", opParams(hass)),
  SERVICE,
  note("WLAN SETTING", { en: "WLAN is set on the wired controller.", hu: "A WLAN a valódi kijelzőn állítható." }),
]);

const ICON = {
  heat: `<svg viewBox="0 0 24 24" width="1.5em" height="1.5em" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M4 14c3-2 5 2 8 0s5 2 8 0M4 18c3-2 5 2 8 0s5 2 8 0"/><path d="M8 4c-1 2 1 3 0 5M12 4c-1 2 1 3 0 5M16 4c-1 2 1 3 0 5"/></svg>`,
  drop: `<svg viewBox="0 0 24 24" width="0.9em" height="0.9em" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 3c3 5 6 8 6 12a6 6 0 0 1-12 0c0-4 3-7 6-12z"/></svg>`,
  sun: `<svg viewBox="0 0 24 24" width="1.9em" height="1.9em" fill="none" stroke="currentColor" stroke-width="1.3"><circle cx="12" cy="12" r="4.5"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1"/></svg>`,
  snow: `<svg viewBox="0 0 24 24" width="1.9em" height="1.9em" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M12 2v20M3.3 7l17.4 10M3.3 17L20.7 7M9 4l3 2 3-2M9 20l3-2 3 2"/></svg>`,
  auto: `<svg viewBox="0 0 24 24" width="1.9em" height="1.9em" fill="none" stroke="currentColor" stroke-width="1.3"><circle cx="12" cy="12" r="9"/><text x="12" y="16.5" font-size="11" text-anchor="middle" fill="currentColor" stroke="none">A</text></svg>`,
  tank: `<svg viewBox="0 0 24 24" width="1.5em" height="1.5em" fill="none" stroke="currentColor" stroke-width="1.3"><rect x="7" y="3" width="10" height="18" rx="3"/><path d="M7 13h10"/></svg>`,
  house: `<svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3 11l9-7 9 7M5 10v10h14V10"/></svg>`,
  wifi: `<svg viewBox="0 0 24 24" width="1.1em" height="1.1em" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M2 9a15 15 0 0 1 20 0M5 12.5a10 10 0 0 1 14 0M8.5 16a5 5 0 0 1 7 0"/><circle cx="12" cy="19" r="1" fill="currentColor"/></svg>`,
  lock: `<svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="5" y="11" width="14" height="9" rx="1"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>`,
  updown: `<span class="ud">&#9650;<br>&#9660;</span>`,
  lr: `<span class="lr">&#9664;&#9654;</span>`,
};

class MideaControllerCard extends HTMLElement {
  setConfig(config) { this.config = config || {}; this.stack = []; this.mode = "home"; this.locked = false; this.msg = null; }
  getCardSize() { return 9; }
  set hass(h) { this._hass = h; if (!this.root) this.build(); this.render(); }

  build() {
    this.root = this.attachShadow({ mode: "open" });
    this.root.innerHTML = `<style>
      :host{display:block} ha-card{padding:14px;background:var(--card-background-color)}
      .dev{position:relative;width:100%;max-width:520px;margin:0 auto;aspect-ratio:1/1.02;border-radius:5% / 5%;
        background:linear-gradient(160deg,#f3f4f4,#dfe1e1);box-shadow:0 2px 8px rgba(0,0,0,.35), inset 0 0 0 2px #cfd2d2;
        font-family:Arial,Helvetica,sans-serif;container-type:inline-size;user-select:none}
      .dots{position:absolute;left:3%;right:3%;top:59.5%;bottom:3%;border-radius:0 0 4% 4%;
        background-image:radial-gradient(#b9bdbd 0.7px,transparent 0.9px);background-size:6px 6px;opacity:.9}
      .grille{position:absolute;right:4%;top:3.5%;width:8%;height:8%;background-image:radial-gradient(#8d9292 0.9px,transparent 1.1px);background-size:4px 4px}
      .logo{position:absolute;top:5%;left:0;right:0;text-align:center;color:#24479a;font-weight:800;font-size:7.5cqw;letter-spacing:.02em}
      .bezel{position:absolute;left:12.5%;top:16%;width:75%;height:38%;background:#3a3d40;border-radius:2.5%;padding:1.3%}
      .lcd{width:100%;height:100%;box-sizing:border-box;background:radial-gradient(ellipse at 50% 40%,#f6fbff 0%,#e4eefb 75%,#d3e0f2 100%);
        border-radius:2%;overflow:hidden;color:#2b3a86;font:400 3.35cqw/1.0 "Courier New",Consolas,monospace;letter-spacing:.02em;display:flex;flex-direction:column}
      .cc{position:absolute;top:56.3%;left:0;right:0;text-align:center;font-size:2.7cqw;letter-spacing:.12em;color:#2d2f31}
      .hdr,.row,.ftr{display:flex;justify-content:space-between;align-items:center;padding:0 2.2%;white-space:nowrap}
      .hdr{height:12%;border-bottom:1px solid #6f7fb7}
      .row{height:12.2%;border-bottom:1px solid #8d9ccb;margin:0 1.5%}
      .row span:first-child{overflow:hidden;text-overflow:ellipsis}
      .row.sel{background:#4865b4;color:#f2f6ff;border-bottom-color:#4865b4}
      .ftr{height:12%;margin-top:auto}
      .okb{background:#5a6aa8;color:#fff;padding:0 .3em;margin-right:.3em}
      .ud,.lr{display:inline-block;background:#5a6aa8;color:#fff;font-size:.55em;line-height:1;padding:.15em .3em;border-radius:2px;text-align:center}
      .home{display:flex;flex:1}.col{flex:1;border-right:1px solid #6f7fb7;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12%}
      .col:last-child{border-right:0}.bigt{font-size:2.1em}.deg{font-size:.45em;vertical-align:top}
      .big{font-size:2.3em;text-align:center;margin-top:9%}.mid{text-align:center;padding:2% 4%;line-height:1.3;white-space:normal}
      .edit{background:#4865b4;color:#fff;padding:0 .15em}
      .btn{position:absolute;transform:translate(-50%,-50%);width:17%;height:9%;display:flex;align-items:center;justify-content:center;
        color:#26292b;font-size:3.6cqw;cursor:pointer;border-radius:8px;-webkit-tap-highlight-color:transparent;flex-direction:column;line-height:1}
      .btn:active{background:rgba(0,0,0,.08)} .btn.tri{font-size:5.2cqw} .btn small{font-size:1.9cqw;letter-spacing:.02em}
    </style><ha-card><div class="dev"><div class="dots"></div><div class="grille"></div>
      <div class="bezel"><div class="lcd"></div></div><div class="cc">COMFORT CONTROL</div></div></ha-card>`;
    const dev = this.root.querySelector(".dev");
    const B = [["menu", "MENU", 23, 66], ["up", "&#9650;", 50, 66, 1], ["power", "ON/OFF", 77, 66], ["left", "&#9664;", 23, 76.5, 1],
      ["ok", "OK", 50, 76.5], ["right", "&#9654;", 77, 76.5, 1], ["back", "BACK", 23, 87], ["down", "&#9660;", 50, 87, 1],
      ["lock", "UNLOCK<small>(LONG PRESS)</small>", 77, 87]];
    for (const [k, label, x, y, tri] of B) {
      const d = document.createElement("div"); d.className = "btn" + (tri ? " tri" : ""); d.style.left = x + "%"; d.style.top = y + "%";
      d.innerHTML = label;
      if (k === "lock") {
        let t = null;
        d.addEventListener("pointerdown", () => { t = setTimeout(() => { t = null; this.press("lock"); }, 900); });
        const cancel = () => { if (t) { clearTimeout(t); t = null; if (this.locked) this.flash(this.L("LONG PRESS", "NYOMD HOSSZAN")); } };
        d.addEventListener("pointerup", cancel); d.addEventListener("pointerleave", cancel);
      } else d.addEventListener("click", () => this.press(k));
      dev.appendChild(d);
    }
    this.lcd = this.root.querySelector(".lcd");
  }

  // Entity ids are written as domain.heatpump_NNN_name; map them to the configured device name and
  // fall back to the unnumbered upstream name when the numbered one does not exist.
  R(e) {
    this._rc = this._rc || {}; if (this._rc[e]) return this._rc[e];
    const dev = this.config.device || "heatpump", [dom, obj] = e.split(".");
    const rest = obj.startsWith(H) ? obj.slice(H.length) : obj, bare = rest.replace(/^\d{3}_/, "");
    const cands = [`${dom}.${dev}_${rest}`, `${dom}.${dev}_${bare}`];
    const hit = cands.find((c) => this._hass.states[c]);
    if (hit) this._rc[e] = hit;
    return hit || cands[0];
  }
  st(e) { return this._hass.states[this.R(e)]; }
  L(en, hu) { return this.config.lang === "hu" ? hu : en; }
  num(e) { const s = this.st(e); return s && !isNaN(parseFloat(s.state)) ? parseFloat(s.state) : null; }
  val(item) {
    const s = this.st(item.e); if (!s) return "--";
    if (item.t === "sw") return s.state === "on" ? "ON" : s.state === "off" ? "OFF" : s.state;
    const u = item.label === "ODU MODEL" ? "kW" : (s.attributes.unit_of_measurement || "");
    const v = isNaN(parseFloat(s.state)) ? s.state : String(Math.round(parseFloat(s.state) * 100) / 100);
    return v + (u ? " " + u : "");
  }
  cur() { return this.stack[this.stack.length - 1]; }
  home() { this.mode = "home"; this.stack = []; }

  press(k) {
    const card = this, hs = this._hass;
    const h = { user: hs.user, callService: (d, sv, data) => hs.callService(d, sv, { ...data, entity_id: card.R(data.entity_id) }) };
    if (k === "lock") { this.locked = !this.locked; this.home(); return this.render(); }
    if (this.locked) { this.flash(this.L("LOCKED", "ZÁROLVA")); return; }
    if (this.mode === "home") {
      if (k === "menu") { this.stack = [{ node: MENU(this), pos: 0 }]; this.mode = "menu"; }
      else if (k === "power") {
        const on = (this.st("switch.heatpump_000_water_flow_temperature_control_zone_1") || {}).state === "on";
        this.confirm(on ? this.L("HEATING OFF?", "FŰTÉS KIKAPCSOLÁSA?") : this.L("HEATING ON?", "FŰTÉS BEKAPCSOLÁSA?"),
          () => h.callService("switch", "toggle", { entity_id: "switch.heatpump_000_water_flow_temperature_control_zone_1" }));
      } else if (k === "up" || k === "down") {
        const e = "number.heatpump_002_set_water_temperature_t1s_zone_1", s = this.st(e);
        if (s) { const a = s.attributes, v = Math.min(a.max ?? 60, Math.max(a.min ?? 5, parseFloat(s.state) + (k === "up" ? 1 : -1)));
          h.callService("number", "set_value", { entity_id: e, value: v }); }
      }
      return this.render();
    }
    if (this.mode === "confirm") {
      if (k === "ok") { const f = this.onYes; this.mode = this.prevMode; f(); }
      else if (k === "back") this.mode = this.prevMode; else if (k === "menu") this.home();
      return this.render();
    }
    if (this.mode === "password") {
      const p = this.pw;
      if (k === "left") p.i = Math.max(0, p.i - 1); else if (k === "right") p.i = Math.min(2, p.i + 1);
      else if (k === "up") p.d[p.i] = (p.d[p.i] + 1) % 10; else if (k === "down") p.d[p.i] = (p.d[p.i] + 9) % 10;
      else if (k === "ok") {
        if (p.d.join("") === "234" && h.user && h.user.is_admin) { this.stack.push({ node: p.node, pos: 0 }); this.mode = "menu"; }
        else this.flash(h.user && !h.user.is_admin ? this.L("ADMIN ONLY", "CSAK ADMIN") : this.L("WRONG PASSWORD", "HIBÁS JELSZÓ"));
      } else if (k === "back") this.mode = "menu"; else if (k === "menu") this.home();
      return this.render();
    }
    if (this.mode === "edit") {
      const ed = this.ed, it = ed.item;
      if (k === "up" || k === "down") {
        const dir = k === "up" ? 1 : -1;
        if (it.t === "num") { const a = this.st(it.e).attributes, step = it.step || a.step || 1;
          ed.v = Math.min(a.max ?? 1e9, Math.max(a.min ?? -1e9, Math.round((ed.v + dir * step) * 100) / 100)); }
        else if (it.t === "sw") ed.v = ed.v === "on" ? "off" : "on";
        else if (it.t === "sel") { const o = this.st(it.e).attributes.options; ed.v = o[(o.indexOf(ed.v) + dir + o.length) % o.length]; }
      } else if (k === "ok") {
        if (it.t === "num") h.callService("number", "set_value", { entity_id: it.e, value: ed.v });
        else if (it.t === "sw") h.callService("switch", ed.v === "on" ? "turn_on" : "turn_off", { entity_id: it.e });
        else if (it.t === "sel") h.callService("select", "select_option", { entity_id: it.e, option: ed.v });
        this.mode = "menu"; this.flash(this.L("SAVED", "MENTVE"));
      } else if (k === "back") this.mode = "menu"; else if (k === "menu") this.home();
      return this.render();
    }
    if (this.mode === "note") { if (k === "back" || k === "ok") this.mode = "menu"; else if (k === "menu") this.home(); return this.render(); }
    const c = this.cur(), items = c.node.items, N = items.length;
    const paged = c.node.label === "OPERATION PARAMRTER";
    if (paged && (k === "up" || k === "down" || k === "left" || k === "right")) {
      const pages = Math.ceil(N / 6), pg = Math.floor(c.pos / 6), fwd = k === "down" || k === "right";
      c.pos = ((pg + (fwd ? 1 : pages - 1)) % pages) * 6;
    }
    else if (k === "ok" && paged) { /* parameter pages are read-only */ }
    else if (k === "up") c.pos = (c.pos + N - 1) % N;
    else if (k === "down") c.pos = (c.pos + 1) % N;
    else if (k === "left") c.pos = Math.max(0, c.pos - 6);
    else if (k === "right") c.pos = Math.min(N - 1, c.pos + 6);
    else if (k === "menu") this.home();
    else if (k === "back") { this.stack.pop(); if (!this.stack.length) this.mode = "home"; }
    else if (k === "ok") {
      const it = items[c.pos];
      if (it.t === "menu") {
        if (it.password) { this.pw = { d: [0, 0, 0], i: 0, node: it }; this.mode = "password"; }
        else this.stack.push({ node: it, pos: 0 });
      } else if (it.t === "num" || it.t === "sw" || it.t === "sel") {
        const s = this.st(it.e); if (!s) return this.flash(this.L("NO DATA", "NINCS ADAT"));
        this.ed = { item: it, v: it.t === "num" ? parseFloat(s.state) : s.state }; this.mode = "edit";
      } else if (it.t === "note") { this.noteText = typeof it.text === "string" ? it.text : (it.text[this.config.lang] || it.text.en); this.noteTitle = it.label; this.mode = "note"; }
      else if (it.t === "childlock") { this.locked = true; this.home(); }
      else if (it.t === "factory") this.confirm(this.L("RESTORE FACTORY SETTINGS?", "GYÁRI VISSZAÁLLÍTÁS?"), () => h.callService("switch", "turn_on", { entity_id: it.e }));
    }
    this.render();
  }

  confirm(text, fn) { this.prevMode = this.mode; this.mode = "confirm"; this.confirmText = text; this.onYes = fn; this.render(); }
  flash(t) { this.msg = t; this.render(); clearTimeout(this._ft); this._ft = setTimeout(() => { this.msg = null; this.render(); }, 1400); }

  render() {
    if (!this.lcd || !this._hass) return;
    const esc = (s) => String(s).replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));
    const okEnter = `<span><span class="okb">OK</span>ENTER</span>`;
    let html = "";
    if (this.msg) html = `<div class="hdr">&nbsp;</div><div class="big" style="font-size:1.6em;margin-top:18%">${esc(this.msg)}</div>`;
    else if (this.mode === "home") {
      const d = new Date(), p = (x) => String(x).padStart(2, "0");
      const t4 = this.num("sensor.heatpump_107_outdoor_ambient_temperature");
      const mode = (this.st("select.heatpump_001_operational_mode") || {}).state || "";
      const on = (this.st("switch.heatpump_000_water_flow_temperature_control_zone_1") || {}).state === "on";
      const t1s = this.num("number.heatpump_002_set_water_temperature_t1s_zone_1");
      const dhwOn = (this.st("switch.heatpump_000_power_dhw_t5s") || {}).state === "on";
      const t5s = this.num("number.heatpump_004_set_dhw_tank_temperature_t5s");
      const mi = mode === "Cool" ? ICON.snow : mode === "Auto" ? ICON.auto : ICON.sun;
      const run = this.num("sensor.heatpump_100_compressor_operating_frequency");
      html = `<div class="hdr"><span>${p(d.getDate())}-${p(d.getMonth() + 1)}-${d.getFullYear()}</span><span>${p(d.getHours())}:${p(d.getMinutes())}</span>
          <span>${ICON.house}${t4 === null ? "--" : Math.round(t4)}°</span><span>${this.locked ? ICON.lock + " " : ""}${ICON.wifi}</span></div>
        <div class="home">
          <div class="col">${ICON.heat}<div>${ICON.drop} <span class="bigt">${t1s === null ? "--" : Math.round(t1s)}</span><span class="deg">°C</span></div></div>
          <div class="col"><div style="font-size:1.5em">${on ? "ON" : "OFF"}</div>${mi}<div style="font-size:.8em">${run ? Math.round(run) + " Hz" : ""}</div></div>
          <div class="col">${dhwOn ? `${ICON.tank}<div><span class="bigt">${t5s === null ? "--" : Math.round(t5s)}</span><span class="deg">°C</span></div>` : ""}</div>
        </div>`;
    } else if (this.mode === "confirm") {
      html = `<div class="hdr"><span>${this.L("CONFIRM", "MEGERŐSÍTÉS")}</span></div><div class="mid" style="margin-top:14%">${esc(this.confirmText)}</div>
        <div class="ftr">${okEnter}<span>${this.L("BACK: CANCEL", "BACK: MÉGSE")}</span></div>`;
    } else if (this.mode === "password") {
      const p = this.pw;
      html = `<div class="hdr"><span>FOR SERVICEMAN</span></div><div class="mid" style="margin-top:8%">Please input the password:</div>
        <div class="big">${p.d.map((x, i) => i === p.i ? `<span class="edit">${x}</span>` : x).join(" ")}</div>
        <div class="ftr"><span>${ICON.lr} ADJUST</span>${okEnter}</div>`;
    } else if (this.mode === "edit") {
      const it = this.ed.item, s = this.st(it.e), u = (s && s.attributes.unit_of_measurement) || "";
      const v = it.t === "sw" ? (this.ed.v === "on" ? "YES" : "NON") : this.ed.v;
      html = `<div class="hdr"><span>${esc(it.label)}</span></div><div class="big"><span class="edit">${esc(v)}</span> <span style="font-size:.5em">${esc(u)}</span></div>
        <div class="mid">${this.L("current", "jelenleg")}: ${esc(this.val(it))}</div><div class="ftr"><span>${ICON.updown} ADJUST</span>${okEnter}</div>`;
    } else if (this.mode === "note") {
      html = `<div class="hdr"><span>${esc(this.noteTitle)}</span></div><div class="mid" style="margin-top:10%">${esc(this.noteText)}</div>
        <div class="ftr"><span>BACK</span><span></span></div>`;
    } else {
      const c = this.cur(), items = c.node.items, page = Math.floor(c.pos / 6), pages = Math.max(1, Math.ceil(items.length / 6));
      const isParam = c.node.label === "OPERATION PARAMRTER";
      html = `<div class="hdr"><span>${esc(isParam ? "OPERATION PARAMETER" : c.node.label)}</span><span>${isParam ? "#00" : `${page + 1}/${pages}`}</span></div>`;
      for (let i = page * 6; i < page * 6 + 6; i++) {
        const it = items[i];
        if (!it) { html += `<div class="row">&nbsp;</div>`; continue; }
        let right = "";
        if (["num", "sel", "info"].includes(it.t)) right = `<span>${esc(this.val(it))}</span>`;
        else if (it.t === "sw") right = `<span>${this.val(it) === "ON" ? "YES" : "NON"}</span>`;
        html += `<div class="row${!isParam && i === c.pos ? " sel" : ""}"><span>${esc(it.label)}</span>${right}</div>`;
      }
      html += isParam ? `<div class="ftr"><span>${ICON.lr} ADDRESS</span><span>${page + 1}/${pages} ${ICON.updown}</span></div>`
                      : `<div class="ftr">${okEnter}${ICON.updown}</div>`;
    }
    this.lcd.innerHTML = html;
  }
}
customElements.define("midea-controller-card", MideaControllerCard);
window.customCards = window.customCards || [];
window.customCards.push({ type: "midea-controller-card", name: "Midea wired controller", description: "Midea M-thermal wired controller emulator" });
