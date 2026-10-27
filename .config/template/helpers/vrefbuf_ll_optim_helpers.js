/**
  * @file Helpers functions used to optimize the LL code in VREFBUF
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

const LL_VREFBUF_functionsV1 = {
  LL_VREFBUF_SetMode: ["LL_VREFBUF_MODE_PULL_DOWN"],
  LL_VREFBUF_SetVoltageScale: ["LL_VREFBUF_VOLTAGE_SCALE0"],
  LL_VREFBUF_SetTrimming: ["0"]
};

/**
 * Get the LUT table to optimize the LL code
 * @param {string} ip_version IP version to select the correct LUT table
 * @returns LUT table based on the IP version
 */
function helper_vrefbuf_get_lut_table(ip_version) {
  let selectedTable = LL_VREFBUF_functionsV1;
  return selectedTable;
}

module.exports = {
  helper_vrefbuf_get_lut_table,
};
