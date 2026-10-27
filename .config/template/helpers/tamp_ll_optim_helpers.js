/**
  * @file Helpers functions used to optimize the LL code in TAMP
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
 * LUT table used to detect if the LL code must be commented or not.
 */
const LL_TAMP_Functions_V3 = {
  LL_TAMP_SetConfig: ["LL_TAMP_PULL_UP_ENABLE", "LL_TAMP_DURATION_1RTCCLK", "LL_TAMP_FILTER_DISABLE", "LL_TAMP_SAMPLFREQDIV_32768"],
  LL_TAMP_ATAMP_SetConfig: ["LL_TAMP_ATAMP_FILTERING_DISABLE", "0U", "LL_TAMP_ATAMP_SHARING_DISABLE", "LL_TAMP_ATAMP_ASYNCPRES_RTCCLK"],
};

/**
 * Get the LUT table to optimize the LL code.
 * @param {string} ip_version IP version to select the correct LUT table
 * @returns {object} LUT table based on the IP version
 */
function helper_tamp_get_lut_table(ip_version) {
  let selectedTable = LL_TAMP_Functions_V3;
  return selectedTable;
}

module.exports = {
  helper_tamp_get_lut_table,
};