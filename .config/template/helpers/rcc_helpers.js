
/**
 * @file Helpers functions used for RCC SW component
 * @license
 * Copyright (c) 2026 STMicroelectronics.
 * All rights reserved.
 *
 * This software is licensed under terms that can be found in the LICENSE file
 * in the root directory of this software component.
 * If no LICENSE file comes with this software, it is provided AS-IS.
 */

/* Private constants -----------------------------------------------------------------------------------------------*/

/* Mapping between CUBE Mx Resource name and clock tree */
const map_splitted_ppp = {
  "ADC12.ADC1": "ADC1",
  "ADC12.ADC2": "ADC2",
  "COMP12.COMP1": "COMP1",
  "COMP12.COMP2": "COMP2",
  "COMP34.COMP3": "COMP3",
  "COMP34.COMP4": "COMP4",
  "COMP56.COMP5": "COMP5",
  "COMP56.COMP6": "COMP6",
  "COMP78.COMP7": "COMP7",
  "COMP78.COMP8": "COMP8",
  "IDAU/SAU": "IDAU_SAU",
  "RAMCFG.SRAM1": "RAMCFG",
  "RAMCFG.SRAM2": "RAMCFG",
  "RAMCFG.SRAM3": "RAMCFG",
  "USB_DRD_FS.DEVICE": "USB_DRD_FS",
  "USB_DRD_FS.HOST": "USB_DRD_FS",
};

const no_config_ppp = ['RCC', 'NVIC', 'MPU', 'ICACHE'];

/* Mapping between Clock tree json file and helper file */
const C5_IDS = {
  System_Clock_Source: "System_Clock_Source",
  HCLK: "AHB_Clock"
};

/* Map of the clock source - For kernel clock source generated code*/
const map_clock_source = {
  System: "SYSCLK",
  System_Clock_Source: "SYSCLK",
  System_Clock_Frequency: "SYSCLK",
  LSI_Divider_RTC: "LSI",
  HCLK_Frequency: "HCLK",
  AHB4_Peripheral_Clock: "HCLK4",
  APB1_Peripheral_Clock: "PCLK1",
  PCLK1_Input_Clock: "PCLK1",
  APB2_Peripheral_Clock: "PCLK2",
  PCLK2_Input_Clock: "PCLK2",
  APB3_Peripheral_Clock: "PCLK3",
  PCLK3_Input_Clock: "PCLK3",
  APB1_divider: "PCLK1",
  APB2_divider: "PCLK2",
  APB3_divider: "PCLK3",
  AUDIO_Source: "AUDIOCLK",
  HSE_Divider_RTC: "HSE_DIV",
  HSEDIV: "HSE_DIV",
  RCC_TIM: "TIM",
  RCC_HRTIM: "HRTIM",
  ADC_DIV:"ADC",
  ICLK1DIV: "ICLK1",
  ICLK2DIV: "ICLK2",
  HSIDIV: "HSI",
  HRTPRE: "HRTIM",
  HPRE: "TIM",
  ADCDIV: "ADC",
  HCLK4_Input_Clock: "HCLK4"
};

const map_divider_source = {
  ICLK1DIV: "PLL1R",
  ICLK1: "PLL1R",
  ICLK2DIV: "PLL2R",
  ICLK2: "PLL2R",
  ADCDIV:'ADC_Clock_Source',
  ADC:'ADC_Clock_Source',
  PLAYDIV:'PLAYSEL_Clock_Source',
  HSIDIV:'HSI',
  HSE_DIV:'HSE'
}

/* Map of the resources kernel clock : used for the kernel clock source selection */
const map_kernel_clock = {
  ADC1:   "ADC",
  ADC2:   "ADC",
  ADC3:   "ADC",
  FDCAN1: "FDCAN",
  FDCAN2: "FDCAN",
  FDCAN3: "FDCAN",
  TAMP: "RTC",
  USB_DRD_FS: "USB",
};

/* Map of the hw resource name: used for bus clock enable / disable */
const map_hw_resource_name = {
  ADC1: "ADC12",
  ADC2: "ADC12",
  FDCAN1: "FDCAN",
  FDCAN2: "FDCAN",
  FDCAN3: "FDCAN",
  RAMCFG_SRAM1: "RAMCFG",
  RAMCFG_SRAM2: "RAMCFG",
  RAMCFG_SRAM3: "RAMCFG",
  RTC: "RTCAPB",
  TAMP: "RTCAPB",
  USB_DRD_FS: "USB"
};

/* Map of the hw resource name that have an inbependant Kernel Clock name */
const map_hw_kernel_resource_name = {

};

/* Map of the sw resource name (used in ll kernel clock source) */
const map_sw_resource_name = {
  RNG: "CK48",
  TAMP: "RTC"
};

/* Map of the resources (peripherals) name - To build the configuration path, form PPP to clock source */
const map_resources_name_for_configuration = {
  ADC1: "ADCDIV",
  ADC2: "ADCDIV",
  ADC3: "ADCDIV",
  FDCAN1: "FDCAN_Clock_Source",
  FDCAN2: "FDCAN_Clock_Source",
  FDCAN3: "FDCAN_Clock_Source",
  POSENC1: "POSEN1SRC",
  HRTIM: "HRTPRE",
  PLAY1: 'PLAYDIV',
  RNG: "HSI48",
  CRS: "HSI48",
  CCB: "HSI48",
  TAMP: "RTC_Clock_Source",
  USB_DRD_FS: "USB_Clock_Source",
};

/* Map of the resources (peripherals) name - to get the kernel clock source */
const map_resources_name_for_kernel_source = {
  ADC1: "ADC",
  ADC2: "ADC",
  ADC3: "ADC",
  FDCAN1: "FDCAN",
  FDCAN2: "FDCAN",
  FDCAN3: "FDCAN",
  TAMP: "RTC",
  PLAY1: 'PLAYSEL',
  USB_DRD_FS: "USB",
};

/* List of the external clock source */
const external_clock_source = [
  "HSE",
  "LSE"
];

/* List of the resources that does not include an enable bit */
/* This bit could be present in some product */
const resource_wo_enable = [
  'PWR',
];

/* List of the resources that does not include a reset bit */
/* This bit could be present in some product */
const resource_wo_reset = [
  'DCACHE',
  'FLASH',
  'RTCAPB',
  'SBS',
  'SRAM1',
  'SRAM2',
  'SRAM3',
  'TZSC1',
  'VREFBUF',
  'WWDG',
];



/* List of the resources that does not include an enable switch */
const resource_wo_kernel_enable = [
'AES',
'CCB',
'COMP1',
'COMP2',
'COMP3',
'COMP4',
'COMP5',
'COMP6',
'COMP7',
'COMP8',
'CORDIC1',
'CRC',
'CRS',
'DCACHE',
'DTS',
'EXTI',
'FLASH',
'FMAC1',
'FMAC2',
'GPIOA',
'GPIOB',
'GPIOC',
'GPIOD',
'GPIOE',
'GPIOF',
'GPIOG',
'GPIOH',
'GPDMA1',
'GPDMA2',
'GTZC1_MPCBB1',
'GTZC1_MPCBB2',
'GTZC1_MPCBB3',
'GTZC1_TZIC',
'GTZC1_TZSC',
'GTZC1_TZSC_MPCWM1',
'ICACHE',
'IDAU/SAU',
'HASH',
'HRTIM1',
'IWDG',
'MPU',
'NVIC',
'OPAMP1',
'OPAMP2',
'OPAMP3',
'OTFDEC1',
'PKA',
'PWR',
'RAMCFG',
'RAMCFG_SRAM1',
'RAMCFG_SRAM2',
'RAMCFG_SRAM3',
'RCC',
'SAES',
'SBS',
'SCB',
'SRAM1',
'SRAM2',
'SRAM3',
'SYSTICK',
'TIM1',
'TIM2',
'TIM3',
'TIM4',
'TIM5',
'TIM6',
'TIM7',
'TIM8',
'TIM9',
'TIM10',
'TIM11',
'TIM12',
'TIM13',
'TIM14',
'TIM15',
'TIM16',
'TIM17',
'TIM20',
'TIM26',
'TIM27',
'VREFBUF',
'WWDG',
];

/* List of the resources that share its clock enable / reset bit with another resource */
const resource_sharing_enable_bit = [
  ['ADC1', 'ADC2'],
  ['FDCAN1', 'FDCAN2', 'FDCAN3'],
  ['RAMCFG_SRAM1', 'RAMCFG_SRAM2', 'RAMCFG_SRAM3'],
  ['RNG', 'SAES'],
  ['RNG', 'PKA'],
  ['RTC', 'TAMP'],
  ['ETH1', 'SBS']
];

/* List of resources that cannot be instantiated */
const not_instantiable_peripheral_resources = [
  'RTC',
  'TAMP'
];

/* List of DACs */
const dac_resources = [
  'DAC1',
  'DAC2',
  'DAC3',
  'DAC4',
  'DAC5',
  'DAC6',
  'DAC7',
  'DAC8',
  'DAC9',
  'DAC10'
];

const available_oscillators = [
  'HSE',
  'HSI',
  'HSI48',
  'LSE',
  'LSI',
];

const available_sys_clk_src = {
    HSI: "HSI",
    HSIDIV: "HSI",
    HSE: "HSE",
    PLL1: "PLLCLK",
    PLL1P: "PLLCLK"
  };

const available_systick_src = {
  LSE: "LSE",
  LSI: "LSI",
  Cortex_Divider: "HCLKDIV8",
};

const default_systick_src = "HCLKDIV8";

const map_mco_src = {
  'System_Clock_Source': 'SYSCLK',
  'System_Clock_Frequency': 'SYSCLK',
  'HSIDIV': 'HSI'
};

// Peripheral to Group mapping
const peripheralBusMapping = {
  CORDIC1:        "AHB1_GRP1",
  CRC:            "AHB1_GRP1",
  DCACHE:         "AHB1_GRP1",
  FLASH:          "AHB1_GRP1",
  FMAC1:          "AHB1_GRP1",
  GPDMA1:         "AHB1_GRP1",
  GPDMA2:         "AHB1_GRP1",
  RAMCFG:         "AHB1_GRP1",
  RAMCFG_SRAM1:   "AHB1_GRP1",
  RAMCFG_SRAM2:   "AHB1_GRP1",
  RAMCFG_SRAM3:   "AHB1_GRP1",
  SRAM1:          "AHB1_GRP1",
  SRAM2:          "AHB1_GRP1",
  SRAM3:          "AHB1_GRP1",
  TZSC1:          "AHB1_GRP1",

  ADC1:           "AHB2_GRP1",
  ADC2:           "AHB2_GRP1",
  ADC3:           "AHB2_GRP1",
  ADC12:          "AHB2_GRP1",
  DAC1:           "AHB2_GRP1",
  DAC2:           "AHB2_GRP1",
  DAC5:           "AHB2_GRP1",
  DAC6:           "AHB2_GRP1",
  DAC7:           "AHB2_GRP1",
  DAC8:           "AHB2_GRP1",
  DAC9:           "AHB2_GRP1",
  DAC10:          "AHB2_GRP1",
  FMAC2:          "AHB2_GRP1",

  DBGCK:          "AHB3_GRP1",

  AES:            "AHB4_GRP1",
  CCB:            "AHB4_GRP1",
  GPIOA:          "AHB4_GRP1",
  GPIOB:          "AHB4_GRP1",
  GPIOC:          "AHB4_GRP1",
  GPIOD:          "AHB4_GRP1",
  GPIOE:          "AHB4_GRP1",
  GPIOF:          "AHB4_GRP1",
  GPIOG:          "AHB4_GRP1",
  GPIOH:          "AHB4_GRP1",
  HASH:           "AHB4_GRP1",
  OTFDEC1:        "AHB4_GRP1",
  PKA:            "AHB4_GRP1",
  RNG:            "AHB4_GRP1",
  SAES:           "AHB4_GRP1",
  XSPI1:          "AHB4_GRP1",

  CRS:            "APB1_GRP1",
  I2C1:           "APB1_GRP1",
  I2C2:           "APB1_GRP1",
  I3C1:           "APB1_GRP1",
  SPI2:           "APB1_GRP1",
  SPI3:           "APB1_GRP1",
  TIM2:           "APB1_GRP1",
  TIM3:           "APB1_GRP1",
  TIM6:           "APB1_GRP1",
  TIM7:           "APB1_GRP1",
  TIM9:           "APB1_GRP1",
  TIM10:          "APB1_GRP1",
  TIM11:          "APB1_GRP1",
  TIM12:          "APB1_GRP1",
  TIM13:          "APB1_GRP1",
  TIM14:          "APB1_GRP1",
  UART4:          "APB1_GRP1",
  UART5:          "APB1_GRP1",
  UART6:          "APB1_GRP1",
  USART2:         "APB1_GRP1",
  USART3:         "APB1_GRP1",
  WWDG:           "APB1_GRP1",

  DTS:            "APB1_GRP2",
  FDCAN:          "APB1_GRP2",
  UCPD1:          "APB1_GRP2",

  HRTIM1:         "APB2_GRP1",
  PLAY1:          "APB2_GRP1",
  PLAY1APB:       "APB2_GRP1",
  SPI1:           "APB2_GRP1",
  TIM1:           "APB2_GRP1",
  TIM4:           "APB2_GRP1",
  TIM5:           "APB2_GRP1",
  TIM8:           "APB2_GRP1",
  TIM15:          "APB2_GRP1",
  TIM16:          "APB2_GRP1",
  TIM17:          "APB2_GRP1",
  USART1:         "APB2_GRP1",
  USB:            "APB2_GRP1",

  COMP1:          "APB3_GRP1",
  COMP2:          "APB3_GRP1",
  COMP3:          "APB3_GRP1",
  COMP4:          "APB3_GRP1",
  COMP5:          "APB3_GRP1",
  COMP6:          "APB3_GRP1",
  COMP7:          "APB3_GRP1",
  COMP8:          "APB3_GRP1",
  I2C3:           "APB3_GRP1",
  I2C4:           "APB3_GRP1",
  LPTIM1:         "APB3_GRP1",
  LPUART1:        "APB3_GRP1",
  OPAMP1:         "APB3_GRP1",
  OPAMP2:         "APB3_GRP1",
  OPAMP3:         "APB3_GRP1",
  POSENC1:        "APB3_GRP1",
  POSENC2:        "APB3_GRP1",
  RTC:            "APB3_GRP1",
  RTCAPB:         "APB3_GRP1",
  SBS:            "APB3_GRP1",
  TAMP:           "APB3_GRP1",
  TIM20:          "APB3_GRP1",
  TIM26:          "APB3_GRP1",
  TIM27:          "APB3_GRP1",
  VREF:           "APB3_GRP1",
  VREFBUF:        "APB3_GRP1",
};

// Group to Clock mapping
const groupClockMapping = {
  AHB1_GRP1: "AHB1",
  AHB2_GRP1: "AHB2",
  AHB3_GRP1: "AHB3",
  AHB4_GRP1: "AHB4",
  APB1_GRP1: "APB1",
  APB1_GRP2: "APB1",
  APB2_GRP1: "APB2",
  APB3_GRP1: "APB3"
};

/* Definition of the clock configuration strategy */
const rcc_config_codes = {
  CENTRAL: 0,
  CONTROLLED_BY_PERIPHERALS: 1,
  CONTROLLED_BY_USER: 2
};

/* Definition of the main config default values */
const rcc_ctx_defaults = {
  info: {
    labels: [
    ],
    layer: "HAL",
    init_type: "called",
  },
  basic: {
    periph_clocks_init: 0,
    voltage_scaling: "VOLT_SCALE_2",
    flash_latency: 0,
    flash_programming_delay: 0,
    hse: {
      state: "OFF",
      enable_css: false,
      startup_time: 100,
    },
    lse: {
      state: "OFF",
      drive_capability: "MEDIUM_LOW",
      enable_css: false,
      startup_time: 5000,
    },
  },
  additional: {
    hsi: {
      enable_in_stop_mode: false,
    },
    clk_outputs: {
      mco1: false,
      mco2: false,
    },
    audio_clock: {
      enable: false,
    },
  },
  system: {
    gpio: {
    },
    nvic: {
    },
    exti: {
    },
  },
};


/* Private Global variables -----------------------------------------------------------------------------------------------*/
let g_rcc_api = null;                     /* The list of global APIs */
let g_core_ctx = null;                    /* Object containing the core context */
let g_rcc_ctx = null;                     /* Object containing the rcc json parameter user confguration */
let g_rcc_clock_tree_config = null;       /* Object containing the rcc clock tree user configuration */
let g_rcc_all_resources = null;           /* Object containing the rcc bound resources */
let g_all_perifs_clock_config = null;     /* Object containing the rcc bound resources clock configurations */
let g_rcc_used_osc = null;                /* Array containing the used oscillators */

const g_rcc_resource_state = {};            /* Object containing the resources that are enabled (clocks, pll, config)*/


/* Private function ------------------------------------------------------------------------------------------------*/

/**
 * Retrieve the clock information of the selected resource and add it in the all_periphs_config_object
 * This function retrieves the entire PPP configuration, from this PPP to clock source.
 * It thus get clock sources, dividers, PLL configurations
 * @param {string} resource_name HW resource name (ex: ADC1)
 * @param {object} all_periphs_config_object Current result of the clock configuration
 * @returns {object} Return an updated of the object current_ctx
 * ex {
 * "HCLK": {
 *    "resources": [
 *       "ADC1",
 *       "ADC4",
 *       "DAC1",
 *       "MDF1"
 *    ],
 *    "frequency": 160000000,
 *    "is_external": false
 * },
 * "PLL1": {
 *    "resources": [
 *       "FDCAN1"
 *    ],
 *    "Q": {
 *       "resources": [
 *          "FDCAN1"
 *       ],
 *       "is_external": true
 *    },
 *    "is_external": true
 * },
 * "PCLK1": {
 *    "resources": [
 *       "I2C1",
 *       "LPTIM2",
 *       "USART3"
 *    ],
 *    "frequency": 160000000,
 *    "is_external": true
 * },
 *}
 */
function rcc_get_pppi_configurations(
  resource_name,
  all_periphs_config_object
) {
  let result = all_periphs_config_object;
  if (result == null) {
    result = {};
  }

  try {
    console.info(`rcc_get_pppi_configurations: resource=${resource_name}`);

    /* Some resources, depending on their configuration, could not need clock source configuration */
    if (helper_rcc_is_clock_config_needed(resource_name)) {

      /* Build the configuration path of the resource */
      let current_resource = resource_name;
      let clock_source_id;
      if (map_resources_name_for_configuration.hasOwnProperty(resource_name)) {
        clock_source_id = map_resources_name_for_configuration[resource_name];
      }
      else{
        clock_source_id = resource_name + '_Clock_Source';
      }

      let done = false;
      let loop_counter = 0;

      while (!done)
      {
        /* Is it a PLL ? */
        const pll_output_found = clock_source_id.match(/(PLL\d)([A-Z])/);
        if (pll_output_found){
          const pll_output_name = pll_output_found[0];
          const pll_name = pll_output_found[1];
          let clock_fy

          /* PLL output */
          if (pll_output_name != current_resource){
            clock_fy = g_rcc_api.clockAPI.getClockFrequency(clock_source_id);
            rcc_add_resource_clock_source(result, pll_output_name, clock_fy, current_resource);
          }

          /* PLL input */
          let clock_object = g_rcc_api.clockAPI.getClockInformationById(pll_name+'_Clock_Source');
          clock_fy = g_rcc_api.clockAPI.getClockFrequency(pll_name+'N');
          rcc_add_resource_clock_source(result, pll_name, clock_fy, pll_output_name);

          clock_source_id = helper_rcc_remap_clock_source(clock_object.value);
          current_resource = pll_name;
        }
        else
        {
          let clock_object = g_rcc_api.clockAPI.getClockInformationById(clock_source_id);
          if(clock_object)
          {
            if (clock_object.type == 'multiplexor')
            {
              clock_source_id = helper_rcc_remap_clock_source(clock_object.value);

              rcc_add_resource_clock_source(result, clock_source_id, clock_object.frequency, current_resource);
              current_resource = clock_source_id;

              /* remap divider source id if needed */
              if (map_divider_source.hasOwnProperty(clock_source_id)) {
                clock_source_id = map_divider_source[clock_source_id];
              }
            }
            else if (clock_object.type == 'divider')
            {
              rcc_add_resource_clock_source(result, clock_source_id, clock_object.frequency, current_resource);
              current_resource = clock_source_id;
              if (map_divider_source.hasOwnProperty(clock_source_id))
              {
                clock_source_id = map_divider_source[clock_source_id];
              }
              else
              {
                done = true;
                console.info(`rcc_get_pppi_configurations: resource=${resource_name}. DONE`);
              }
            }
            else if (clock_source_id != current_resource)
            {
              rcc_add_resource_clock_source(result, clock_source_id, clock_object.frequency, current_resource);
              done = true;
              console.info(`rcc_get_pppi_configurations: resource=${resource_name}. DONE`);
            }
            else
            {
              done = true;
              console.info(`rcc_get_pppi_configurations: resource=${resource_name}. DONE: Exit 0`);
            }
          }
          else
          {
            /* PPP not present on clock tree - RCC, ICACHE... */
            done = true;
            console.info(`rcc_get_pppi_configurations: resource=${resource_name}. DONE: Exit 1`);

          }
        }

        /* Prevent infinite loops */
        loop_counter++;
        if (loop_counter>10)
        {
          done = true;
          console.info(`rcc_get_pppi_configurations: resource=${resource_name}. DONE: Exit 2`);
        }
      }

      /* For some resources, additional clock sources need to be added */
      if (helper_rcc_is_dac_extra_config_needed(resource_name)){
        clock_source_id = helper_rcc_get_dac_sh_clock(resource_name);
        let clock_object = g_rcc_api.clockAPI.getClockInformationById(clock_source_id);
        rcc_add_resource_clock_source(result, clock_source_id, clock_object.frequency, resource_name+'SH');
      }
      else if (helper_rcc_is_crs_extra_config_needed(resource_name)){
        let clock_object = g_rcc_api.clockAPI.getClockInformationById('LSE');
        rcc_add_resource_clock_source(result, 'LSE', clock_object.frequency, resource_name);
      }
      else if (helper_rcc_is_crypto_extra_config_needed(resource_name) || (resource_name == 'RNG')) {
        /* Try to get the HSI48 frequency (only available on G55x and G56x devices) */
        let hsi48_freq
        try {
          hsi48_freq = g_rcc_api.clockAPI.getClockFrequency("HSI48");
        }
        catch (error) {
        }
        if (hsi48_freq && hsi48_freq > 0) {
          let clock_object = g_rcc_api.clockAPI.getClockInformationById('HSI48');
          rcc_add_resource_clock_source(result, 'HSI48', clock_object.frequency, resource_name);
        }
        else {
          let clock_object = g_rcc_api.clockAPI.getClockInformationById('HSI_DIV2');
          rcc_add_resource_clock_source(result, 'HSI_DIV2', clock_object.frequency, resource_name);

          clock_object = g_rcc_api.clockAPI.getClockInformationById('HSI');
          rcc_add_resource_clock_source(result, 'HSI', clock_object.frequency, 'HSI_DIV2');
        }
      }
    }
  } catch (error) {
    console.error(`rcc_get_pppi_configurations: ${error}`);
  }
  return result;
}

/**
 * Add a resource clock source in the result object
 * @param {object} result Current result object
 * @param {string} source_name Clock source name
 * @param {number} source_frequency Clock source frequency
 * @param {string} resource_name HW resource name (ex: ADC1)
 * @returns None
 */
function rcc_add_resource_clock_source(result, source_name, source_frequency, resource_name){

  console.info(`rcc_add_resource_clock_source: resource=${resource_name}. New node: ${source_name}`);
  /* Create the Source Name */
  if (!result.hasOwnProperty(source_name)) {
    result[source_name] = { resources: [] };
  }
  /* Populate resource informations if not already done */
  if (result[source_name]["resources"].indexOf(resource_name) < 0) {
    result[source_name]["resources"].push(resource_name);
    result[source_name]["frequency"] = Number(source_frequency);
    if (external_clock_source.includes(source_name)) {
      result[source_name]["is_external"] = true;
    }
    else
    {
      result[source_name]["is_external"] = false;
    }
  }
}

/**
 * Retrieve the system clock source properties
 * @returns {object} Returns "ok", the execution status (true/false) and "object" containing the system clock properties
 * ex:
 * {
 *   ok: true,
 *   object:{
 *     HSI: true,
 *     HSE: false,
 *     PLLCLK: false,
 *     name:"HSI",
 *     frequency: 64000000
 *    }
 * }
 */
function rcc_find_system_clock_src() {
  let ok = false;
  let object = {
    HSI: false,
    HSE: false,
    PLLCLK: false,
    name:"HSI",
    nameLL:"HSI",
    pll_name:"",
    frequency: 64000000
  }

  try {
    let clock_source_object = g_rcc_api.clockAPI.getClockInformationById('System_Clock_Source');
    let clock_source_name = clock_source_object.value;

    if (available_sys_clk_src.hasOwnProperty(clock_source_name)) {
      ok = true;
      let remapped_name = available_sys_clk_src[clock_source_name];
      object.name = remapped_name;
      object.nameLL = remapped_name;
      if (remapped_name == "PLLCLK") {
        object.pll_name = 'PLL1';
        object.nameLL = 'PLL1';
      }
      object[remapped_name] = true;
      object.frequency = parseInt(clock_source_object.frequency, 10);
    } else {
      console.error(`helper_rcc rcc_find_system_clock_src: ${clock_source_name} not part of the available_sys_clk_src - using default`);
    }
  } catch  (error) {
    console.error(`[ERROR] rcc_find_system_clock_src: ${error}`);
  }

  return {ok, object};
}

/**
 * Retrieve the system prescalers
 * @returns {object} Returns "ok", the execution status (true/false) and "object" containing the prescalers
 * ex:
 * {
 *   ok: true,
 *   object:{
 *     ahb: 1,
 *     apb1: 2,
 *     apb2: 4,
 *     apb3: 8
 *    }
 * }
 */
function rcc_find_system_prescaler() {
  let ok = false;
  let object = {
    ahb: 1,
    apb1: 1,
    apb2: 1,
    apb3: 1,
  }

  try {
    object.ahb = g_rcc_api.clockAPI.getClockInformationById('HPRE').value;
    object.apb1 = g_rcc_api.clockAPI.getClockInformationById('APB1_Clock_Divider').value;
    object.apb2 = g_rcc_api.clockAPI.getClockInformationById('APB2_Clock_Divider').value;
    object.apb3 = g_rcc_api.clockAPI.getClockInformationById('APB3_Clock_Divider').value;
    ok = true;
  }
  catch  (error) {
    console.error(`[ERROR] rcc_find_system_prescaler: ${error}`);
  }
  return {ok, object};
}

/**
 * Retrieve the clock dividers
 * @returns {object} Returns "ok", the execution status (true/false) and "object" containing the prescalers
 * ex:
 * {
 *   ok: true,
 *   object:{
 *    hsi: '2',
 *    iclk1: '3',
 *   iclk2: '5',
 *    adc: '16',
 *    play: '1'
 *   }
 * }
 */
function rcc_find_clock_divider(){
  let ok = false;
  let object = {
    hsi: '1',
    iclk1: '3',
    iclk2: '3',
    adc: '1',
    play: '1',
    hse: '2',
  }

  try {
    object.hsi = g_rcc_api.clockAPI.getClockInformationById('HSIDIV')?.value || '1';
    object.iclk1 = g_rcc_api.clockAPI.getClockInformationById('ICLK1DIV')?.value || '3';
    object.iclk2 = g_rcc_api.clockAPI.getClockInformationById('ICLK2DIV')?.value || '3';
    object.adc = g_rcc_api.clockAPI.getClockInformationById('ADCDIV')?.value || '1';
    object.play = g_rcc_api.clockAPI.getClockInformationById('PLAYDIV')?.value || '1';
    object.hse = g_rcc_api.clockAPI.getClockInformationById('HSEDIV')?.value || '2';

    ok = true;
  }
  catch  (error) {
    console.error(`[ERROR] rcc_find_clock_divider: ${error}`);
  }

  return {ok, object};
}

/**
 * Retrieve the systick clock source
 * @returns {object} Returns "ok", the execution status (true/false) and "object" containing the prescalers
 * ex:
 * {
 *   ok: true,
 *   object:{
 *     ahb: 1,
 *     apb1: 2,
 *     apb2: 4,
 *     apb3: 8
 *    }
 * }
 */
function rcc_find_systick_clock_src() {
  let ok = false;
  let object = {
    HCLKDIV8: false,
    LSE: false,
    LSI: false,
    name:"HCLKDIV8",
    is_default: false
  }

  try {
    let clock_source_object = g_rcc_api.clockAPI.getClockInformationById('SYSTICKSEL');
    let clock_source_name = clock_source_object.value;

    if (available_systick_src.hasOwnProperty(clock_source_name)) {
      ok = true;
      let remapped_name = available_systick_src[clock_source_name];
      object.name = remapped_name;
      object[remapped_name] = true;
      //if (remapped_name == default_systick_src)
      //  object.is_default = true;
    } else {
      console.error(`helper_rcc rcc_find_systick_clock_src: ${clock_source_name} not part of the available_systick_src - using default`);
    }
  } catch  (error) {
    console.error(`[ERROR] rcc_find_systick_clock_src: ${error}`);
  }

  return {ok, object};
}

/**
 * Retrieve the clock outputs configuration
 * @param {object} rcc_ctx The RCC context (user input configuration)
 * @returns {object} Returns "ok", the execution status (true/false) and "object" containing the clock outputs configuration
 * ex:
 * {
 *   ok: true,
 *   object:{
 *    mco1: {src: 'SYSCLK', div: 1, used : false},
 *    mco2: {src: 'SYSCLK', div: 1, used : false},
 *  }
 * }
 */
function rcc_find_clk_outputs_config(rcc_ctx) {
  let ok = false;
  let object = {
    mco1: {src: 'HSI', div: 1, used : false},
    mco2: {src: 'SYSCLK', div: 1, used : false},
  }

  try {
    if (rcc_ctx?.additional.clk_outputs.mco1) {
      let src = g_rcc_api.clockAPI.getClockInformationById('MCO1_Clock_Source').value;
      if (map_mco_src.hasOwnProperty(src)) {
        src = map_mco_src[src];
      }
      object.mco1.src = src;
      object.mco1.div = g_rcc_api.clockAPI.getClockInformationById('MCO1_div_Clock').value;
      object.mco1.used = true;
    }

    if (rcc_ctx?.additional.clk_outputs.mco2) {
      src = g_rcc_api.clockAPI.getClockInformationById('MCO2_Clock_Source').value;
      if (map_mco_src.hasOwnProperty(src)) {
        src = map_mco_src[src];
      }
      object.mco2.src = src;
      object.mco2.div = g_rcc_api.clockAPI.getClockInformationById('MCO2_div_Clock').value;
      object.mco2.used = true;
    }

    ok = true;
  }
  catch  (error) {
    console.error(`[ERROR] rcc_find_clk_outputs_config: ${error}`);
  }
  return {ok, object};
}

/**
 * Retrieve the configuration of the PLLx (x = 1, 2 or 3)
 * @param {integer} pll_id PLL id value ("", 2 or 3) => for PLL1 id is empty
 * @returns Object => {
 *    "PLLFRACN": "",
 *    "PLLSource": "HAL_RCC_PLL_SRC_MSIS",
 *    "MSIS": true,
 *    "PLL1N": 129,
 *    "PLL1M": 1,
 *    "PLL1P": 2,
 *    "PLL1Q": 2,
 *    "PLL1R": 2
 *}
 */
function rcc_find_pll_config(pll_name) {

  let ok = false;
  let object = {
    src: 'HSI',
    m: 1,
    n: 1,
    p: 1,
    q: 1,
    r: 1,
    fracn: 1,
    input_range: "1_2",
    vco_range: "128_560",
    ref_freq: 0,
    vco_freq: 0
  }

  const map_pll_clk_src = {
    HSE: "HSE",
    HSI: "HSI",
    HSIDIV: "HSI",
  };

  try {
    let src = g_rcc_api.clockAPI.getClockInformationById(pll_name + '_Clock_Source').value;
    if (map_pll_clk_src.hasOwnProperty(src)) {
      src = map_pll_clk_src[src];
    }
    object.src = src;

    object.m = g_rcc_api.clockAPI.getClockInformationById(pll_name + 'M').value;
    object.n = g_rcc_api.clockAPI.getClockInformationById(pll_name + 'N').value;
    object.p = g_rcc_api.clockAPI.getClockInformationById(pll_name + 'P').value;
    object.q = g_rcc_api.clockAPI.getClockInformationById(pll_name + 'Q').value;
    object.r = g_rcc_api.clockAPI.getClockInformationById(pll_name + 'R').value;
    object.fracn = g_rcc_api.clockAPI.getClockInformationById(pll_name + 'FRACN').value;

    /* For the moment, Compute the inoput and vco ranges */
    const ref_clk = g_rcc_api.clockAPI.getClockInformationById(src).frequency / object.m;
    const vco = ref_clk * (object.n + (object.fracn / 0x2000));
    if (ref_clk < 2000000)
    {
      object.input_range = '1_2';
    }
    else if (ref_clk < 4000000)
    {
      object.input_range = '2_4';
    }
    else if (ref_clk < 8000000)
    {
      object.input_range = '4_8';
    }
    else
    {
      object.input_range = '8_16';
    }

    if ((vco > 420000000) || (vco < 128000000))
    {
      /* Select PLL wide VCO range */
       object.vco_range = '128_560';
    }
    else
    {
      /* Select PLL medium VCO range */
       object.vco_range = '150_420';
    }
    object.ref_freq = ref_clk;
    object.vco_freq = vco;

    ok = true;
  }
  catch  (error) {
    console.error(`[ERROR] rcc_find_pll_config: ${error}`);
  }
  return {ok, object};
}

/**
 * This function checks if the user selected flash latency is possible.
 * If no, it returns the optimal flash latency for current frequency
 * @param {*} system_clock_frequency the system clock frequency
 * @param {*} selected_latency the selected flash latency
 * @param {*} voltage_scaling the selected voltage scaling
 * @return {*} the adjusted flash latency
 */
function rcc_adjust_flash_latency(system_clock_frequency, selected_latency, voltage_scaling)
{
  let latency = selected_latency ? selected_latency : 0;
  const optimal_latency = helper_rcc_get_optimal_latency(system_clock_frequency, voltage_scaling);
  if (latency < optimal_latency)
  {
    latency = optimal_latency;
  }
  return latency;
}

/**
 * This function checks if the user selected flash programming delay is possible.
 * If no, it returns the optimal flash programming delay for current frequency
 * @param {*} system_clock_frequency the system clock frequency
 * @param {*} selected_programming_delay the selected flash programming delay
 * @param {*} voltage_scaling the selected voltage scaling
 * @return {*} the adjusted flash programming delay
 */
function rcc_adjust_flash_programming_delay(system_clock_frequency, selected_programming_delay, voltage_scaling)
{
  let programming_delay = selected_programming_delay ? selected_programming_delay : 0;
  const optimal_programming_delay = helper_rcc_get_optimal_programming_delay(system_clock_frequency, voltage_scaling);
  if (programming_delay < optimal_programming_delay)
  {
    programming_delay = optimal_programming_delay;
  }
  return programming_delay;
}


/* Exported functions ----------------------------------------------------------------------------------------------*/

/**
 * RCC code generation initialization: make the code generation APIs global for them to be usable in any helpers
 * @param {object} root is program root
 * @returns None
 */
function helper_rcc_init_codegen(root){
  if (g_rcc_api == null){
    g_rcc_api = {}

    g_rcc_api['SWConfigurationAPI'] = root.SWConfigurationAPI;
    g_rcc_api['peripheralsResourceManagerAPI'] = root.peripheralsResourceManagerAPI;
    g_rcc_api['clockAPI'] = root.clockAPI;
    g_rcc_api['EnvVarAPI'] = root.EnvVarAPI;

    console.info(`helper_rcc_init_codegen: initialization successful`);
  }
}

/**
 * Retrieve context information (user inputs) of a component. Only the first instance is considered.
 * If multiple instances are present (UART1, 2 and 3 for instance), only UART1 configuration is returned.
 * @param {string} componentId is the identifier of the component as referenced by SW Config in its store,
 *                             or a meaningful subpart of the full componentId.
*                              example: "STMicroelectronics::Device:STM32CubeMX2 Config:RCC"
 * @returns {object} The context (user inputs)
 */
function helper_rcc_get_component_context(componentId) {
  let context;
  try {
    const instances = g_rcc_api.SWConfigurationAPI.getInstances(componentId);
    if (instances.length > 0) {
      context = g_rcc_api.SWConfigurationAPI.getSwInstanceConfiguration(instances[0]);
    }
  } catch (error) {
    console.error(`[ERROR] helper_rcc_get_component_context: ${error}`);
  }
  return context;
}

/**
 * Retrieve RCC main configuration. If RCC is not bound, default configuration is used.
 * @param  None
 * @returns {object} The RCC config (user inputs)
 */
function helper_rcc_get_rcc_context() {
  if (!g_rcc_ctx){
    g_rcc_ctx = helper_rcc_get_component_context('STMicroelectronics::Device:STM32CubeMX2 Config:RCC');

    if (!g_rcc_ctx){
      g_rcc_ctx = rcc_ctx_defaults;
      console.info(`helper_rcc_get_rcc_context: RCC not bound - default configuration used`);
    }
  }
  return g_rcc_ctx;
}

/**
 * Get the CORE configuration
 * @returns {object} The CORE configuration (user inputs)
 */
function helper_rcc_get_core_context() {
  if (g_core_ctx == null){
    g_core_ctx = helper_rcc_get_component_context('STMicroelectronics::Device:STM32CubeMX2 Config:CORE');
  }
  return g_core_ctx;
}


/**
 * Check is a RCC feature is available/enabled from CORE configuration
 * @param  {string} feature Feature to check
 * @returns {boolean} true if the feature is enabled, false otherwise
 */
function helper_rcc_is_feature_enabled(feature) {
  const core_configuration = helper_rcc_get_core_context();
  if (core_configuration?.rcc_feature?.[feature] === true) {
      return true;
  }
  return false;
}

/**
 * Retrieve RCC available bus list
 * @param  None
 * @returns {array} bus_list, an array containing the available buses
 */
function helper_rcc_get_available_buses() {
  let bus_list = [];
  try {
    const rcc_description = g_rcc_api.peripheralsResourceManagerAPI.getHardwareIpDescription("RCC");
    bus_list = Object.keys(rcc_description.features.GRP1);

    console.info(`helper_rcc_get_available_buses: ${bus_list}`);
  } catch (error) {
    console.error(`[ERROR] helper_rcc_get_available_buses: ${error}`);
  }

  return bus_list;
}


/**
 * Retrieve and order all user inputs usefull for system clock config function generation
 * @details Call in mx_rcc_template.c.hbs (object system_clk_config_object) to fill the function mx_rcc_cfg1_hal_init
 *          This function selects the latency depending on the targeted frequency and VCORE value.
 *          If the targeted frequency does not allow to select a latency, an error will occur
 * @param  {object}} The rcc context (user inputs)
 * @returns {object} rcc_config, an object containing all information for system configuration
 *{
 *    clock_source,
 *    latency,
 *    prescaler,
 *    frequencies,
 *}
 */
function helper_rcc_get_system_config(rcc_ctx) {

  if (g_rcc_clock_tree_config == null){

    try {
      console.info(`helper_rcc_get_system_config`);

      const rcc_config =
      {
        clock_source: undefined,
        systick_source:undefined,
        lse_css: false,
        prescaler:null,
        frequencies:{},
        clk_outputs: null,
        divider: null,
        flash_latency:1,
        flash_programming_delay:0,
        pll_used: {},
      }

      let result;

      /* Build system clock source object */
      result = rcc_find_system_clock_src();
      rcc_config.clock_source = result.object;
      if (result.ok === false){
        console.error(`helper_rcc_get_hal_clock_config_object: default system clock source used`);
      }

      /* Adjust Flash Latency and programming delay */
      rcc_config.flash_latency = rcc_adjust_flash_latency(rcc_config.clock_source.frequency, rcc_ctx?.basic.flash_latency, rcc_ctx?.basic.voltage_scaling);
      rcc_config.flash_programming_delay = rcc_adjust_flash_programming_delay(rcc_config.clock_source.frequency, rcc_ctx?.basic.flash_programming_delay, rcc_ctx?.basic.voltage_scaling);

      /* Find Prescalers */
      result = rcc_find_system_prescaler();
      rcc_config.prescaler = result.object;
      if (result.ok === false){
        console.error(`helper_rcc_get_hal_clock_config_object: bus prescaler parsing error`);
      }

      /* Find Systick source */
      if (helper_rcc_is_cortex_external_clock_required()){
        result = rcc_find_systick_clock_src();
        rcc_config.systick_source = result.object;
        if (result.ok === false){
          console.error(`helper_rcc_get_hal_clock_config_object: systick parsing error`);
        }
      }

      /* CSS information */
      if (rcc_ctx?.basic?.lse?.enable_css) {
        rcc_config.lse_css = true;
      }

      /* Find the clock dividers */
      result = rcc_find_clock_divider();
      rcc_config.divider = result.object;
      if (result.ok === false){
        console.error(`helper_rcc_get_hal_clock_config_object: clock divider parsing error`);
      }

      /* Fill in Frequencies */
      rcc_config.frequencies['default'] = g_rcc_api.clockAPI.getClockFrequency("HSI"); /* Default clock is HSI */
      rcc_config.frequencies['ahb'] = parseInt(g_rcc_api.clockAPI.getClockFrequency("HPRE"));
      rcc_config.frequencies['system'] = rcc_config.clock_source.frequency;

      /* Find MCO configs */
      result = rcc_find_clk_outputs_config(rcc_ctx);
      rcc_config.clk_outputs = result.object;
      if (result.ok === false){
        console.error(`helper_rcc_get_hal_clock_config_object: mco parsing error`);
      }

      /* Build pll_used */
      const pll1_object = {
        name: "PLL1",
        idx: 1,
        config: null,
        factors: ['m', 'n'],
        outputs: ['p', 'q', 'r'],
      };

      result = rcc_find_pll_config('PLL1');
      pll1_object.config = result.object;
      if (result.ok === false){
        console.error(`helper_rcc_get_hal_clock_config_object: pll1 parsing error`);
      }
      rcc_config.pll_used["PLL1"] = pll1_object;

      const pll2_object = {
        name: "PLL2",
        idx: 2,
        config: null,
        factors: ['m', 'n'],
        outputs: ['p', 'q', 'r'],
      };
      if (g_rcc_api.clockAPI.getClockInformationById('PLL2_Clock_Source') != undefined) {
        result = rcc_find_pll_config('PLL2');
        pll2_object.config = result.object;
        if (result.ok === false){
          console.error(`helper_rcc_get_hal_clock_config_object: pll2 parsing error`);
        }
        rcc_config.pll_used["PLL2"] = pll2_object;
      }

      console.info(`helper_rcc_get_system_config: ${JSON.stringify(rcc_config)}`);
      g_rcc_clock_tree_config = rcc_config;
    } catch (error) {
      console.error(`[ERROR] helper_rcc_get_system_config: ${error}`);
      g_rcc_clock_tree_config = {};
    }
  }
  return g_rcc_clock_tree_config;
}

/**
 * Check if pll2 is available or not
 * @param None
 * @return {boolean} True if PLL2 is available, False otherwise.
 */
function helper_rcc_is_pll2_available() {
  let isThere = false;
  if (g_rcc_api.clockAPI.getClockInformationById('PLL2_Clock_Source') != undefined) {
    isThere = true;
  }
  return isThere;
}

/**
 * Retrieve the list of resources (IPs) bound to at least one software component instance
 * @param  None
 * @returns {array} A list of resources name
 */
function helper_rcc_get_all_resources() {
  if (g_rcc_all_resources == null){
    g_rcc_all_resources = g_rcc_api.peripheralsResourceManagerAPI.getPeripheralsBoundToSoftwareInstances();

    /* Remove resources that does not need configuration*/
    g_rcc_all_resources = g_rcc_all_resources.filter(resource => !no_config_ppp.includes(resource))

    /* Rename ppp.pppi resources to pppi (RAMCFG.RAMCFG_SRAM1 renames to RAMCFG_SRAM1)*/
    g_rcc_all_resources = g_rcc_all_resources.map(item => map_splitted_ppp[item] !== undefined ? map_splitted_ppp[item] : item);

    /* Remove duplicated */
    g_rcc_all_resources = [...new Set(g_rcc_all_resources)];

  }
  return g_rcc_all_resources;
}

/**
* Retrieve the clock information for all bound resources
* @param {array} all_resources, the list of bound resources name (get with helper_rcc_get_all_resources)
* @returns {array} A list of clock objects. Each clock object includes the clock frequency, the is_external property and the list of resource using this clock as source
 * ex {
 * "HCLK": {
 *    "resources": [
 *       "ADC1",
 *       "ADC4",
 *       "DAC1",
 *       "MDF1"
 *    ],
 *    "frequency": 160000000,
 * },
 * "PCLK1": {
 *    "resources": [
 *       "I2C1",
 *       "LPTIM2",
 *       "USART3"
 *    ],
 *    "frequency": 160000000,
 * },
 * "LSE": {
 *    "resources": [
 *       "I2C2",
 *       "LPTIM1",
 *       "USART5"
 *    ],
 *    "frequency": 32768,
 * },
 *}
 */
function helper_rcc_get_all_perifs_clock_config(all_resources) {
  if (g_all_perifs_clock_config == null){
    try {
      let result_object = {};
      all_resources.forEach((/** @type {string} */ resource_name) => {
        result_object = rcc_get_pppi_configurations(resource_name, result_object);
      });
      g_all_perifs_clock_config = result_object;
      console.info(`All perif clock config =${JSON.stringify(g_all_perifs_clock_config)}`);
    }catch (error) {
        console.error(`[ERROR] helper_rcc_get_all_perifs_clock_config: ${error}`);
    }
  }
  return g_all_perifs_clock_config;
}

/**
 * Retrieve the clock information for a given resource
* @param {string} resource_name, the resources name
* @returns {object} One clock object. This clock object includes the clock frequency and the resource using this clock as source.
 */
function helper_rcc_get_one_perif_clock_config(resource_name) {
  let perif_clock_config = rcc_get_pppi_configurations(resource_name, null);

  return perif_clock_config;
}

/**
 * Retrieve the clock source object from the resource name
 * @param {string} resource_name HW resource name(ex ADC1)
 * @returns {object} Return an updated of the object current_ctxt
 */
function helper_rcc_get_clock_source_object(resource_name){
  let clock_source_id
  if (map_resources_name_for_kernel_source.hasOwnProperty(resource_name)) {
    clock_source_id = map_resources_name_for_kernel_source[resource_name];
    clock_source_id += '_Clock_Source';
  }
  else if (resource_name === 'POSENC1'){
    clock_source_id = 'POSEN1SRC';
  }
  else if (resource_name === 'POSENC2'){
    clock_source_id = 'POSENC2_Clock_Source';
  }
  else {
    let input_clock_object = g_rcc_api.clockAPI.getClockInformationByHwInstance(resource_name);
    if (input_clock_object){
      clock_source_id = input_clock_object.id.replace('_Input_Clock','_Clock_Source');
    }
  }
  const clock_source_object = g_rcc_api.clockAPI.getClockInformationById(clock_source_id);
  return clock_source_object;
}

/**
 * Retrieve the used oscillators in the current configuration
 * @param {object} rcc_config, the rcc main configuration
 * @param {array} all_ppp_clock_configs, the list of all ppp clock configurations
 * @returns {array} The list of used oscillators
 */
function helper_rcc_get_used_osc(rcc_config, all_ppp_clock_configs){
  if (g_rcc_used_osc == null){

    try {
      let found_osc = [];
      /* System clock analysis */
      if (available_oscillators.includes(rcc_config.clock_source.name)){
        found_osc.push(rcc_config.clock_source.name);
      }

      /* Systick clock analysis */
      if (available_oscillators.includes(rcc_config.systick_source?.name)){
        found_osc.push(rcc_config.systick_source.name);
      }

      /* MCO analysis (get source only if used)*/
      if (rcc_config.clk_outputs.mco1.used == true) {
        if (available_oscillators.includes(rcc_config.clk_outputs.mco1.src)){
          found_osc.push(rcc_config.clk_outputs.mco1.src);
        }
      }
      if (rcc_config.clk_outputs.mco2.used == true) {
        if (available_oscillators.includes(rcc_config.clk_outputs.mco2.src)){
          found_osc.push(rcc_config.clk_outputs.mco2.src);
        }
      }

      /* LSE CSS analysis */
      if (rcc_config.lse_css == true) {
        if (available_oscillators.includes("LSE")){
          found_osc.push("LSE");
        }
      }

      /* PPP analysis */
      for(const [key, value] of Object.entries(all_ppp_clock_configs)){
        if (available_oscillators.includes(key)){
          found_osc.push(key);
        }

        if (key == "PLL1"){
            if (available_oscillators.includes(rcc_config.pll_used["PLL1"].config.src)){
              found_osc.push(rcc_config.pll_used["PLL1"].config.src);
            }
        }
        if (key == "PLL2"){
            if (available_oscillators.includes(rcc_config.pll_used["PLL2"].config.src)){
              found_osc.push(rcc_config.pll_used["PLL2"].config.src);
            }
        }
      };

      /* PLL src Analysis */
      for(const [key, value] of Object.entries(rcc_config.pll_used)){
          if (available_oscillators.includes(value.config.src)){
          found_osc.push(value.config.src);
        }
      }

      /* Remove duplicates */
      found_osc = [...new Set(found_osc)];

      /* Reorder */
      g_rcc_used_osc = [];
      available_oscillators.forEach(function (osc){
        if (found_osc.includes(osc)){
          g_rcc_used_osc.push(osc);
        }
      });

    }
    catch  (error) {
      console.error(`[ERROR] helper_rcc_get_used_osc: ${error}`);
    }
  }
  return g_rcc_used_osc;
}

/**
 * Remap the dfp clock source name to driver name
 * @param {string} clock_source, the dfp name of the clock
 * @returns {string} The remapped name
 */
function helper_rcc_remap_clock_source(clock_source, layer)
{
  if (map_clock_source.hasOwnProperty(clock_source)) {
    return map_clock_source[clock_source];
  }
  return clock_source;
}

/**
 * Remap the hw_resource dfp kernel clock name to driver kernel clock name
 * @param {string} hw_resource, the dfp name of the kernel clock
 * @returns {string} The remapped name
 */
function helper_rcc_remap_kernel_clock_source(hw_resource)
{
  if (map_kernel_clock.hasOwnProperty(hw_resource)) {
    hw_resource = map_kernel_clock[hw_resource];
  }
  return hw_resource;
}

/**
 * Remap the hw_resource name to driver resource name
 * @param {string} hw_resource, the hw resource name
 * @returns {string} The remapped name
 */
function helper_rcc_remap_hw_resource(hw_resource)
{
  if (map_hw_resource_name.hasOwnProperty(hw_resource)) {
    hw_resource = map_hw_resource_name[hw_resource];
  }
  return hw_resource;
}

/**
 * Remap the hw_resource name to driver kernel clock resource name
 * @param {string} hw_resource, the hw resource name
 * @returns {string} The remapped name
 */
function helper_rcc_remap_hw_resource_kernel(hw_resource)
{
  if (map_hw_kernel_resource_name.hasOwnProperty(hw_resource)) {
    hw_resource = map_hw_kernel_resource_name[hw_resource];
  }
  return hw_resource;
}

/**
 * Return the ppp name from hw resource name
 * @param {string} sw_resource, the sw resource name
 * @returns {string} The remapped name
 */
function helper_rcc_get_ppp_name(hw_resource)
{
  /* Remove numbers at the end of the hw_resource */
  let sw_resource = hw_resource.replace(/\d+$/, "");

  /* remap if necessary */
  if (map_sw_resource_name.hasOwnProperty(sw_resource)) {
    sw_resource = map_sw_resource_name[sw_resource];
  }
  return sw_resource;
}


/**
 * Retrieve the power voltage scaling
 * @param {{ configs: { pwr_voltage_scaling: string; }[]; }} rcc_ctx the rcc context
 * @returns {string} the power voltage scaling, temporary it does not exist, set to default to range 4
 */
function helper_rcc_get_power_voltage_scaling(rcc_ctx) {
  let pwr_scaling = '1';
  try {
    let pwr_ctx = helper_rcc_get_component_context('STMicroelectronics::Device:STM32CubeMX2 Config:PWR');
    if (pwr_ctx){
      pwr_scaling = pwr_ctx.additional.voltage_scaling;
    }
  } catch (error) {
    console.error(`[ERROR] helper_rcc_get_power_voltage_scaling: ${error}`);
  }
  return pwr_scaling;
}

/**
 * Check if a resource is a DAC and need DacSH generation
 * @param {string} resource, the name of the resource
 * @returns {boolean} True or False
 */
function helper_rcc_is_dac_extra_config_needed(resource){
  try {
    if (dac_resources.includes(resource)){
      const dac_sh_val = g_rcc_api.EnvVarAPI.getVariableValue('DAC_CORE_USE_HAL_DAC_USE_DACSH');
      if (dac_sh_val !== undefined && dac_sh_val > 0) {
        return true;
      }
    }
  } catch (error) {
    console.error(`[ERROR] helper_rcc_is_dac_extra_config_needed: ${error}`);
  }
  return false;
}

/**
 * Check if resource is CRS and LSE selected as synchro source
 * @param {string} resource, the name of the resource
 * @returns {boolean} True or False
 */
function helper_rcc_is_crs_extra_config_needed(resource){
  try {
    if (resource == 'CRS'){
        const crs_config = helper_rcc_get_component_context('STMicroelectronics::Device:STM32CubeMX2 Config:CRS');
        if (crs_config?.basic.sync_signal.sync_source === 'LSE') {
          return true;
        }
    }
  } catch (error) {
    console.error(`[ERROR] helper_rcc_is_crs_extra_config_needed: ${error}`);
  }
  return false;
}

/**
 * Check if resource is crypto requiring RNG activation
 * @param {string} resource, the name of the resource
 * @returns {boolean} True or False
 */
function helper_rcc_is_crypto_extra_config_needed(resource_name){
  try {
    if ((resource_name == 'SAES') || (resource_name == 'PKA') || (resource_name == 'CCB')){
      return true;
    }
  } catch (error) {
    console.error(`[ERROR] helper_rcc_is_crypto_extra_config_needed: ${error}`);
  }
  return false;
}

/**
 * Check if resource is TAMP and active tamper is used
 * @param {string} resource, the name of the resource
 * @returns {boolean} True or False
 */
function helper_rcc_is_tamp_extra_config_needed(hw_resource){
  try {
    if(hw_resource === 'TAMP') {
      const used_active = g_rcc_api.EnvVarAPI.getVariableValue('ACTIVE_TAMPER_USED');
      if (used_active > 0) {
        return true;
      }
    }
  } catch (error) {
    console.error(`[ERROR] helper_rcc_is_tamp_extra_config_needed: ${error}`);
  }
  return false;
}

/**
 * Check if a resource also needs SBS activation
 * @param {string} resource, the name of the resource
 * @returns {boolean} True or False
 */
function helper_rcc_is_sbs_enable_required(resource){
  if (resource.includes('ADC')){
    const env_variable_name = resource+'_CORE_USE_SBS';
    const sbs_enable_val = g_rcc_api.EnvVarAPI.getVariableValue(env_variable_name);
    if (sbs_enable_val !== undefined && sbs_enable_val > 0) {
      return true;
    }
  }
  return false;
}

/**
 * Check if Cortex external clock source is needed (if yes, rcc configuration is needed)
 * @param  None
 * @returns {boolean} True or False
 */
function helper_rcc_is_cortex_external_clock_required(){
  const cortex_external_val = g_rcc_api.EnvVarAPI.getVariableValue('HAL_CORTEX_SYSTICK_SOURCE_EXTERNAL');
  if (cortex_external_val !== undefined && cortex_external_val > 0) {
    return true;
  }
  return false;
}

/**
 * Retrieve the dac sample and hold clock source
 * @param  {string} hw_resource, the dac resource name
 * @returns {string} The dac sample/hold clock name
 */
function helper_rcc_get_dac_sh_clock(hw_resource){
  let dac_sh_clock_src = ''
  try {
    if (hw_resource == 'DAC1')
       dac_sh_clock_src = g_rcc_api.clockAPI.getClockInformationById('DAC1SH_Clock_Source').value;
    else if (hw_resource == 'DAC2')
       dac_sh_clock_src = g_rcc_api.clockAPI.getClockInformationById('DAC2SH_Clock_Source').value;

  } catch (error) {
    console.error(`[ERROR] helper_rcc_get_dac_sh_clock: ${error}`);
  }
  return dac_sh_clock_src;
}

/**
 * Return True if the resource has an enable. Otherwise, return False;
 * @param {string} hw_resource, the name of the resource
 * @returns {boolean} True or False
 */
function helper_rcc_has_enable(hw_resource) {
  return !(resource_wo_enable.includes(hw_resource));
}

/**
 * Return True if the resource has a reset. Otherwise, return False;
 * @param {string} hw_resource, the name of the resource
 * @returns {boolean} True or False
 */
function helper_rcc_has_reset(hw_resource) {
  return !(resource_wo_reset.includes(hw_resource));
}

/**
 * Return True if the resource has a kernel clock mux. Otherwise, return False;
 * @param {string} resource, the name of the resource
 * @returns {boolean} True or False
 */
function helper_rcc_has_kernel_clock_mux(resource){
  return !(resource_wo_kernel_enable.includes(resource));
}
/*
function helper_rcc_has_kernel_clock_mux(resource){
  let ret = false;
  console.info(`helper_rcc_has_kernel_clock_mux: check if ${resource} has kernel clock mux`);
  try {
    const muxObject = global_api.clockAPI.getClockByHwInstance(helper_rcc_remap_kernel_clock_source(resource), { filter: { type: "multiplexor" } });
    if (muxObject.length > 0)    {
      ret = true;
    }
  } catch (error) {
    console.error(`[ERROR] helper_rcc_has_kernel_clock_mux: ${error}`);
  }
  return ret;
}
*/

/**
  * Check whether an extra clock configuration is needed for a resource.
  * For TAMP : yes when active tamper is used.
  * For CRS
  * @param {string} resource Hardware resource name.
  * @returns {boolean} True when extra clock configuration should be generated.
  */
function helper_rcc_is_clock_extra_config_needed(resource) {
  let ret = false;
  try {
    if (helper_rcc_is_crs_extra_config_needed(resource)) {
      ret = true;
    }
    else if (helper_rcc_is_crypto_extra_config_needed(resource)) {
      ret = true;
    }
    else if (helper_rcc_is_dac_extra_config_needed(resource)) {
      ret = true;
    }
  } catch (error) {
    console.error(`helper_rcc_is_clock_extra_config_needed: ${error}`);
  }
  return ret;
}

/**
 * Check whether a resource need clock configuration (kernel or extra)
 * @param {string} resource Hardware resource name.
 * @returns {boolean} True when clock configuration should be generated.
 */
function helper_rcc_is_clock_config_needed(resource) {

  if (resource === 'TAMP') {
    if (helper_rcc_is_tamp_extra_config_needed(resource) && helper_rcc_has_kernel_clock_mux(resource)) {
      return true;
    }
  }
  else if (helper_rcc_is_clock_extra_config_needed(resource) || helper_rcc_has_kernel_clock_mux(resource)) {
    return true;
  }
  return false;
}

/**
 * Check whether a crypto peripheral is activated among the activated peripherals.
 * The crypto IPs looked for are CCB, PKA, RNG and SAES.
 * CCB embeds the whole crypto block: when CCB is active, all crypto IPs are returned
 * so that they all get disabled and reset.
 * SAES and PKA depend on RNG: when either is active, RNG is added to the list (without duplication).
 * @param {string[]} activated_peripherals Array of activated peripheral instance names.
 * @returns {{has_crypto: boolean, active_crypto_ips: string[]}} Object indicating crypto presence
 *          and the list of active crypto IPs (empty list and false on error).
 */
function helper_rcc_get_active_crypto_ips(activated_peripherals) {
  try {
    console.info(`helper_rcc_get_active_crypto_ips: activated_peripherals=${activated_peripherals}`);
    const crypto_ips = ['RNG', 'SAES', 'HASH', 'PKA', 'CCB'];

    /* CCB embeds the whole crypto block:
    - when active, disable and reset all crypto IPs
    - otherwise get only the active ones (keeping crypto_ips order)*/
    const active_crypto_ips = activated_peripherals.includes('CCB')
      ? crypto_ips.slice()
      : crypto_ips.filter(ip => activated_peripherals.includes(ip));

    /* SAES and PKA depend on RNG: ensure RNG is present, do not duplicate it and place it first */
    if ((active_crypto_ips.includes('SAES') || active_crypto_ips.includes('PKA')) && !active_crypto_ips.includes('RNG')) {
      active_crypto_ips.unshift('RNG');
    }

    const has_crypto = active_crypto_ips.length > 0;
    console.info(`helper_rcc_get_active_crypto_ips: has_crypto=${has_crypto}, active_crypto_ips=${active_crypto_ips}`);
    return { has_crypto, active_crypto_ips };
  } catch (error) {
    console.error(`helper_rcc_get_active_crypto_ips: ${error}`);
    return { has_crypto: false, active_crypto_ips: [] };
  }
}

/**
 * This function parses the list of resources sharing the same enable bit.
 * It return False if:
 *    - the current resource is in the list AND
 *    - if at least 2 resource of this list are bindable
 * Otherwise, it returns True
 * @param {string} resource, the name of the resource
 * @returns {boolean} True or False
 */
function helper_rcc_is_not_shared_ppp(resource){
  let ret = true;
  resource_sharing_enable_bit.forEach((group) => {
    if (group.includes(resource)) {
      let shared_ppp_nr = 0;
      group.forEach((item) => {
      try {
        /* getHardwareIpDescription throws an error if the item is not available in dataset */
        /* meaning if the item is not bindable / included into the selected package */
        g_rcc_api.peripheralsResourceManagerAPI.getHardwareIpDescription(item);
        shared_ppp_nr++;
      } catch (error) {}
      });
      if (shared_ppp_nr > 1) {
        ret = false;
      }
    }
  });
  return ret;
}

/**
 * Return False if the resource has no instances. Otherwise, return True;
 * @param {string} hw_resource, the name of the resource
 * @returns {boolean} True or False
 */
function helper_rcc_is_instantiable_periph(hw_resource){
  return !not_instantiable_peripheral_resources.includes(hw_resource);
}

/**
 * Set the resource 'resource_name' enable state to True
 * @param {string} path_name, the name of the resource (clock, pll, config)
 * @returns None
 */
function helper_rcc_set_resource_enabled(resource_name){
  g_rcc_resource_state[resource_name] = true;
}

/**
 * Get the 'resource_name' enable status
 * @param {string} resource_name, the name of the resource
 * @returns {boolean} True or False
 */
function helper_rcc_is_resource_enabled(resource_name){
  let resource_enable = false;
  if (g_rcc_resource_state.hasOwnProperty(resource_name))
  {
    resource_enable = g_rcc_resource_state[resource_name];
  }
  return resource_enable;
}

/**
 * Check if the SW configuration is "central"
 * @param {object} config, The RCC config
 * @returns {boolean} True or False
 */
function helper_rcc_is_central(config){
  try {
    return (config.basic.periph_clocks_init == rcc_config_codes.CENTRAL);
  } catch (error) {
    console.error(`helper_rcc_is_central: ${error}`);
  }
  return false;
}

/**
 * Check if the SW configuration is "controlled by peripheral"
 * @param {object} config, The RCC config
 * @returns {boolean} True or False
 */
function helper_rcc_is_controlled_by_periph(config){
  try {
    return (config.basic.periph_clocks_init == rcc_config_codes.CONTROLLED_BY_PERIPHERALS);
  } catch (error) {
    console.error(`helper_rcc_is_controlled_by_periph: ${error}`);
  }
  return false;
}

/**
 * Check if the SW configuration is "controlled by user"
 * @param {object} config, The RCC config
 * @returns {boolean} True or False
 */
function helper_rcc_is_controlled_by_user(config){
  try {
    return (config.basic.periph_clocks_init == rcc_config_codes.CONTROLLED_BY_USER);
  } catch (error) {
    console.error(`helper_rcc_is_controlled_by_user: ${error}`);
  }
  return false;
}

/**
 * Return the systick divider value
 * @param {object} system_config
 * @param {boolean} external systick source is external or not
 * @returns {number} systick divider value in power of 2 plus 3 (extra divided by 8 for systick)
 */
function helper_rcc_get_systick_divider(system_config, external){
  let systick_divider = 3;
  try {
    if (system_config?.prescaler.ahb){
      /* convert divider value to power of 2*/
      systick_divider = Math.log2(system_config.prescaler.ahb);
      if (external == true) {
      systick_divider = systick_divider + 3; /* Extra divided by 8 for systick */
      }
    }
  } catch (error) {
    console.error(`helper_rcc_get_systick_divider: ${error}`);
  }

  return systick_divider;
}

/**
 * Retrieve SysTick input frequency based on external clock selection
 * @param {boolean|string|number} external External SysTick clock selection flag
 * @returns {string|number} SysTick input frequency
 */
function helper_rcc_get_systick_input_frequency(external) {
  try {
    const isExternal = external === true;
    const clockedInstanceName = isExternal ? "SYSTICK_EXT" : "SYSTICK_INT";
    let clockedInstancesList = g_rcc_api.clockAPI.getClockByHwInstance(clockedInstanceName);
    if (clockedInstancesList?.length > 0) {
      return clockedInstancesList[0].frequency;
    }
    else {
      console.error(`helper_rcc_get_systick_input_frequency: ${clockedInstanceName} not found`);
      return "0";
    }
  } catch (error) {
    console.error(`[ERROR] helper_rcc_get_systick_input_frequency: ${error}`);
    return "0";
  }
}

/**
  * Retrieve all the interruptions set by RCC but not generated
  * @param {object} nvic_api Getter on NVIC api
  * @param {object} exti_api Getter on EXTI api (not used)
  * @param {object} resource Current resource
  * @param {object} config current configuration of the RCC
  * @returns {object}
 */
function helper_rcc_get_irq_handler(nvic_api, exti_api, resource, config) {
  let result = [];
  try {
    const upperResource = typeof resource === 'string' ? resource.toUpperCase() : resource;
    const globalLabels = config?.info?.labels || [];

    // Helper to push aliases for a given NVIC config and label set
    function pushAliases(nvic_cfg, labels, emptyUsesGlobal) {
      if (!nvic_cfg) return;
      if (labels && labels.length) {
        let first = true;
        for (const lbl of labels) {
          result.push({
            resource: upperResource,
            exti_name: nvic_cfg.name,
            labels: labels,
            first_label: first,
            alias: lbl.toUpperCase(),
            nvic_config: nvic_cfg,
            generated: false
          });
          first = false;
        }
      } else if (emptyUsesGlobal) {
        // No local labels but want to fall back to global
        pushAliases(nvic_cfg, globalLabels, false);
      } else {
        result.push({
          resource: upperResource,
          exti_name: nvic_cfg.name,
          alias: '',
          nvic_config: nvic_cfg,
          generated: false
        });
      }
    }

    // HSE CSS (NVIC / NMI)
    if (config?.basic?.hse?.enable_css === true && config?.system?.nvic?.irq_handler_generation !== true) {
      const need = config?.system?.nvic?.hse_css_interruption?.needs?.[0];
      if (need) {
        let nvicConfig;
        try { nvicConfig = nvic_api.getNeedById(need.id); } catch (e) { console.error(`[RCC][IRQ][HSE] getNeedById: ${e}`); }
        nvicConfig.name = 'RCC_' + nvicConfig.name; /* IRQ handler is RCC_NMI_xxx and not only NMI_xxx */
        pushAliases(nvicConfig, globalLabels, false);
      }
    }

    // LSE CSS (EXTI)
    if (config?.basic?.lse?.enable_css === true) {
      const lseExtiNeed = config?.system?.exti?.lse_css_interruption?.needs?.[0];
      if (lseExtiNeed) {
        let extiConfig;
        try { extiConfig = exti_api.getNeedById(lseExtiNeed.id); } catch (e) { console.error(`[RCC][IRQ][LSE] getNeedById: ${e}`); }
        if (extiConfig) {
          const intr = extiConfig?.configuration?.basic?.interruption;
          const enableIntr = intr?.enable_interruption ?? true;
          const autoGen = intr?.irq_handler_generation === true;
          if (enableIntr && !autoGen) {
            let nvicConfigLse;
            const lseNvicNeed = intr?.nvic?.needs?.[0];
            if (lseNvicNeed) {
              try { nvicConfigLse = nvic_api.getNeedById(lseNvicNeed.id); } catch (e) { console.error(`[RCC][IRQ][LSE] getNeedById NVIC: ${e}`); }
            }
            const lseLabels = extiConfig?.configuration?.labels || [];
            // If no EXTI-specific labels, fallback to global ones
            pushAliases(nvicConfigLse, lseLabels, true);
          }
        }
      }
    }
  } catch (e) {
    console.error(`helper_rcc_get_irq_handler: ${e}`);
  }
  return result;
}

/**
 * Get the PPP clock mode defined in CORE
 * @param {string} hw_resource hw_resource to be checked
 * @returns clock mode value:
 *          @arg 0  HAL_CLK_ENABLE_NO                 No clock activation in PPP
 *          @arg 1  HAL_CLK_ENABLE_PERIPH_ONLY        PERIPH Clock activation only
 *          @arg 2  HAL_CLK_ENABLE_PERIPH_PWR_SYSTEM  PERIPH Clock activation including PWR and/or system
 */
function helper_rcc_get_clk_enable_mode(hw_resource) {
  let result = 0;
  console.info(`helper_rcc_get_clk_enable_mode: hw_resource=${hw_resource}`);
  try {

    const core_configuration = helper_rcc_get_core_context();

    /* Get component key */
    /* Component is the hw_resource without terminating index except for PPP including several functions (e.g: USART1 can be UART) */
    let component = hw_resource.replace(/\d+$/, '');  /* Remove numbers at the end of string */
    const sw_instances = g_rcc_api.peripheralsResourceManagerAPI.getSoftwareInstancesBoundToPeripheral(hw_resource);
    const component_config = g_rcc_api.SWConfigurationAPI.getSwInstanceConfiguration(sw_instances[0]);
    if (component_config.info?.function_type) {
      component = component_config.info.function_type;
    }
    if (hw_resource.includes('DMA')) {
      component = 'DMA';
    }
    if (hw_resource.includes('GPIO')) {
      component = 'GPIO';
    }
    const component_key = component.toLowerCase() + "_feature";

    if (Object.hasOwnProperty.call(core_configuration, component_key)) {
      current_config = core_configuration[component_key];
      if (current_config["clk_enable_model"] === "HAL_CLK_ENABLE_NO") {
        result = 0;
      } else if (
        current_config["clk_enable_model"] === "HAL_CLK_ENABLE_PERIPH_ONLY"
      ) {
        result = 1;
      } else {
        /* HAL_CLK_ENABLE_PERIPH_PWR_SYSTEM */
        result = 2;
      }
    }
  } catch (e) {
    console.error(`[ERROR] helper_rcc_get_clk_enable_mode: ${e}`);
  }

  return result;
}

/**
 * Check if the startup time is available in the configuration
 * @param {object} board
 * @returns {boolean} True or False
 */
function helper_rcc_is_startup_time_available(board){
  let is_available = false;
  console.info(`helper_rcc_is_startup_time_available. Board is: ${JSON.stringify(board)}`);
  if (board == null)
  {
    is_available = false;
  }
  else
  {
    is_available = true;
  }
  return is_available;
}

/**
 * Get the startup time
 * @param {object} board
 * @param {string} clock
 * @returns {Number} The start-up time
 */
function helper_rcc_get_startup_time(board, clock){
  let startup_time = 100;
  if (board != null)
  {
    /* Need to get startup time from board information */
    if (clock == 'hse')
    {
      startup_time = 100;
      console.warn(`helper_rcc_get_startup_time. HSE startup time not found in dataset`);
    }
    else if (clock == 'lse')
    {
      startup_time = 5000;
      console.warn(`helper_rcc_get_startup_time. LSE startup time not found in dataset`);
    }
    else
    {
      startup_time = 100;
    }
  }
  return startup_time;
}

/**
 * Check if the voltage scaling is possible for a given frequency
 * @param {string} voltage_scaling The voltage scaling (e.g: VOLT_SCALE_0)
 * @param {number} system_clock_frequency The system clock frequency in hertz.
 * @return {boolean} True if the voltage scaling is possible, false otherwise.
 */
function helper_rcc_is_vos_possible(voltage_scaling, system_clock_frequency){
  let ret = false;

  console.info(`helper_rcc_is_vos_possible. voltage_scaling ${voltage_scaling}`);
  console.info(`helper_rcc_is_vos_possible. system_clock_frequency ${system_clock_frequency}`);

  try {
    if (voltage_scaling == 'VOLT_SCALE_0') {
      if (system_clock_frequency <= 280000000){
        ret = true;
      }
    }
    else if (voltage_scaling == 'VOLT_SCALE_1') {
      if (system_clock_frequency <= 220000000){
        ret = true;
      }
    }
    else if (voltage_scaling == 'VOLT_SCALE_2') {
      if (system_clock_frequency <= 150000000){
        ret = true;
      }
    }
  }catch (error) {
    console.error(`[ERROR] helper_rcc_is_vos_possible: ${error}`);
  }
  return ret;
}

/* Minimum recommanded flash latency wait states for a given frequency */
const flash_latencies = {

  max_fy_value: {
    0: {0:42000000, 1:34000000, 2:30000000},
    1: {0:84000000, 1:68000000, 2:60000000},
    2: {0:126000000, 1:102000000, 2:90000000},
    3: {0:168000000, 1:136000000, 2:120000000},
    4: {0:210000000, 1:170000000, 2:150000000},
    5: {0:252000000, 1:204000000, 2:150000000},
    6: {0:280000000, 1:220000000, 2:150000000},
    7: {0:280000000, 1:220000000, 2:150000000},
    8: {0:280000000, 1:220000000, 2:150000000},
    9: {0:280000000, 1:220000000, 2:150000000},
   10: {0:280000000, 1:220000000, 2:150000000},
   11: {0:280000000, 1:220000000, 2:150000000},
   12: {0:280000000, 1:220000000, 2:150000000},
   13: {0:280000000, 1:220000000, 2:150000000},
   14: {0:280000000, 1:220000000, 2:150000000},
   15: {0:280000000, 1:220000000, 2:150000000}
   },
  maximum: 15
};

/**
 * Check if the flash latency is possible for a given frequency
 * @param {number} system_clock_frequency The system clock frequency in hertz.
 * @param {number} latency The flash latency in wait states.
 * @param {string} voltage_scaling The voltage scaling (e.g: VOLT_SCALE_0)
 * @returns {boolean} True if the flash latency is possible, false otherwise.
 */
function helper_rcc_is_flash_latency_possible(system_clock_frequency, latency, voltage_scaling)
{
  let ret = false;

  if (latency <= flash_latencies.maximum && latency >= 0)
  {
    if (latency in flash_latencies.max_fy_value)
    {
      let vos = voltage_scaling.replace('VOLT_SCALE_','');
      if (system_clock_frequency <= flash_latencies.max_fy_value[latency][vos])
      {
        ret = true;
      }
    }
    else
    {
      ret = true;
    }
  }
  /* console.warn(`helper_rcc_is_flash_latency_possible (${system_clock_frequency}, ${latency}) is ${ret}`); */
  return ret;
}

/**
 * Get the optimal flash latency for a given frequency
 * @param {number} system_clock_frequency
 * @param {string} voltage_scaling The voltage scaling (e.g: VOLT_SCALE_0)
 * @returns {number} latency
 */
function helper_rcc_get_optimal_latency(system_clock_frequency, voltage_scaling) {
  let latency = flash_latencies.maximum;
  /* console.warn(`helper_rcc_get_optimal_latency (${system_clock_frequency})`); */
  let vos = voltage_scaling.replace('VOLT_SCALE_','');
  for(const [lat, frequency] of Object.entries(flash_latencies.max_fy_value)) {
    if (system_clock_frequency <= frequency[vos]){
      latency = lat;
      break;}
  }
  /* console.warn(`helper_rcc_get_optimal_latency (${latency})`); */
  return Number(latency);
}

/**
 * Get the maximum frequency for a given flash latency and voltage scaling
 * @param {number} latency The flash latency in wait states.
 * @param {string} voltage_scaling The voltage scaling (e.g: VOLT_SCALE_0)
 * @returns {string} The maximum frequency in MHz in a readable format (e.g: "168") or "N.A." if not available.
 */
function helper_rcc_get_latency_max_freq(latency, voltage_scaling){
  let max_freq_str = "N.A.";

  /*console.warn(`helper_rcc_get_latency_max_freq (${latency}, ${voltage_scaling})`); */
  if (latency in flash_latencies.max_fy_value)
  {
    let vos = voltage_scaling.replace('VOLT_SCALE_','');
    let max_freq = flash_latencies.max_fy_value[latency][vos];
    max_freq = max_freq / 1000000;
    max_freq_str = max_freq.toFixed(3).replace(/\.?0+$/, '');
  }
  return max_freq_str;
}

/* Minimum recommanded flash latency wait states for a given frequency */
const programming_delays = {
  max_fy_value: {
    0: {0: 84000000, 1: 68000000, 2: 60000000},
    1: {0: 168000000, 1: 136000000, 2: 120000000},
    2: {0: 252000000, 1: 204000000, 2: 150000000},
    3: {0: 280000000, 1: 220000000, 2: 150000000}
  },
  maximum: 3
};

/**
 * Check if the flash programming delay is possible for a given frequency
 * @param {number} system_clock_frequency
 * @param {number} programming_delay
 * @returns
 */
function helper_rcc_is_flash_programming_delay_possible(system_clock_frequency, programming_delay, voltage_scaling)
{
  let ret = false;
  if (programming_delay <= programming_delays.maximum)
  {
    if (programming_delay in programming_delays.max_fy_value)
    {
      let vos = voltage_scaling.replace('VOLT_SCALE_','');
      if (system_clock_frequency <= programming_delays.max_fy_value[programming_delay][vos])
      {
        ret = true;
      }
    }
    else
    {
      ret = true;
    }
  }
  /*console.info(`helper_rcc_is_flash_programming_delay_possible. For ${system_clock_frequency} and ${programming_delay} is ${ret}`);*/
  return ret;
}

/**
 * Get the optimal flash programming delay for a given frequency
 * @param {number} system_clock_frequency
 * @param {string} voltage_scaling The voltage scaling (e.g: VOLT_SCALE_0)
 * @returns {number} programming_delay
 */
function helper_rcc_get_optimal_programming_delay(system_clock_frequency, voltage_scaling) {
  let programming_delay = programming_delays.maximum;

  let vos = voltage_scaling.replace('VOLT_SCALE_','');
  for(const [delay, frequency] of Object.entries(programming_delays.max_fy_value)) {
    if (system_clock_frequency <= frequency[vos]){
      programming_delay = delay;
      break;}
  }
  /* console.info(`helper_rcc_get_optimal_programming_delay. For ${system_clock_frequency} is ${programming_delay}`); */
  return Number(programming_delay);
}

/**
 * Get the maximum frequency for a given flash programming delay and voltage scaling
 * @param {number} programming_delay The flash programming delay in wait states.
 * @param {string} voltage_scaling The voltage scaling (e.g: VOLT_SCALE_0)
 * @returns {string} The maximum frequency in MHz in a readable format (e.g: "168") or "N.A." if not available.
 */
function helper_rcc_get_programming_delay_max_freq(programming_delay, voltage_scaling){
  let max_freq_str = "N.A.";

  console.warn(`helper_rcc_get_programming_delay_max_freq (${programming_delay}, ${voltage_scaling})`);
  if (programming_delay in programming_delays.max_fy_value)
  {
    let vos = voltage_scaling.replace('VOLT_SCALE_','');
    let max_freq = programming_delays.max_fy_value[programming_delay][vos];
    max_freq = max_freq / 1000000;
    max_freq_str = max_freq.toFixed(3).replace(/\.?0+$/, '');
  }
  return max_freq_str;
}

/**
 * Get the bus group for a given peripheral instance and context.
 * @param {string} peripheralInstance The name of the peripheral instance.
 * @returns {string|null} The bus group and bus mapping, or null if not found.
 */
function helper_rcc_get_bus_group(peripheralInstance) {
  return peripheralBusMapping[peripheralInstance] || null;
}

/**
 * Get the bus clock name for a given peripheral instance.
 * @param {string} peripheralInstance The name of the peripheral instance.
 * @returns {string} The bus clock name (e.g.: "PCLK1_Input_Clock") (empty if not found).
 */
function helper_rcc_get_bus_clock_name(peripheralInstance) {
  const group = peripheralBusMapping[peripheralInstance];
  const clock = group ? groupClockMapping[group] : null;
  return clock ? `${clock}_Peripheral_Clock` : "";
}

/**
 * Convert the frequency to a readable string
 * @param {number} frequency Frequency in hertz
 * @returns {string} Readable frequency string
 */
function helper_rcc_display_frequency(frequency) {
  try {
    let value, unit;

    if (frequency >= 1e6) {
      value = frequency / 1e6;
      unit = ' MHz';
    } else if (frequency >= 1e3) {
      value = frequency / 1e3;
      unit = ' kHz';
    } else {
      value = frequency;
      unit = ' Hz';
    }

    /* Limit to 3 floating point digits and suppress useless zeros. */
    let strValue = value.toFixed(3).replace(/\.?0+$/, '');

    return strValue + unit;
  } catch (error) {
    console.error(`[ERROR] helper_rcc_display_frequency: ${error}`);
    return frequency + ' Hz';
  }
}

/**
 * Display some values
 * @returns True or False
 * @param {any[]} arg
 */
function helper_rcc_display_values(...arg){
    for (var i = 0; i < arg.length; i++)
    {
      console.info(`helper_rcc_display_values. Variable #${i} is ${arg[i]}`);
    }
    return 222;
}

/**
 * Break the javascript execution
 * @note This function is for Debug purpose only - Can be called into the template to watch assigned variables.
You need to toggle a breakpoint for the code to break.
 * @param {Number} code A code to indicate where the function has been called (can be the line number)
 * @param {any} root
 */
function helper_breakpoint(code, root){
  let ret = code;
}

function itemAt(array, idx){
  return array[idx];
}

function include(object, key){
  return object.hasOwnProperty(key);
}

function eachObject(obj, options) {
  let result = '';
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      result += options.fn({ key, value: obj[key] });
    }
  }
  return result;
}

/* Module Exports */
module.exports = {
  helper_rcc_init_codegen,
  helper_rcc_get_component_context,
  helper_rcc_get_rcc_context,
  helper_rcc_is_feature_enabled,
  helper_rcc_get_available_buses,
  helper_rcc_get_system_config,
  helper_rcc_is_pll2_available,
  helper_rcc_get_all_resources,
  helper_rcc_get_all_perifs_clock_config,
  helper_rcc_get_one_perif_clock_config,
  helper_rcc_get_clock_source_object,
  helper_rcc_get_used_osc,
  helper_rcc_remap_clock_source,
  helper_rcc_remap_kernel_clock_source,
  helper_rcc_remap_hw_resource,
  helper_rcc_remap_hw_resource_kernel,
  helper_rcc_get_ppp_name,
  helper_rcc_get_power_voltage_scaling,
  helper_rcc_is_dac_extra_config_needed,
  helper_rcc_is_tamp_extra_config_needed,
  helper_rcc_is_crs_extra_config_needed,
  helper_rcc_is_crypto_extra_config_needed,
  helper_rcc_is_clock_extra_config_needed,
  helper_rcc_is_clock_config_needed,
  helper_rcc_is_sbs_enable_required,
  helper_rcc_is_cortex_external_clock_required,
  helper_rcc_get_dac_sh_clock,
  helper_rcc_has_enable,
  helper_rcc_has_reset,
  helper_rcc_has_kernel_clock_mux,
  helper_rcc_get_active_crypto_ips,
  helper_rcc_is_not_shared_ppp,
  helper_rcc_is_instantiable_periph,
  helper_rcc_set_resource_enabled,
  helper_rcc_is_resource_enabled,
  helper_rcc_is_central,
  helper_rcc_is_controlled_by_periph,
  helper_rcc_is_controlled_by_user,
  helper_rcc_get_systick_divider,
  helper_rcc_get_systick_input_frequency,
  helper_rcc_get_irq_handler,
  helper_rcc_get_clk_enable_mode,
  helper_rcc_is_startup_time_available,
  helper_rcc_get_startup_time,
  helper_rcc_is_flash_latency_possible,
  helper_rcc_get_optimal_latency,
  helper_rcc_get_latency_max_freq,
  helper_rcc_is_flash_programming_delay_possible,
  helper_rcc_get_optimal_programming_delay,
  helper_rcc_get_programming_delay_max_freq,
  helper_rcc_is_vos_possible,
  helper_rcc_get_bus_group,
  helper_rcc_get_bus_clock_name,
  helper_rcc_display_frequency,
  helper_rcc_display_values,
  helper_breakpoint,
  itemAt,
  include,
  eachObject,
};
