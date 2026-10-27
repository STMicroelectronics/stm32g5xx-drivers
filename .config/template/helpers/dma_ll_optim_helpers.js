/**
 * @file Helpers functions used to optimize the LL code in DMA
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

const LL_DMA_functionsDMA3 = {
  LL_DMA_SetDataTransferDirection: ["LL_DMA_DIRECTION_PERIPH_TO_MEMORY"],

  LL_DMA_SetChannelPriorityLevel:  ["LL_DMA_PRIORITY_LOW_WEIGHT_LOW"],

  LL_DMA_SetHWRequestMode:         ["LL_DMA_HARDWARE_REQUEST_BURST"],

  LL_DMA_ConfigDataHandling:       ["LL_DMA_DEST_DATA_TRUNC_LEFT_PADD_ZERO | LL_DMA_DEST_HALFWORD_PRESERVED | LL_DMA_DEST_BYTE_PRESERVED | LL_DMA_SRC_BYTE_PRESERVED | LL_DMA_DEST_DATA_PRESERVED"],

  LL_DMA_SetBlkDataLength:         ["0U"],

  LL_DMA_SetTransferEventMode:     ["LL_DMA_LINKEDLIST_XFER_EVENT_Q"],

  LL_DMA_ConfigControl:            ["LL_DMA_PRIORITY_LOW_WEIGHT_LOW | LL_DMA_LINK_ALLOCATED_PORT0 | LL_DMA_LINKEDLIST_EXECUTION_Q"],

  LL_DMA_ConfigAccessPorts:        ["LL_DMA_SRC_ALLOCATED_PORT0 | LL_DMA_DEST_ALLOCATED_PORT0"],

  LL_DMA_ConfigTransfer:           ["LL_DMA_SRC_ADDR_FIXED | LL_DMA_SRC_DATA_WIDTH_BYTE | LL_DMA_DEST_ADDR_FIXED | LL_DMA_DEST_DATA_WIDTH_BYTE"],

  LL_DMA_ConfigBurstLength:        ["1U", "1U"],

  LL_DMA_ConfigBlkRpt:                       ["1U", "LL_DMA_BLOCK_DEST_ADDR_INCREMENTED | LL_DMA_BLOCK_SRC_ADDR_INCREMENTED | LL_DMA_BURST_DEST_ADDR_INCREMENTED | LL_DMA_BURST_SRC_ADDR_INCREMENTED"],

  LL_DMA_ConfigAddrUpdateValue:              ["0U", "0U"],

  LL_DMA_ConfigBlkRptAddrUpdateValue:        ["0U", "0U"],

  LL_DMA_SetTransferEventMode:               ["LL_DMA_DIRECT_XFER_EVENT_BLOCK"],
};

/**
 * Get the LUT table to optimize the LL code
 * @param {string} ip_version IP version to select the correct LUT table
 * @returns LUT table based on the IP version
 */
function helper_dma_get_lut_table(ip_version) {
  const selectedTable = LL_DMA_functionsDMA3;
  return selectedTable;
}

module.exports = {
  helper_dma_get_lut_table,
};
