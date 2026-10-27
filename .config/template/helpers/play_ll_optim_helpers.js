/**
  * @file Helpers functions used to optimize the LL code in PLAY
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
 *  LL_PLAY_Function1: ["ARG1"],         // LL_PLAY_Function1(..., ARG1)
 *  LL_PLAY_Function2: ["ARG1", "ARG2"], // LL_PLAY_Function2(..., ARG1, ARG2)
 *  LL_PLAY_Function3: [],               // LL_PLAY_Function3(...)
 *  LL_PLAY_Function4: [["ARG1_OPT1", "ARG1_OPT2"]]
 *      // LL_PLAY_Function3 (..., ARG1_OPT1) or LL_PLAY_Function3 (..., ARG1_OPT3)
 * }
 *
 * Matching rules:
 * - string values are matched exactly
 * - RegExp values are matched strictly against the whole argument value
 * - array values mean that one of the listed candidates is accepted for this argument
 * - arguments containing bitwise OR ('|') must be written explicitly in the LUT
 * - RegExp values must not be used to match only part of an argument or to infer
 * - bitwise OR combinations implicitly
 *
 * This LUT table is based on IP version.
 */
/* LUT table defines for IP version V1 */
const LL_PLAY_Functions_V1 = {
  LL_PLAY_INPUT_Config: [["LL_PLAY_IN0",
                          "LL_PLAY_IN1",
                          "LL_PLAY_IN2",
                          "LL_PLAY_IN3",
                          "LL_PLAY_IN4",
                          "LL_PLAY_IN5",
                          "LL_PLAY_IN6",
                          "LL_PLAY_IN7",
                          "LL_PLAY_IN8",
                          "LL_PLAY_IN9",
                          "LL_PLAY_IN10",
                          "LL_PLAY_IN11",
                          "LL_PLAY_IN12",
                          "LL_PLAY_IN13",
                          "LL_PLAY_IN14",
                          "LL_PLAY_IN15"], "0U", "LL_PLAY_EDGE_DETECTION_MODE_BYPASSED", "0U"],
  LL_PLAY_LUT_SetTruthTable: [["LL_PLAY_LUT0",
                               "LL_PLAY_LUT1",
                               "LL_PLAY_LUT2",
                               "LL_PLAY_LUT3",
                               "LL_PLAY_LUT4",
                               "LL_PLAY_LUT5",
                               "LL_PLAY_LUT6",
                               "LL_PLAY_LUT7",
                               "LL_PLAY_LUT8",
                               "LL_PLAY_LUT9",
                               "LL_PLAY_LUT10",
                               "LL_PLAY_LUT11",
                               "LL_PLAY_LUT12",
                               "LL_PLAY_LUT13",
                               "LL_PLAY_LUT14",
                               "LL_PLAY_LUT15"], "0x00"],
  LL_PLAY_LUT_ConfigInputs: [["LL_PLAY_LUT0",
                              "LL_PLAY_LUT1",
                              "LL_PLAY_LUT2",
                              "LL_PLAY_LUT3",
                              "LL_PLAY_LUT4",
                              "LL_PLAY_LUT5",
                              "LL_PLAY_LUT6",
                              "LL_PLAY_LUT7",
                              "LL_PLAY_LUT8",
                              "LL_PLAY_LUT9",
                              "LL_PLAY_LUT10",
                              "LL_PLAY_LUT11",
                              "LL_PLAY_LUT12",
                              "LL_PLAY_LUT13",
                              "LL_PLAY_LUT14",
                              "LL_PLAY_LUT15"], "LL_PLAY_LUT_SOURCE_SWTRIG15", "LL_PLAY_LUT_SOURCE_SWTRIG15", "LL_PLAY_LUT_SOURCE_SWTRIG15", "LL_PLAY_LUT_SOURCE_SWTRIG15", "LL_PLAY_LUT_CLK_GATE_OFF"],
  LL_PLAY_OUTPUT_SetSource: [["LL_PLAY_OUT0",
                              "LL_PLAY_OUT1",
                              "LL_PLAY_OUT2",
                              "LL_PLAY_OUT3",
                              "LL_PLAY_OUT4",
                              "LL_PLAY_OUT5",
                              "LL_PLAY_OUT6",
                              "LL_PLAY_OUT7",
                              "LL_PLAY_OUT8",
                              "LL_PLAY_OUT9",
                              "LL_PLAY_OUT10",
                              "LL_PLAY_OUT11",
                              "LL_PLAY_OUT12",
                              "LL_PLAY_OUT13",
                              "LL_PLAY_OUT14",
                              "LL_PLAY_OUT15"], "LL_PLAY_LUT0_OUT_DIRECT"],
};

/**
 * Get the LUT table to optimize the LL code
 * @param {string|number} ip_version IP version to select the correct LUT table
 * @note The IP version must start with the major version (e.g. "1.0", 1.5, 2.5)
 * @returns LUT table based on the IP version
 */
function helper_play_get_lut_table(ip_version) {
  const major_version = parseInt(ip_version, 10); // Get the major version (e.g. 1 from 1.0, 2 from 2.5)
  if (!Number.isInteger(major_version)) {
    return null;
  }
  const tables = {
    1: LL_PLAY_Functions_V1,
  };
  return tables[major_version] || null;
}

module.exports = {
  helper_play_get_lut_table,
};
