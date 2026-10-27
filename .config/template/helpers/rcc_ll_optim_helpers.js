/**
 * @file Helpers functions used to optimize the LL code in RCC
 * @license
 * Copyright (c) 2026 STMicroelectronics.
 * All rights reserved.
 *
 * This software is licensed under terms that can be found in the LICENSE file
 * in the root directory of this software component.
 * If no LICENSE file comes with this software, it is provided AS-IS.
 */

const LL_RCC_functions = {
  LL_RCC_HSI_SetDivider: ["LL_RCC_HSI_DIV_1"],
  LL_RCC_LSE_SetDriveCapability: ["LL_RCC_LSEDRIVE_MEDIUMLOW"],


  LL_RCC_PLL1_SetQ: ["1U"],
  LL_RCC_PLL1_SetR: ["1U"],
  LL_RCC_PLL1_SetInputRange: ["LL_RCC_PLLINPUTRANGE_1_2"],
  LL_RCC_PLL1_SetVCORange: ["LL_RCC_PLLVCORANGE_128_560"],
  LL_RCC_PLL2_SetQ: ["0U"],
  LL_RCC_PLL2_SetR: ["0U"],
  LL_RCC_PLL2_SetInputRange: ["LL_RCC_PLLINPUTRANGE_1_2"],
  LL_RCC_PLL2_SetVCORange: ["LL_RCC_PLLVCORANGE_128_560"],

  LL_RCC_SetSysClkSource: ["LL_RCC_SYS_CLKSOURCE_HSI"],
  LL_RCC_SetSystickClockSource: ["LL_RCC_SYSTICK_CLKSOURCE_HCLKDIV8"],

  LL_RCC_SetADCPrescaler: ["LL_RCC_ADC_PRESCALER_1"],
  LL_RCC_ICLK_SetDivider: [["LL_RCC_ICLKK1", "LL_RCC_ICLKK2"], "LL_RCC_ICLK_DIV_5"],
  LL_RCC_SetPLAY1Divider: ["LL_RCC_PLAY1_DIVIDER_1"],

  LL_RCC_ConfigMCO: [["LL_RCC_MCO1SOURCE_HSI", "LL_RCC_MCO2SOURCE_SYSCLK"], ["LL_RCC_MCO1_PRESCALER_DIS", "LL_RCC_MCO2_PRESCALER_DIS"]],

  LL_RCC_SetUSARTClockSource: [["LL_RCC_USART1_CLKSOURCE_PCLK2", "LL_RCC_USART2_CLKSOURCE_PCLK1", "LL_RCC_USART3_CLKSOURCE_PCLK1"]],
  LL_RCC_SetUARTClockSource: ["LL_RCC_UART4_CLKSOURCE_PCLK1"],
  LL_RCC_SetLPUARTClockSource: ["LL_RCC_LPUART1_CLKSOURCE_PCLK3"],
  LL_RCC_SetDACClockSource: [["LL_RCC_DAC1_CLKSOURCE_BUS", "LL_RCC_DAC2_CLKSOURCE_BUS", "LL_RCC_DAC5_CLKSOURCE_BUS", "LL_RCC_DAC6_CLKSOURCE_BUS", "LL_RCC_DAC7_CLKSOURCE_BUS", "LL_RCC_DAC8_CLKSOURCE_BUS", "LL_RCC_DAC9_CLKSOURCE_BUS", "LL_RCC_DAC10_CLKSOURCE_BUS"]],
  LL_RCC_SetDACSHClockSource: [["LL_RCC_DAC1SH_CLKSOURCE_LSE", "LL_RCC_DAC2SH_CLKSOURCE_LSE"]],
  LL_RCC_SetSPIClockSource: [["LL_RCC_SPI1_CLKSOURCE_PCLK2", "LL_RCC_SPI2_CLKSOURCE_PCLK1", "LL_RCC_SPI3_CLKSOURCE_PCLK1"]],
  LL_RCC_SetPLAYClockSource: ["LL_RCC_PLAY1_CLKSOURCE_LSE"],
  LL_RCC_SetLPTIMClockSource: ["LL_RCC_LPTIM1_CLKSOURCE_PCLK3"],
  LL_RCC_SetXSPIClockSource: ["LL_RCC_XSPI1_CLKSOURCE_HCLK4"],
  LL_RCC_SetUCPDClockSource: ["LL_RCC_UCPD_CLKSOURCE_HSI"],
  LL_RCC_SetUSBClockSource: ["LL_RCC_USB_CLKSOURCE_HSI48"],
  LL_RCC_SetI3CClockSource: ["LL_RCC_I3C1_CLKSOURCE_PCLK1"],
  LL_RCC_SetI2CClockSource: [["LL_RCC_I2C1_CLKSOURCE_PCLK1", "LL_RCC_I2C2_CLKSOURCE_PCLK1", "LL_RCC_I2C3_CLKSOURCE_PCLK3", "LL_RCC_I2C4_CLKSOURCE_PCLK3"]],
  LL_RCC_SetADCClockSource: ["LL_RCC_ADC_CLKSOURCE_BUS"],
  LL_RCC_SetFDCANClockSource: ["LL_RCC_FDCAN_CLKSOURCE_HSE"],
  LL_RCC_SetPOSENCClockSource: [["LL_RCC_POSENC1_CLKSOURCE_PLL1P", "LL_RCC_POSENC2_CLKSOURCE_PLL1P"]],
  LL_RCC_SetRTCClockSource: ["LL_RCC_RTC_CLKSOURCE_NONE"],

};

/**
 * Get the LUT table to optimize the LL code
 * @returns LUT table based on the IP version
 */
function helper_rcc_get_lut_table() {
  let selectedTable = LL_RCC_functions;
  return selectedTable;
}

module.exports = {
  helper_rcc_get_lut_table,
};
