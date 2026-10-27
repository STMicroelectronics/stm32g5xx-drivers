/**
  * @file Helpers functions used for FMAC SW component.
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
 * Autofill the base address of the buffer (e.g. X2) Once base address and size of the previous buffer is configured (e.g. X1).
 * @param {string} previous_base - The input base address of the previous buffer.
 * @param {integer} previous_size - The input size of the previous buffer.
 * @returns {string} - Returns the autofilled base address of the next buffer.
 */
function helper_fmac_autofill_base(previous_base, previous_size) {
    try {
        let actuel_base;
        actuel_base = previous_base + previous_size;
        console.info(`helper_fmac_autofill_base: ${actuel_base}`);
        return previous_base;
    } catch (e) {
    console.error(`helper_fmac_autofill_base: ${e}`);
    return {};
    }
}

/**
  * Retrieve all the interruptions set by FMAC but not generated
  * @param {object} nvic_api Getter on NVIC api
  * @param {object} exti_api Getter on EXTI api
  * @param {object} resource Current resource
  * @param {object} config   Current configuration of the FMAC
  * @returns {object}
  */
function helper_fmac_get_irq_handler(nvic_api, exti_api, resource, config) {
  let result = [];
  try {
    console.info(`helper_fmac_get_irq_handler: resource=${resource}, config=${JSON.stringify(config)}`
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
    console.error(`helper_fmac_get_irq_handler: ${e}`);
  }
  return result;
}

module.exports = {
    helper_fmac_autofill_base,
    helper_fmac_get_irq_handler
}