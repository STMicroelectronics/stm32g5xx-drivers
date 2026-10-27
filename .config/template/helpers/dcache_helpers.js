/**
 * @file DCACHE Helpers functions to provide service to the HAL components
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
 * @brief Retrieve the list of enabled DCACHE monitors from the configuration for the specified layer.
 *
 * @param {object} monitors    Object representing DCACHE monitor flags (e.g., read_hit_monitor, write_hit_monitor, etc.).
 * @param {string} layer       The layer to use for flag names ("HAL" or "LL").
 *
 * @returns {string} Bitwise OR '|' joined string of enabled monitor flags suitable for C function call.
 *                   Returns "HAL_DCACHE_MONITOR_ALL" or "LL_DCACHE_MONITOR_ALL" if all monitors are enabled.
 *                   Returns empty string if none enabled or invalid layer.
 *
 * @note
 * - Only monitors set to true are included in the returned list.
 * - This function simplifies usage by returning *_DCACHE_MONITOR_ALL when applicable.
 *
 * Usage:
 * - Use the returned string as an argument list for functions like HAL_DCACHE_EnableMonitors or LL_DCACHE_EnableMonitors.
 */
function helper_dcache_get_monitor_list(monitors, layer) {
  console.info(`helper_dcache_get_monitor_list`);

  let enabledMonitors = [];

  try {
    console.info(`helper_dcache_get_monitor_list: monitors=${JSON.stringify(monitors)}, layer=${layer}`);

    if (typeof monitors !== 'object' || monitors === null) {
      console.warn(`helper_dcache_get_monitor_list: monitors is not a valid object`);
      return '';
    }

    if (typeof layer !== 'string') {
      console.warn(`helper_dcache_get_monitor_list: layer is not a valid string`);
      return '';
    }

    // Define monitor flag maps for HAL and LL layers
    const monitorFlagMaps = {
      HAL: {
        read_hit_monitor: 'HAL_DCACHE_MONITOR_READ_HIT',
        write_hit_monitor: 'HAL_DCACHE_MONITOR_WRITE_HIT',
        read_miss_monitor: 'HAL_DCACHE_MONITOR_READ_MISS',
        write_miss_monitor: 'HAL_DCACHE_MONITOR_WRITE_MISS',
        ALL: 'HAL_DCACHE_MONITOR_ALL'
      },
      LL: {
        read_hit_monitor: 'LL_DCACHE_MONITOR_READ_HIT',
        write_hit_monitor: 'LL_DCACHE_MONITOR_WRITE_HIT',
        read_miss_monitor: 'LL_DCACHE_MONITOR_READ_MISS',
        write_miss_monitor: 'LL_DCACHE_MONITOR_WRITE_MISS',
        ALL: 'LL_DCACHE_MONITOR_ALL'
      }
    };

    const flagMap = monitorFlagMaps[layer.toUpperCase()];
    if (!flagMap) {
      console.warn(`helper_dcache_get_monitor_list: unsupported layer '${layer}'`);
      return '';
    }

    // Iterate over the monitor flags and collect enabled ones
    for (const key of ['read_hit_monitor', 'write_hit_monitor', 'read_miss_monitor', 'write_miss_monitor']) {
      if (monitors[key] === true) {
        enabledMonitors.push(flagMap[key]);
      }
    }

    if (enabledMonitors.length === 4) {
      // All monitors enabled
      return flagMap.ALL;
    }

  } catch (e) {
    console.error(`helper_dcache_get_monitor_list: ${e}`);
    return '';
  }

  const result = enabledMonitors.join(' | ');

  console.info(`helper_dcache_get_monitor_list: result=${result}`);

  return result;
}

/**
  * Retrieve all the interruptions set by DCACHE but not generated
  * @param {object} nvic_api Getter on NVIC api
  * @param {object} resource Current resource
  * @param {object} config current configuration of the DCACHE
  * @returns {object}
 */
function helper_dcache_get_irq_handler(nvic_api, exti_api, resource, config) {
  let result = [];
  try {
    console.info(`helper_dcache_get_irq_handler: resource= ${resource}, config=${JSON.stringify(config)}`
    );

    /** Reference all the elements which enable the DCACHE interruptions */
    const list_interrupts = [
      { enable: "enable_interruption", irq_handler_generation: "irq_handler_generation", nvic_context: "irq_config1" }
    ];

    /** Parse the list of interruptions */
    for (let index = 0; index < list_interrupts.length; index++) {
      const element = list_interrupts[index];
      /** Check if interruption has beenn enabled on the DCACHE */
      const enableInterruption = config?.system?.nvic?.[element['enable']] ?? false;
      if (!enableInterruption) continue;

      /** Check if IRQ handler generated is done on code generation or not */
      const irqHandlerGeneration = config.system?.nvic?.[element['irq_handler_generation']] ?? false;

      if (!irqHandlerGeneration) {
        const labels = config.info?.labels || [];
        const nvic_config = nvic_api.getNeedById(config.system?.nvic?.[element['nvic_context']].needs[0].id);
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
    console.error(`helper_dcache_get_irq_handler: ${e}`);
  }
  return result;
}

/**
 * @brief Retrieve the list of enabled DCACHE ECC interrupts for the specified layer.
 *
 * @param {object} interrupts    Object representing DCACHE ECC interrupt flags:
 *                               { single_ecc_error: boolean, double_ecc_error: boolean }.
 * @param {string} layer       The layer to use for flag names ("HAL" or "LL").
 *
 * @returns {string} Bitwise OR '|' joined string of enabled ECC interrupt flags suitable for C function calls.
 *                   Returns "HAL_DCACHE_IT_ECC_ALL" when both HAL ECC interrupts are enabled.
 *                   LL has no ALL macro; returns joined flags only.
 *                   Returns empty string if none enabled or invalid layer.
 *
 * @note
 * - Only ECC interrupts set to true are included in the returned list.
 * - This function simplifies usage by returning *_DCACHE_ECC_ALL when applicable.
 */
function helper_dcache_get_ecc_interrupt(interrupts, layer) {
  console.info(`helper_dcache_get_ecc_interrupt`);

  let enabledInterrupts = [];

  try {
    console.info(`helper_dcache_get_ecc_interrupt: interrupts=${JSON.stringify(interrupts)}, layer=${layer}`);

    if (typeof interrupts !== 'object' || interrupts === null) {
      console.warn(`helper_dcache_get_ecc_interrupt: interrupts is not a valid object`);
      return '';
    }

    if (typeof layer !== 'string') {
      console.warn(`helper_dcache_get_ecc_interrupt: layer is not a valid string`);
      return '';
    }

    // Define ECC interrupt flag maps for HAL and LL layers (DCACHE)
    const interruptFlagMaps = {
      HAL: {
        single_ecc_error: 'HAL_DCACHE_IT_ECC_SINGLE',
        double_ecc_error: 'HAL_DCACHE_IT_ECC_DOUBLE',
        ALL: 'HAL_DCACHE_IT_ECC_ALL'
      },
      LL: {
        single_ecc_error: 'LL_DCACHE_IER_SERRIE',
        double_ecc_error: 'LL_DCACHE_IER_DERRIE'
      }
    };

    const flagMap = interruptFlagMaps[layer.toUpperCase()];
    if (!flagMap) {
      console.warn(`helper_dcache_get_ecc_interrupt: unsupported layer '${layer}'`);
      return '';
    }

    // Iterate over the ECC interrupt flags and collect enabled ones
    for (const key of ['single_ecc_error', 'double_ecc_error']) {
      if (interrupts[key] === true) {
        enabledInterrupts.push(flagMap[key]);
      }
    }

    if (enabledInterrupts.length === 2 && layer.toUpperCase() === 'HAL') {
      // Both ECC interrupts enabled for HAL -> use ALL
      return interruptFlagMaps.HAL.ALL;
    }

  } catch (e) {
    console.error(`helper_dcache_get_ecc_interrupt: ${e}`);
    return '';
  }

  const result = enabledInterrupts.join(' | ');

  console.info(`helper_dcache_get_ecc_interrupt: result=${result}`);

  return result;
}

module.exports = {
  helper_dcache_get_ecc_interrupt,
  helper_dcache_get_monitor_list,
  helper_dcache_get_irq_handler
};
