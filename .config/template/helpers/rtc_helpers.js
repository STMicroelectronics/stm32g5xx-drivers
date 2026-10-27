/**
 * @file Helpers functions used for RTC SW component
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
 * Calculate the wakeup minimum period based on RTC clock frequency, wakeup divider,
 * asynchronous predivider and synchronous predivider
 * @param {integer} rtc_clock_frequency System clock frequency in Hz
 * @param {string} divider Wakeup divider choose by the user
 * @param {integer} asynchronous_predivider Asynchronous divider set by the user
 * @param {integer} synchronous_predivider Synchronous divider set by the user
 * @returns {integer} Wakeup minimum period in second or microsecond
 */
function helper_rtc_compute_wakeup_minimum_period(
  mode,
  rtc_clock_frequency,
  divider,
  asynchronous_predivider,
  synchronous_predivider,
  bcd_seconds_increment
){
  /* Default value : 1s */
  let result = 1;
  var period = 0;

  try {
    switch (divider) {
      case "RTCCLK_DIV16":
        divider = 16;
        /* Calculate the minimum period in microsecond */
        period = (divider * 1000000) / rtc_clock_frequency;
        break;
      case "RTCCLK_DIV8":
        divider = 8;
        /* Calculate the minimum period in microsecond */
        period = (divider * 1000000) / rtc_clock_frequency;
        break;
      case "RTCCLK_DIV4":
        divider = 4;
        /* Calculate the minimum period in microsecond */
        period = (divider * 1000000) / rtc_clock_frequency;
        break;
      case "RTCCLK_DIV2":
        divider = 2;
        /* Calculate the minimum period in microsecond */
        period = (divider * 1000000) / rtc_clock_frequency;
        break;
      case "BCD_UPDATE":
      case "BCD_UPDATE_ADD_1BIT":
        if (mode === "BCD") {
          divider = (asynchronous_predivider) * (synchronous_predivider);
        }
        else {
          divider = (asynchronous_predivider) * (Math.pow(2, bcd_seconds_increment));
        }
        /* Calculate the minimum period in second */
        period = divider / rtc_clock_frequency;
        break;
      default:
        console.info("Wrong divider.");
        break;
    }

    /* Return the output frequency */
    result = parseFloat(period.toFixed(3));
  } catch (e) {
    console.error(`helper_rtc_compute_wakeup_minimum_period: ${e}`);
  }
  return result;
}

/**
  * Retrieve all the interruptions set by RTC but not generated
  * @param {object} nvic_api Getter on NVIC api
  * @param {object} exti_api Getter on EXTI api (may not used)
  * @param {object} resource Current resource
  * @param {object} config current configuration of the RTC
  * @returns {object}
  */
function helper_rtc_get_irq_handler(nvic_api, exti_api, resource, config) {
  let result = [];
  try {
    // console.info(//   `helper_rtc_get_irq_handler: resource= ${resource}, config=${JSON.stringify(config)}`
    // );
    /** Reference all the elements which enable the RTC interruptions
     * @type {Array} List of interruptions available for the RTC
     * @property {string} enable Name of the property which enables the interruption
     * @property {string} irq_handler_generation Name of the property which indicates if IRQ handler generation is done or not
     * @property {string} nvic_context Name of the property which contains the NVIC context
     * @property {string} selector Suffix to be added to the alias name (empty if global interrupt, starts with underscore with NVIC selector if not empty)
     */
    const list_interrupts = [
      { enable: "enable_interruption", irq_handler_generation: "irq_handler_generation", nvic_context: "irq_line_priority", selector: "" },
      { enable: "enable_interruption", irq_handler_generation: "irq_handler_generation", nvic_context: "irq_line_priority_s", selector: "_S" },
    ];

    /** Parse the list of interruptions */
    for (let index = 0; index < list_interrupts.length; index++) {
      const element = list_interrupts[index];
      /** Check if interruption has been enabled on the RTC */
      const enableInterruption = config?.system?.nvic?.[element['enable']] ?? false;
      if (!enableInterruption) continue;

      const nvicContext = config.system?.nvic?.[element['nvic_context']];
      if (!nvicContext?.needs?.length) continue;

      /** Check if IRQ handler generated is done on code generation or not */
      const irqHandlerGeneration = config.system?.nvic?.[element['irq_handler_generation']] ?? false;

      if (!irqHandlerGeneration) {
        const labels = config.info?.labels || [];
        const nvic_config = nvic_api.getNeedById(nvicContext.needs[0].id);
        /** Fill the object to be used for aliases in mx_hal_def.h */
        if (labels.length) {
          let first_label = true;
          for (const label of labels) {
            result.push({
              resource,
              labels,
              first_label,
              alias: label.toUpperCase() + element['selector'],
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
    console.error(`helper_rtc_get_irq_handler: ${e}`);
  }
  return result;
}

/**
 * Classifies attribute settings across all access level entries.
 * Returns an object with three booleans:
 *  - allPositive: true only if every entry is 1
 *  - allNegative: true only if every entry is 0
 *  - allConsistent: true if all entries are either allPositive or allNegative
 * Empty or invalid inputs return all flags false to avoid vacuous truth.
 * @param {object} access_levels
 * @returns {{allPositive: boolean, allNegative: boolean, allConsistent: boolean}}
 */
function helper_rtc_attribute_all_states(access_levels) {
  const result = { allPositive: false, allNegative: false, allConsistent: false };
  const map_attribute = {
    SEC: 1,
    PRIV: 1,
    NSEC: 0,
    NPRIV: 0,
  };
  try {
    const values = Object.values(access_levels ?? {});

    let allPositive = true;
    let allNegative = true;
    for (let v of values) {
      if (typeof v === "boolean") {
        v = Number(v);
      }
      if (typeof v === "string") {
        v = map_attribute[v];
      }
      if (v !== 1) {
        allPositive = false;
      }
      if (v !== 0) {
        allNegative = false;
      }
      if (!allPositive && !allNegative) {
        break;
      }
    }

    result.allPositive = allPositive;
    result.allNegative = allNegative;
    result.allConsistent = allPositive || allNegative;
    console.info(`helper_rtc_attribute_all_states result = ${JSON.stringify(result)}`);
    return result;
  } catch (e) {
    console.error(`helper_rtc_attribute_all_states: ${e}`);
    return result;
  }
}

/**
 * Get security, privilege, public and lock items based on layer, security privilege, and access levels.
 * @param {string} layer
 * @param {string} attribute PRIV or SEC
 * @param {Array<string>} access_levels
 * @returns {Array<string>} The selected attribute items
 */
function helper_rtc_get_attribute_items(
  layer,
  attribute,
  access_levels
) {
  try {
    console.info("helper_rtc_get_attribute_items:", access_levels);

    let result = "";
    const map_defined_attribute_items = {
      global_protection: layer + "_RTC_" + attribute + "_ITEM_ALL",
      initialization_protection: layer + "_RTC_" + attribute + "_ITEM_INIT",
      calibration_and_time_adjustment_protection: layer + "_RTC_" + attribute + "_ITEM_CAL",
      timestamp_protection: layer + "_RTC_" + attribute + "_ITEM_TS",
      wake_up_timer_protection: layer + "_RTC_" + attribute + "_ITEM_WUT",
      alarm_b_protection: layer + "_RTC_" + attribute + "_ITEM_ALRB",
      alarm_a_protection: layer + "_RTC_" + attribute + "_ITEM_ALRA",
    };
    const map_attribute = {
      SEC: 1,
      PRIV: 1,
      NSEC: 0,
      NPRIV: 0
    };
    let next_element = 0;
    for (const key in access_levels) {
      if (!Object.hasOwn(access_levels, key)) continue;
      let element = access_levels[key];
      if (typeof element === "boolean") {
        element = Number(element);
      }
      if (typeof element === "string") {
        element = map_attribute[element];
      }
      if (element > 0) {
        if (next_element > 0) {
          result += " | ";
        }
        result += map_defined_attribute_items[key];
        next_element = 1;
      }
    }
    return result;
  } catch (error) {
    console.error(`[ERROR] helper_ltdc_get_attribute_items: ${error.message}`);
    return false;
  }
}

/**
 * Build the RTC alarm mask expression used by LL_RTC_ALM_SetConfigDateTime.
 * @param {boolean} mask_date_week_day
 * @param {boolean} mask_hours
 * @param {boolean} mask_minutes
 * @param {boolean} mask_seconds
 * @returns {string}
 */
function helper_rtc_get_alarm_mask(
  mask_date_week_day,
  mask_hours,
  mask_minutes,
  mask_seconds
) {
  try {
    const masks = [];

    if (mask_date_week_day) {
      masks.push("LL_RTC_ALMA_MASK_DATEWEEKDAY");
    }
    if (mask_hours) {
      masks.push("LL_RTC_ALMA_MASK_HOURS");
    }
    if (mask_minutes) {
      masks.push("LL_RTC_ALMA_MASK_MINUTES");
    }
    if (mask_seconds) {
      masks.push("LL_RTC_ALMA_MASK_SECONDS");
    }

    if (masks.length === 0) {
      return "LL_RTC_ALMA_MASK_NONE";
    }
    if (masks.length === 4) {
      return "LL_RTC_ALMA_MASK_ALL";
    }

    return masks.join(" | ");
  } catch (error) {
    console.error(`helper_rtc_get_alarm_mask: ${error.message}`);
    return "LL_RTC_ALMA_MASK_NONE";
  }
}

module.exports = {
  helper_rtc_compute_wakeup_minimum_period,
  helper_rtc_get_irq_handler,
  helper_rtc_attribute_all_states,
  helper_rtc_get_attribute_items,
  helper_rtc_get_alarm_mask
};
