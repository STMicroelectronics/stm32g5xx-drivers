/**
  * @file CORTEX Debug Helper functions to provide service to the HAL components
  * @license
  * @attention
  *
  * Copyright (c) 2026 STMicroelectronics.
  * All rights reserved.
  *
  * This software is licensed under terms that can be found in the LICENSE file
  * in the root directory of this software component.
  * If no LICENSE file comes with this software, it is provided AS-IS.
  *
  */

/**
 * @brief Determine whether a given debug signal is used for the selected debug mode.
 *
 * @param {number} mode      Selected debug mode (see "basic.mode" enum, 0..13).
 * @param {string} signal    Debug signal id (e.g. "JTMS", "SWDIO", "TRACECLK", "TRACED5").
 *
 * @returns {boolean} true if the signal is used in the given mode, false otherwise.
 */
function helper_cortex_debug_is_signal_used(mode, signal) {
  try {
    /* Parallel synchronous trace width (in pins) for the given mode, 0 when no sync trace. */
    function traceWidth(m) {
      switch (m) {
        case 2:
        case 9:
          return 1;
        case 3:
        case 10:
          return 2;
        case 4:
        case 11:
          return 4;
        case 5:
        case 12:
          return 8;
        case 6:
        case 13:
          return 16;
        default:
          return 0;
      }
    }
    console.log("helper_cortex_debug_is_signal_used: mode=" + mode + ", signal=" + signal);

    const isJtag = (mode >= 0 && mode <= 6);
    const isSwd = (mode >= 7 && mode <= 13);
    const width = traceWidth(mode);

    /* JTAG data/clock/mode signals: used by every JTAG mode (0..6). */
    if (signal === "JTMS" || signal === "JTCK" || signal === "JTDI" || signal === "JTDO") {
      return isJtag;
    }
    /* JTAG reset: only the 5-pin JTAG mode. */
    if (signal === "NJTRST") {
      return (mode === 1);
    }
    /* Serial-wire signals: used by every serial-wire mode (7..13). */
    if (signal === "SWDIO" || signal === "SWCLK") {
      return isSwd;
    }
    /* Asynchronous single-wire trace output: only the SWO async mode. */
    if (signal === "TRACESWO") {
      return (mode === 7);
    }
    /* Synchronous trace clock: used whenever a parallel trace port is selected. */
    if (signal === "TRACECLK") {
      return (width > 0);
    }
    /* Synchronous trace data lanes: TRACEDn is used when the port width is wider than n. */
    if (signal.indexOf("TRACED") === 0) {
      const n = parseInt(signal.substring("TRACED".length), 10);
      if (isNaN(n)) {
        return false;
      }
      return (width > n);
    }
  } catch (e) {
    console.error(`Error in helper_cortex_debug_is_signal_used: ${e}`);
  }

  return false;
}

module.exports = {
  helper_cortex_debug_is_signal_used
};