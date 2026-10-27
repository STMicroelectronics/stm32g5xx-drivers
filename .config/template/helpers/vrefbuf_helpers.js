/**
  * @file Helpers functions used for VREFBUF SW component
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
 * Returns the index of the given voltage scale value based on a predefined mapping.
 * This function maps specific voltage scale string values to their corresponding index.
 * If the value is not found in the mapping, it returns -1.
 *
 * @param {string} value - The voltage scale value to look up (e.g., "2_9V").
 * @returns {number} - The index corresponding to the value, or -1 if not found.
 */
function getVoltageScaleIndex(value) {
  const map = {
  "2_9V": 0,
  "2_5V": 1,
  "2_048V": 2,
  "1_8V": 3,
  };
  return map[value] !== undefined ? map[value] : -1;
}

module.exports = {
  getVoltageScaleIndex,
};
