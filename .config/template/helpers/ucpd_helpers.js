/**
 * @file Helpers functions used for UCPD SW component
 * @license
 * Copyright (c) 2026 STMicroelectronics.
 * All rights reserved.
 *
 * This software is licensed under terms that can be found in the LICENSE file
 * in the root directory of this software component.
 * If no LICENSE file comes with this software, it is provided AS-IS.
 */

/**
 * Calculate the optimal UCPD prescaler, HBIT divider, bitrate,
 * transition window divider/time, or interframe gap divider/time
 * based on clock source.
 *
 * Modes:
 * 1 = PSC          -> return prescalerdiv value
 * 2 = UCPDCLK      -> return ucpd_clk frequency in Hz
 * 3 = HBIT         -> return hbitdiv value
 * 4 = HBITCLK      -> return hbit_clk frequency in Hz
 * 5 = BITRATE      -> return bitrate in Kbps
 * 6 = TRANSWINDIV  -> return transwindiv value
 * 7 = TTRANSWIN    -> return transition window time in µs
 * 8 = IFRGAPDIV    -> return ifrgapdiv value
 * 9 = TIFRGAP      -> return interframe gap time in µs
 *
 * @param {number} input_clock_hz Input clock in Hz
 * @param {number} mode Mode selector
 * @returns {number|null}
 */
function helper_ucpd_set_optimum_performance(input_clock_hz, mode) {
  try {
    console.log(
      `[INFO] helper_ucpd_set_optimum_performance: input_clock_hz=${input_clock_hz}, mode=${mode}`
    );

    const allowedPrescalers = [1, 2, 4, 8, 16];
    const MIN_CLK = 6000000;
    const MAX_CLK = 12000000;

    let bestPrescaler = null;
    let bestClk = null;
    // Choose prescaler with lowest in-range clk
    for (const p of allowedPrescalers) {
      const clk = input_clock_hz / p;

      if (clk >= MIN_CLK && clk <= MAX_CLK) {
        if (bestClk === null || clk < bestClk) {
          bestPrescaler = p;
          bestClk = clk;
        }
      }
    }

    if (bestPrescaler === null) {
      bestPrescaler = 1;
      bestClk = input_clock_hz;
    }

    if (mode === 1) {
      return bestPrescaler;
    }

    if (mode === 2) {
      return bestClk;
    }

    const TARGET_HBIT = 600000;

    let bestHbitDiv = null;
    let bestHbitClk = null;
    // Choose hbitdiv closest to 600khz
    for (let div = 1; div <= 64; div++) {
      const hbitClk = bestClk / div;

      if (
        bestHbitClk === null ||
        Math.abs(hbitClk - TARGET_HBIT) < Math.abs(bestHbitClk - TARGET_HBIT)
      ) {
        bestHbitClk = hbitClk;
        bestHbitDiv = div;
      }
    }

    if (mode === 3) {
      return bestHbitDiv;
    }

    if (mode === 4) {
      const STEP = 1000;
      return Math.round(bestHbitClk / STEP) * STEP;
    }

    if (mode === 5) {
      // bitrate = hbit_clk / 2, returned in Kbps, rounded to nearest integer
      return Math.round(bestHbitClk / 2 / 1000);
    }

    const timeUsFromDiv = (div, clkHz) => (div / clkHz) * 1e6;
    // Choose transwindiv that is between 12 and 20 µs
    const findTransitionWindowDiv = (hbitClk) => {
      const MIN_US = 12;
      const MAX_US = 20;
      const RECOMMENDED_DIV = 10;

      const isValid = (div) => {
        const tUs = timeUsFromDiv(div, hbitClk);
        return tUs >= MIN_US && tUs <= MAX_US;
      };

      if (
        RECOMMENDED_DIV >= 2 &&
        RECOMMENDED_DIV <= 32 &&
        isValid(RECOMMENDED_DIV)
      ) {
        return RECOMMENDED_DIV;
      }

      for (let div = 2; div <= 32; div++) {
        if (div === RECOMMENDED_DIV) {
          continue;
        }
        if (isValid(div)) {
          return div;
        }
      }

      return null;
    };

    const transwinDiv = findTransitionWindowDiv(bestHbitClk);

    if (mode === 6) {
      return transwinDiv;
    }

    if (mode === 7) {
      if (transwinDiv === null) {
        return null;
      }
      return Math.round(timeUsFromDiv(transwinDiv, bestHbitClk));
    }
    // Choose ifrgapdiv that is minimum 25 µs
    const findInterframeGapDiv = (hbitClk) => {
      const MIN_US = 25;
      const RECOMMENDED_DIV = 15;

      const isValid = (div) => {
        const tUs = timeUsFromDiv(div, hbitClk);
        return tUs >= MIN_US;
      };

      if (
        RECOMMENDED_DIV >= 2 &&
        RECOMMENDED_DIV <= 32 &&
        isValid(RECOMMENDED_DIV)
      ) {
        return RECOMMENDED_DIV;
      }

      for (let div = 2; div <= 32; div++) {
        if (div === RECOMMENDED_DIV) {
          continue;
        }
        if (isValid(div)) {
          return div;
        }
      }

      return null;
    };

    const ifrgapDiv = findInterframeGapDiv(bestHbitClk);

    if (mode === 8) {
      return ifrgapDiv;
    }

    if (mode === 9) {
      if (ifrgapDiv === null) {
        return null;
      }
      return Math.round(timeUsFromDiv(ifrgapDiv, bestHbitClk));
    }

    return 1;
  } catch (e) {
    console.error(`helper_ucpd_set_optimum_performance: ${e}`);
    return null;
  }
}

/**
 * Calculate UCPD core clock based on clock source and the prescaler.
 * @param {number} input_clock_hz Input clock in Hz
 * @param {number} prescaler UCPD prescaler
 * @returns {number|null}
 */
function helper_ucpd_get_core_clock_frequency(input_clock_hz, prescaler) {
  try {
    console.log(
      `[INFO] helper_ucpd_get_core_clock_frequency: input_clock_hz=${input_clock_hz}, prescaler=${prescaler}`
    );

    return input_clock_hz / prescaler;
  } catch (e) {
    console.error(`helper_ucpd_get_core_clock_frequency: ${e}`);
    return null;
  }
}

/**
 * Calculate half bit clock based on clock source, prescaler and half bit division ratio.
 * @param {number} input_clock_hz Input clock in Hz
 * @param {number} prescaler UCPD prescaler
 * @param {number} halfbitdiv half bit clock division ratio
 * @returns {number|null}
 */
function helper_ucpd_get_half_bit_clock_frequency(input_clock_hz, prescaler, halfbitdiv) {
  try {
    console.log(
      `[INFO] helper_ucpd_get_core_clock_frequency: input_clock_hz=${input_clock_hz}, prescaler=${prescaler}, halfbitdiv=${halfbitdiv} `
    );

    const  clk = input_clock_hz / prescaler
    const hbitClk = clk / halfbitdiv;

    return Math.round(hbitClk / 1000) * 1000;
  } catch (e) {
    console.error(`helper_ucpd_get_half_bit_clock_frequency: ${e}`);
    return null;
  }
}

/**
 * Calculate bit rate clock based on clock source, prescaler and half bit division ratio.
 * @param {number} input_clock_hz Input clock in Hz
 * @param {number} prescaler UCPD prescaler
 * @param {number} halfbitdiv half bit clock division ratio
 * @returns {number|null}
 */
function helper_ucpd_get_bit_rate(input_clock_hz, prescaler, halfbitdiv) {
  try {
    console.log(
      `[INFO] helper_ucpd_get_bit_rate: input_clock_hz=${input_clock_hz}, prescaler=${prescaler}, halfbitdiv=${halfbitdiv} `
    );

    const  clk = input_clock_hz / prescaler
    const hbitClk = clk / halfbitdiv;

    return Math.round(hbitClk / 2 / 1000);
  } catch (e) {
    console.error(`helper_ucpd_get_bit_rate: ${e}`);
    return null;
  }
}

/**
 * Calculate transition window interval based on clock source, prescaler, half bit division ratio and transition window divison ratio.
 * @param {number} input_clock_hz Input clock in Hz
 * @param {number} prescaler UCPD prescaler
 * @param {number} halfbitdiv half bit clock division ratio
 * @param {number} transwindiv transition window division ratio
 * @returns {number|null}
 */
function helper_ucpd_get_transition_window_interval(input_clock_hz, prescaler, halfbitdiv, transwindiv) {
  try {
    console.log(
      `[INFO] helper_ucpd_get_transition_window_interval: input_clock_hz=${input_clock_hz}, prescaler=${prescaler}, halfbitdiv=${halfbitdiv}, transwindiv=${transwindiv}`
    );

    const  clk = input_clock_hz / prescaler
    const hbitClk = clk / halfbitdiv;

    const timeUsFromDiv = (div, clkHz) => (div / clkHz) * 1e6;

    return Math.round(timeUsFromDiv(transwindiv, hbitClk));
  } catch (e) {
    console.error(`helper_ucpd_get_transition_window_interval: ${e}`);
    return null;
  }
}

/**
 * Calculate inter-frame gap interval based on clock source, prescaler, half bit division ratio and inter frame gap divison ratio.
 * @param {number} input_clock_hz Input clock in Hz
 * @param {number} prescaler UCPD prescaler
 * @param {number} halfbitdiv half bit clock division ratio
 * @param {number} ifrgapdiv inter frame gap division ratio
 * @returns {number|null}
 */
function helper_ucpd_get_inter_frame_gap_interval(input_clock_hz, prescaler, halfbitdiv, ifrgapdiv) {
  try {
    console.log(
      `[INFO] helper_ucpd_get_inter_frame_gap_interval: input_clock_hz=${input_clock_hz}, prescaler=${prescaler}, halfbitdiv=${halfbitdiv}, ifrgapdiv=${ifrgapdiv}`
    );

    const  clk = input_clock_hz / prescaler
    const hbitClk = clk / halfbitdiv;

    const timeUsFromDiv = (div, clkHz) => (div / clkHz) * 1e6;

    return Math.round(timeUsFromDiv(ifrgapdiv, hbitClk));
  } catch (e) {
    console.error(`helper_ucpd_get_inter_frame_gap_interval: ${e}`);
    return null;
  }
}

/**
 * Build multi-line logical-OR combination of HAL_UCPD_RX_ORDERED_SET_* macros
 * from boolean flags in rx_ordered_set object.
 * @param {object} rx_ordered_set
 * @returns {string} Combination of macros with logical OR, example: "HAL_UCPD_RX_ORDERED_SET_SOP | HAL_UCPD_RX_ORDERED_SET_SOP1"
 */
function helper_ucpd_rx_ordered_set_multiline(rx_ordered_set, mode) {
  try {
    const prefix = mode === 'LL' ? 'LL' : 'HAL';

    const mapFlags = {
      sop_enable:         'UCPD_RX_ORDERED_SET_SOP',
      sop1_enable:        'UCPD_RX_ORDERED_SET_SOP1',
      sop2_enable:        'UCPD_RX_ORDERED_SET_SOP2',
      hard_reset_enable:  'UCPD_RX_ORDERED_SET_HARD_RST',
      cable_reset_enable: 'UCPD_RX_ORDERED_SET_CABLE_RST',
      sop1_debug_enable:  'UCPD_RX_ORDERED_SET_SOP1_DEBUG',
      sop2_debug_enable:  'UCPD_RX_ORDERED_SET_SOP2_DEBUG',
      sop_ext1_enable:    'UCPD_RX_ORDERED_SET_SOP_EXT1',
      sop_ext2_enable:    'UCPD_RX_ORDERED_SET_SOP_EXT2',
    };

    // First line: just one space after '='
    const firstLineIndent = ' ';

    // Continuation lines: macros start at column 32 , 31 spaces
    const continuationIndent = ' '.repeat(31);

    const enabled = Object.entries(mapFlags)
      .filter(([propName]) => rx_ordered_set && rx_ordered_set[propName])
      .map(([, macro]) => `${prefix}_${macro}`);

    if (enabled.length === 0) {
      return `${firstLineIndent}${prefix}_UCPD_RX_ORDERED_SET_NONE`;
    }

    if (enabled.length === 1) {
      return `${firstLineIndent}${enabled[0]}`;
    }

    // First line: one space then first macro + " |"
    const firstLine = `${firstLineIndent}${enabled[0]} |`;

    // Other lines: aligned at column 32
    const otherLines = enabled.slice(1).map((macro, idx, arr) => {
      const isLast = idx === arr.length - 1;
      const suffix = isLast ? '' : ' |';
      return `${continuationIndent}${macro}${suffix}`;
    });

    return [firstLine, ...otherLines].join('\n');
  } catch (e) {
    console.error(`helper_ucpd_rx_ordered_set_multiline: ${e}`);
    return null;
  }
}

/**
 * Retrieve all the interruptions set by UCPD but not generated
 * @param {object} nvic_api Getter on NVIC api
 * @param {object} exti_api Getter on EXTI api (not used)
 * @param {object} resource Current resource
 * @param {object} config current configuration of the UCPD
 */
function helper_ucpd_get_irq_handler(nvic_api, exti_api, resource, config) {
  let result = [];
  try {
    console.info(`helper_ucpd_get_irq_handler: resource=${resource}, config=${JSON.stringify(config)}`
    );
 
    /** Check the peripheral interruptions have been generated or not */
    const enableInterruption = config?.system?.nvic?.enable_interruption ?? false;
    if (enableInterruption) {
 
      /** Check if IRQ handler generated is done on code generation or not */
      const irqHandlerGeneration = config.system?.nvic?.irq_handler_generation ?? false;
 
      if (!irqHandlerGeneration) {
        const labels = config.info?.labels || [];
        const nvic_config = nvic_api.getNeedById(config.system?.nvic?.nvic_config?.needs[0].id);
        /** Fill the object to be used for aliases in mx_hal_def.h */
        if (labels.length) {
          let first_label = true;
          for (const label of labels) {
            result.push({
              resource,
              labels,
              first_label,
              alias: label.toUpperCase(),
              nvic_config,
              generated: false
            });
            first_label = false;
          }
        } else {
          result.push({
            resource,
            alias: "",
            nvic_config,
            generated: false
          });
        }
      }
    }
  } catch (e) {
    console.error(`helper_ucpd_get_irq_handler: ${e}`);
  }
  return result;
}

module.exports = {

  helper_ucpd_set_optimum_performance,
  helper_ucpd_get_core_clock_frequency,
  helper_ucpd_get_half_bit_clock_frequency,
  helper_ucpd_get_bit_rate,
  helper_ucpd_get_transition_window_interval,
  helper_ucpd_get_inter_frame_gap_interval,
  helper_ucpd_rx_ordered_set_multiline,
  helper_ucpd_get_irq_handler,
};