/**
  * @file Helpers functions used to optimize the LL code in POSENC
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
 * LUT table used to detect if the LL code must be commented or not
 * Format is:
 * - a key of LL function
 * - for each key, define the list of arguments which link to reset values
 * {
 *  LL_PPP_Function1: ["ARG1"],         // LL_PPP_Function1(..., ARG1)
 *  LL_PPP_Function2: ["ARG1", "ARG2"], // LL_PPP_Function2(..., ARG1, ARG2)
 *  LL_PPP_Function3: [],               // LL_PPP_Function3(...)
 *  LL_PPP_Function4: [["ARG1_OPT1", "ARG1_OPT2"]]
 *      // LL_PPP_Function3 (..., ARG1_OPT1) or LL_PPP_Function3 (..., ARG1_OPT3)
 * }
 * This LUT table is based on IP version.
 */
/* LUT table defines for IP version V1 */
const LL_POSENC_POSENCv1 = {
  LL_POSENC_ConfigEncoder: ["LL_POSENC_STROBE_RESYNC_ENABLED", "LL_POSENC_ENCSEL_NO_PROTOCOL_SELECTED", "LL_POSENC_STROBE_TIM1_TRGO"],
  LL_POSENC_HD_SetEventDrivenFastPosition:       ["LL_POSENC_HD_EVTDRV_FASTPOSITION_DISABLED"],
  LL_POSENC_HD_SetEventDrivenSafePosition_1:     ["LL_POSENC_HD_EVTDRV_SAFE_POSITION_1_DISABLED"],
};

/* LUT table defines for IP version V2 */


/**
 * Get the LUT table to optimize the LL code
 * @param {string} ip_version IP version to select the correct LUT table
 * @returns LUT table based on the IP version
 */
function helper_posenc_get_lut_table(ip_version) {
  let selectedTable;
  selectedTable = LL_POSENC_POSENCv1;
  return selectedTable;
}

module.exports = {
  helper_posenc_get_lut_table,
};
