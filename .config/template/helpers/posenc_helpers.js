/**
  * @file Helpers functions used for POSENC SW component
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
 * Renames the trigger if it matches a specific value.
 * @param {string} trigger - The original trigger name.
 * @returns {string} - The renamed trigger if it matches, otherwise the original trigger.
 */
function helper_posenc_rename_trigger(trigger){
  let result = trigger.toUpperCase();

  result = result.replace(/_ +/g, "_");

  try {
    if(result.startsWith("TIM")) {
      if (result.includes("_TGO")) {
        result = result.replace("_TGO", "_TRGO");
      }
      if (result.includes("_CKTIM")) {
        result = result.replace("_CKTIM", "");
      }
    } else if (result.includes("EXT")) {
      result = result.replace("EXT", "EXTI");
      result = result.replace("II", "I");
    }
  } catch (e) {
    console.error(`[ERROR] helper_dac_rename_trigger: ${e}`);
  }
  return result;
}


/**
  * Retrieve all the interruptions set by POSENC but not generated
  * @param {object} nvic_api Getter on NVIC api
  * @param {object} exti_api Getter on EXTI api (not used)
  * @param {object} resource Current resource
  * @param {object} config current configuration of the POSENC
  * @returns {object}
  */
function helper_posenc_get_irq_handler(nvic_api, exti_api, resource, config) {
  let result = [];
  try {
    console.info(`helper_posenc_get_irq_handler: resource= ${resource}, config=${JSON.stringify(config)}`
    );

    /** Reference all the elements which enable the DAC interruptions
     * @type {Array} List of interruptions available for the DAC
     * @property {string} enable Name of the property which enables the interruption
     * @property {string} irq_handler_generation Name of the property which indicates if IRQ handler generation is done or not
     * @property {string} nvic_context Name of the property which contains the NVIC context
     * @property {string} selector Suffix to be added to the alias name (empty if global interrupt, starts with underscore with NVIC selector if not empty)
     */
    const list_interrupts = [
      { enable: "enable_interruption", irq_handler_generation: "irq_handler_generation", nvic_context: "nvic_config", selector: "" },
    ];

    /** Parse the list of interruptions */
    for (let index = 0; index < list_interrupts.length; index++) {
      const element = list_interrupts[index];
      /** Check if interruption has been enabled on the DAC */
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
    console.error(`helper_dac_get_irq_handler: ${e}`);
  }
  return result;
}
module.exports = {
  helper_posenc_get_irq_handler,
  helper_posenc_rename_trigger
};
