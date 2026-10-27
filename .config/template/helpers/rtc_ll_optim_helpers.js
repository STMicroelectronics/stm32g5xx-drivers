/**
  * @file Helpers functions used to optimize the LL code in RTC
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
 * Format is:
 * - a key of LL function
 * - for each key, define the list of arguments which link to reset values
 * {
 *  LL_RTC_Function1: ["ARG1"],         // LL_RTC_Function1(..., ARG1)
 *  LL_RTC_Function2: ["ARG1", "ARG2"], // LL_RTC_Function2(..., ARG1, ARG2)
 * }
 * This LUT table is based on IP version.
 */
const LL_RTC_Functions_V3 = {
  LL_RTC_SetPrescalers: ["128U - 1U", "256U - 1U"],
  LL_RTC_SetBinaryMode: ["LL_RTC_BINARY_NONE"],
  LL_RTC_SetAsynchPrescaler: ["128U - 1U"],
  LL_RTC_SetConfigBinaryMode: ["LL_RTC_BINARY_NONE", "LL_RTC_BINARY_MIX_BCDU_0"],
  LL_RTC_SetHourFormatAndShadowRegBypass: ["LL_RTC_HOUR_FORMAT_24HOUR", "LL_RTC_SHADOW_REG_KEEP"],
  LL_RTC_DATE_Config: ["LL_RTC_WEEKDAY_MONDAY", "0x1U", "LL_RTC_MONTH_JANUARY", "0x0U"],
  LL_RTC_TIME_Config: [["LL_RTC_TIME_FORMAT_AM_24H", "0U"], "0x0U", "0x0U", "0x0U"],
  LL_RTC_ALM_SetBinarySubSecond: [["LL_RTC_ALARM_A", "LL_RTC_ALARM_B"], "0U"],
  LL_RTC_ALM_SetSubSecondMask: [["LL_RTC_ALARM_A", "LL_RTC_ALARM_B"], "0U"],
  LL_RTC_ALMA_SetBinAutoClr: ["LL_RTC_ALMA_SUBSECONDBIN_AUTOCLR_NO"],
  LL_RTC_ALMB_SetBinAutoClr: ["LL_RTC_ALMA_SUBSECONDBIN_AUTOCLR_NO"],
  LL_RTC_ALM_SetBinAutoClr: [["LL_RTC_ALARM_A", "LL_RTC_ALARM_B"], "LL_RTC_ALMA_SUBSECONDBIN_AUTOCLR_NO"],
  LL_RTC_ALM_SetFlagAutoClr: [["LL_RTC_ALARM_A", "LL_RTC_ALARM_B"], "LL_RTC_ALM_AUTOCLR_NO"],
  LL_RTC_ALM_SetConfigDateTime: [["LL_RTC_ALARM_A", "LL_RTC_ALARM_B"], "LL_RTC_ALMA_MASK_NONE", "LL_RTC_ALMA_DATEWEEKDAYSEL_DATE", "0x1U", "LL_RTC_ALMA_TIME_FORMAT_AM_24H", "0x0U", "0x0U", "0x0U"],
  LL_RTC_ALM_SetConfigSubSecond: [["LL_RTC_ALARM_A", "LL_RTC_ALARM_B"], "0U", "0U"],
  LL_RTC_WAKEUP_SetClock: ["LL_RTC_WAKEUPCLOCK_DIV_16"],
  LL_RTC_WAKEUP_Config: ["0xFFFFU", "0U"],
  LL_RTC_TS_SetActiveEdge: ["LL_RTC_TIMESTAMP_EDGE_RISING"],
  LL_RTC_CAL_SetSmoothCalibration: ["LL_RTC_CALIB_PERIOD_32SEC", "LL_RTC_CALIB_INSERTPULSE_NONE", "0U"],
  LL_RTC_ConfigTampalarm: ["LL_RTC_OUTPUTPOLARITY_PIN_HIGH", "LL_RTC_ALARM_OUTPUTTYPE_PUSHPULL", "LL_RTC_ALARM_OUTPUT_PULLUP_NONE"],
};

/**
 * Get the LUT table to optimize the LL code.
 * @param {string} ip_version IP version to select the correct LUT table
 * @returns {object} LUT table based on the IP version
 */
function helper_rtc_get_lut_table(ip_version) {
  let selectedTable = LL_RTC_Functions_V3;
  return selectedTable;
}

module.exports = {
  helper_rtc_get_lut_table,
};