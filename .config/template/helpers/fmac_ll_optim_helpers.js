/**
  * @file Helpers functions used to optimize the LL code in FMAC
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

const LL_FMAC_Functions_V1 = {
  LL_FMAC_SetX1BaseAndSize: ["0", "0"],
  LL_FMAC_SetX2BaseAndSize: ["0", "0"],
  LL_FMAC_SetYBaseAndSize: ["0", "0"],
};

/**
 * Get the LUT table to optimize the LL code
 * @param {string} ip_version IP version to select the correct LUT table
 * @returns LUT table based on the IP version
 */
function helper_fmac_get_lut_table(ip_version) {
  let selectedTable;
  if (ip_version === "V1") {
  selectedTable = LL_FMAC_Functions_V1;
  }
  return selectedTable;
}

module.exports = {
  helper_fmac_get_lut_table,
};