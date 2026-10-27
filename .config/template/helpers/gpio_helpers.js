/**
  * @file GPIO Helpers functions to provide service to the HAL components
  * @attention
  *
  * Copyright (c) 2026 STMicroelectronics.
  * All rights reserved.
  *
  * This software is licensed under terms that can be found in the LICENSE file
  * in the root directory of this software component.
  * If no LICENSE file comes with this software, it is provided AS-IS.
  *
**/

/** @global */
const map_mode = {
  ANALOG: "HAL_GPIO_MODE_ANALOG",
  INPUT: "HAL_GPIO_MODE_INPUT",
  OUTPUT: "HAL_GPIO_MODE_OUTPUT",
  ALTERNATE: "HAL_GPIO_MODE_ALTERNATE",
};

const map_output = {
  OPENDRAIN: "HAL_GPIO_OUTPUT_OPENDRAIN",
  PUSHPULL: "HAL_GPIO_OUTPUT_PUSHPULL",
};

const map_speed = {
  FREQ_LOW: "HAL_GPIO_SPEED_FREQ_LOW",
  FREQ_MEDIUM: "HAL_GPIO_SPEED_FREQ_MEDIUM",
  FREQ_HIGH: "HAL_GPIO_SPEED_FREQ_HIGH",
  FREQ_VERY_HIGH: "HAL_GPIO_SPEED_FREQ_VERY_HIGH",
};

const map_pull = {
  NO: "HAL_GPIO_PULL_NO",
  UP: "HAL_GPIO_PULL_UP",
  DOWN: "HAL_GPIO_PULL_DOWN",
};

const map_lpgio = {
  PA1: 0,
  PA3: 1,
  PA6: 2,
  PB1: 3,
  PB10: 4,
  PC2: 5,
  PD13: 6,
  PD2: 7,
  PC10: 8,
  PB0: 9,
  PC12: 10,
  PB3: 11,
  PB3: 12,
  PE0: 13,
  PE2: 14,
  PE3: 15,
};

/**
 * Retrieve all the EXTI lines configured inside the GPIO SW component.
 * @param {string} layer     Current layer (HAL or LL)
 * @param {object} gpio_ctxt GPIO configuration of a pin
 * @param {object} pin       PIN configuration retrieved thanks to @ref @root.pinoutAPI.getPinData getter
 * @param {object} exti_object current id list of EXTI (undefined if 1st call)
 * @returns {object} EXTI object
 * {
 *     "list_exti": [
 *         "0",
 *         "8"
 *     ],
 *     "list_uuid": [
 *         {
 *             "layer": "HAL",
 *             "id": "<uuid-#1>"
 *         },
 *         {
 *             "layer": "HAL",
 *             "id": "<uuid-#2>"
 *         },
 *         {
 *             "layer": "LL",
 *             "id": "<uuid-#3>"
 *         }
 *     ]
 * }
 */
function helper_gpio_retrieve_exti_object(layer, gpio_ctxt, pin, exti_object) {
  let result = { list_exti: [], list_uuid: [] };
  try {
    console.info(`helper_gpio_retrieve_exti_object: gpio_ctxt=${JSON.stringify(
        gpio_ctxt)}, exti_object=${JSON.stringify(exti_object)}, pin=${JSON.stringify(
        pin
      )}`
    );
    if (exti_object !== "undefined") {
      result = exti_object;
    }
    let gpio_pad = pin;
    /** Save only a unique list of EXTI for HAL only */
    let exti_name = "EXTI" + gpio_pad["index"].toString();
    if (layer === "HAL" && result["list_exti"].indexOf(exti_name) < 0) {
      result["list_exti"].push(exti_name);
    }
    let gpio_config = gpio_ctxt["basic"];
    /** Save only a unique list of uuid for all the config */
    if (
      gpio_config.hasOwnProperty("exti_config") &&
      gpio_config["exti_config"].hasOwnProperty("needs")
    ) {
      result.list_uuid.push({
        layer: layer,
        id: gpio_config["exti_config"]["needs"][0]["id"],
      });
    }
    /* Generate only IRQ handler for */
  } catch (e) {
    console.error(`helper_gpio_retrieve_exti_object: ${e}`);
  }
  //console.info(`helper_gpio_retrieve_exti_object: result=${JSON.stringify(result)}`);
  return result;
}

/**
 * Convert the GPIO user settings to the GPIO data to be used inside mx_gpio_template.c.hbs template
 * @param {object} config current config of the pin
 * {
 *  mode: 'OUTPUT',
 *  pull: 'NO',
 *  enable_exti: true,
 *  fast_mode: 'Managed in SBS panel',
 *  output_active_state: 'SET',
 *  output_init_state: 'RESET',
 *  output_type: 'PUSHPULL',
 *  speed: 'LOW',
 *  exti_config: { needs: [ [Object] ] }
 *  }
 * @param {object} pin PIN configuration retrieved thanks to @root.pinoutAPI.getPinData getter
 * @param {object} gpio_config HAL parameters to be managed inside the generated code (undefined if 1st call)
 *  {
 *    "list_port": [
 *        "D"
 *    ],
 *    "list_config_pins": [
 *    {
 *       "mode": "OUTPUT",
 *       "speed": "LOW",
 *       "output_type": "PUSHPULL",
 *       "pull": "NO",
 *       "port": "B",
 *       "pin": [
 *          "6"
 *       ],
 *       "exti_cfg": [
 *          {
 *             "pin": "6",
 *             "port": "B",
 *             "exti_enabled": true,
 *             "config": {
 *                "needs": [
 *                   {
 *                      ...
 *                   }
 *                ]
 *             }
 *          }
 *       ],
 *       "signalName": [],
 *       "label_name": [],
 *       "userLabels": [],
 *       "output_init_state": "RESET",
 *       "output_active_state": "SET",
 *       "enable_exti": true,
 *       "aliases": {
 *          "other_labels": [
 *            ["GPIO_USER_2", "GPIO_USER_3"],
 *            ["GPIO_USER_2B"],
 *            []
 *          ],
 *          "master_label": ["GPIO_USER", "GPIO_USER_B", ""]
 *         }
 *       }
 *     ]
 *   ]
 * }
 * @returns {object} HAL parameters to be set in the mx_gpio_template.c.hbs file (based on gpio_config object)
 */
function helper_gpio_get_gpioconfig_standalone_object(
  label_name,
  config,
  pin,
  gpio_config
) {
  let result = { list_port: [], list_config_pins: [] };
  try {
    console.info(`helper_gpio_get_gpioconfig_standalone_object: config=${JSON.stringify(
        config)}, pin=${JSON.stringify(pin)}, gpio_config=${JSON.stringify(
        gpio_config
      )}`
    );

    // Reuse existing aggregated object if provided (and not the literal string "undefined")
    if (gpio_config !== undefined && gpio_config !== "undefined") {
      result = gpio_config;
    }

    // Defensive copies to avoid mutating caller's objects unexpectedly
    let current_config = { ...config };
    let current_gpio = { ...pin };

    // Normalize property names to match grouping keys
    if (current_config.maxSpeed && !current_config.speed) {
      current_config.speed = current_config.maxSpeed;
    }
    if (current_config.outputType && !current_config.output_type) {
      current_config.output_type = current_config.outputType;
    }
    if (current_config.pullMode && !current_config.pull) {
      current_config.pull = current_config.pullMode;
    }

    // Derive signal name if available (store later as array for grouping)
    let signalName = undefined;
    if (pin && pin.signal && pin.signal.name) {
      signalName = pin.signal.name;
    } else if (current_config.signalName) {
      // Could already be set by caller
      signalName = current_config.signalName;
    }

    // Capture HW labels (pin.labels) and SW labels (label_name arg)
    let hw_labels = Array.isArray(pin?.labels) ? pin.labels : (pin?.labels ? [pin.labels] : []);
    let sw_labels = Array.isArray(label_name) ? label_name : (label_name ? [label_name] : []);

    // Per-pin aliases (master + secondaries) derived from the labels
    const per_pin_aliases = helper_gpio_create_aliases(hw_labels, sw_labels);
    const per_pin_master_label = per_pin_aliases?.master_label ? String(per_pin_aliases.master_label) : "";
    const per_pin_other_labels = Array.isArray(per_pin_aliases?.other_labels)
      ? per_pin_aliases.other_labels
      : [];

    // Ensure list_port uniqueness
    if (current_gpio.port && !result.list_port.includes(current_gpio.port)) {
      result.list_port.push(current_gpio.port);
    }

    // Prepare EXTI cfg for this pin (if present in config)
    const exti_cfg_entry = {
      pin: current_gpio.index !== undefined ? String(current_gpio.index) : undefined,
      port: current_gpio.port,
      exti_enabled: current_config.enable_exti,
      config: current_config.exti_config,
    };

    // Attempt to find an existing grouped configuration matching key fields
    const existing = result.list_config_pins.find((cfg) =>
      cfg.port === current_gpio.port &&
      cfg.mode === current_config.mode &&
      cfg.speed === current_config.speed &&
      cfg.output_type === current_config.output_type &&
      cfg.af === current_config.af &&
      cfg.pull === current_config.pull &&
      cfg.output_init_state === current_config.output_init_state
    );

    if (existing) {
      // Merge pin index
      const idxStr = String(current_gpio.index);
      const isNewPin = !existing.pin.includes(idxStr);
      if (isNewPin) {
        existing.pin.push(idxStr);
      }
      // Merge EXTI config list
      existing.exti_cfg.push(exti_cfg_entry);
      // Merge signal name
      if (signalName) {
        existing.signalName.push(signalName);
      }
      // Merge SW labels (as array-of-arrays) if provided
      if (sw_labels.length) {
        existing.label_name = existing.label_name || [];
        existing.label_name.push(sw_labels);
      }
      // Merge HW labels (as array-of-arrays) if provided
      if (hw_labels.length) {
        existing.userLabels = existing.userLabels || [];
        existing.userLabels.push(hw_labels);
      }
      // Accumulate aliases per pin (aligned with existing.pin order)
      if (!existing.aliases || typeof existing.aliases !== "object") {
        existing.aliases = { master_label: [], other_labels: [] };
      }
      if (!Array.isArray(existing.aliases.master_label)) existing.aliases.master_label = [];
      if (!Array.isArray(existing.aliases.other_labels)) existing.aliases.other_labels = [];
      if (isNewPin) {
        existing.aliases.master_label.push(per_pin_master_label);
        existing.aliases.other_labels.push(per_pin_other_labels);
      }
    } else {
      // Create new grouped configuration entry
      const new_cfg = {
        // Core grouping fields
        mode: current_config.mode,
        speed: current_config.speed,
        output_type: current_config.output_type,
        pull: current_config.pull,
        af: current_config.af,
        port: current_gpio.port,
        // Arrays holding grouped data
        pin: [String(current_gpio.index)],
        exti_cfg: [exti_cfg_entry],
        signalName: signalName ? [signalName] : [],
        // Labels (stored as array of arrays to align with other helpers)
        label_name: sw_labels.length ? [sw_labels] : [],
        userLabels: hw_labels.length ? [hw_labels] : [],
        // Preserve other original configuration flags/settings
        output_init_state: current_config.output_init_state,
        output_active_state: current_config.output_active_state,
        enable_exti: current_config.enable_exti,
        // Aliases are stored per pin, aligned with the grouped pin list
        aliases: {
          master_label: [per_pin_master_label],
          other_labels: [per_pin_other_labels],
        },
      };
      result.list_config_pins.push(new_cfg);
    }
  } catch (e) {
    console.error(`helper_gpio_get_gpioconfig_standalone_object: ${e}`);
  }
  return result;
}


/**
 * Create the standalone GPIO aliases based on HW and SW labels.
 * @param {Array} hwLabels: Array of hardware label strings (or arrays)
 * @param {Array} swLabels: Array of software label strings (or arrays)
 * @returns {object} Standalone GPIO alias object
 * {"other_labels":["GPIO_ALT"],"master_label":"GPIO_USER"}
 */
function helper_gpio_create_aliases(hwLabels, swLabels) {
  // Flatten arrays (only 1 level deep) to handle both flat arrays and arrays of arrays
  const flatten = (arr) => (Array.isArray(arr) ? arr.flat() : []);
  let flat_hwLabels = flatten(hwLabels);
  let flat_swLabels = flatten(swLabels);

  // Initialize result object
  let result = { other_labels: [] };
  let master_label = null;

  try {
    // Prefer the first HW label when it exists.
    if (flat_hwLabels.length > 0 && flat_hwLabels[0] !== "") {
      master_label = flat_hwLabels[0].toUpperCase();
    }
    // Otherwise, use the first SW label when it exists.
    else if (flat_swLabels.length > 0 && flat_swLabels[0] !== "") {
      master_label = flat_swLabels[0].toUpperCase();
    }

    // Build the complete standalone GPIO label set around the preferred label.
    if (master_label) {
      result.master_label = master_label;
      // Combine HW and SW labels, filter empty/preferred duplicates, and convert to uppercase.
      const all_labels = [...flat_hwLabels, ...flat_swLabels];
      result.other_labels = all_labels
        .filter((label) => label && label.toUpperCase() !== master_label)
        .map((label) => label.toUpperCase());
    }
    // Uncomment for debugging:
    // console.info(`helper_gpio_create_aliases: result=${JSON.stringify(result)}`);
  } catch (e) {
    // Log any errors that occur during processing
    console.error(`helper_gpio_create_aliases: ${e}`);
  }
  return result;
}

/**
 * Create the GPIO labels used by a peripheral (PPP) from software labels only.
 * The first label is the preferred GPIO label used in generated code.
 * @param {Array|string} swLabels Software label string(s), optionally nested
 * @returns {Array<string>} Uppercase GPIO labels, with the preferred label first
 */
function helper_gpio_create_ppp_gpio_aliases(swLabels) {
  try {
    const flat_sw_labels = Array.isArray(swLabels)
      ? swLabels.flat()
      : swLabels !== undefined && swLabels !== null
        ? [swLabels]
        : [];
    const seen_gpio_labels = new Set();
    return flat_sw_labels
      .filter((label) => label !== undefined && label !== null && String(label) !== "")
      .map((label) => String(label).toUpperCase())
      .filter((label) => {
        if (seen_gpio_labels.has(label)) return false;
        seen_gpio_labels.add(label);
        return true;
      });
  } catch (e) {
    console.error(`helper_gpio_create_ppp_gpio_aliases: ${e}`);
    return [];
  }
}

function helper_gpio_add_pad_right(str, length) {
  str = String(str);
  while (str.length < length) {
    str = str + " ";
  }
  return str;
}

/**
 * Merge/accumulate GPIO EXTI configurations.
 * @detail This helper is meant to be called iteratively from templates to build one merged
 *         EXTI config array (LL path) instead of calling the EXTI partial multiple times.
 *         Input items are expected to have the shape:
 *         { pin: string, port: string, exti_enabled: boolean, config: { needs: [{id:string}, ...] } }
 * @param {Array|object|string|undefined} all_exti_cfg Accumulator array (or "undefined" on first call)
 * @param {Array|object|string|undefined} new_exti_cfg New config (often the per-pin/per-group exti_cfg array)
 * @returns {Array} Merged EXTI configuration array
 */
function helper_gpio_merge_exti_cfg(all_exti_cfg, new_exti_cfg) {
  const normalizeToArray = (value) => {
    if (value === undefined || value === null || value === "undefined") return [];
    if (Array.isArray(value)) return value;
    return [value];
  };

  const cloneNeeds = (needs) => {
    if (!Array.isArray(needs)) return [];
    return needs
      .filter((n) => n && typeof n === "object" && n.id !== undefined && n.id !== null)
      .map((n) => ({ id: n.id }));
  };

  const mergeNeedsUnique = (dstNeeds, srcNeeds) => {
    const result = Array.isArray(dstNeeds) ? [...dstNeeds] : [];
    const seen = new Set(
      result
        .filter((n) => n && typeof n === "object" && n.id !== undefined && n.id !== null)
        .map((n) => String(n.id))
    );

    (Array.isArray(srcNeeds) ? srcNeeds : []).forEach((n) => {
      if (!n || typeof n !== "object" || n.id === undefined || n.id === null) return;
      const id = String(n.id);
      if (seen.has(id)) return;
      seen.add(id);
      result.push({ id: n.id });
    });

    return result;
  };

  // Start from the existing accumulator
  const result = [];
  normalizeToArray(all_exti_cfg)
    .flat(1)
    .forEach((entry) => {
      if (!entry || typeof entry !== "object") return;
      const cloned = {
        ...entry,
        config: entry.config
          ? { ...entry.config, needs: cloneNeeds(entry.config.needs) }
          : entry.config,
      };
      result.push(cloned);
    });

  // Merge incoming entries
  normalizeToArray(new_exti_cfg)
    .flat(1)
    .forEach((incoming) => {
      if (!incoming || typeof incoming !== "object") return;

      const pin = incoming.pin;
      const port = incoming.port;

      // Only merge entries that have a usable key
      const canKey = pin !== undefined && pin !== null && port !== undefined && port !== null;
      const key = canKey ? `${String(port)}:${String(pin)}` : undefined;

      const existing =
        key !== undefined
          ? result.find(
              (e) =>
                e &&
                typeof e === "object" &&
                `${String(e.port)}:${String(e.pin)}` === key
            )
          : undefined;

      if (existing) {
        existing.exti_enabled = Boolean(existing.exti_enabled || incoming.exti_enabled);
        if (existing.config === undefined || existing.config === null) {
          existing.config = incoming.config
            ? { ...incoming.config, needs: cloneNeeds(incoming.config.needs) }
            : incoming.config;
        } else {
          // Merge needs (EXTI partial iterates over config.needs)
          const existingNeeds = existing.config.needs;
          const incomingNeeds = incoming.config?.needs;
          existing.config.needs = mergeNeedsUnique(existingNeeds, incomingNeeds);
        }
      } else {
        result.push({
          ...incoming,
          exti_enabled: Boolean(incoming.exti_enabled),
          config: incoming.config
            ? { ...incoming.config, needs: cloneNeeds(incoming.config.needs) }
            : incoming.config,
        });
      }
    });

  return result;
}

/**
 * Retrieve from the GPIO context the list of GPIO pins grouped by their port.
 * @detail This helper is used to accumulate and group GPIO pin indices by their port,
 *         based on the GPIO context of each pin. It is typically called iteratively
 *         (e.g., in a Handlebars loop) to build up a list of grouped pins for a given peripheral.
 *         The result is intended for use in GPIO_HAL_partial deinit code generation.
 * @param {object} gpio_ctxt - GPIO context for a single pin (as returned by pinoutAPI.getNeedById).
 * @param {Array} groupedPins - Accumulator array of grouped pins by port (should be undefined or [] on first call).
 * @returns {Array} Array of objects, each with the shape { port: string, pins: number[] },
 *                  suitable for use in mx_pppi_template.c.hbs via GPIO_HAL_partial.hbs.
 */
function helper_gpio_group_pins_by_port(cfg, grouped, layer) {
  const result = Array.isArray(grouped) ? grouped : [];

  try {
    if (!cfg || typeof cfg !== "object") return result;
    const port = cfg.port;
    const pins = Array.isArray(cfg.pin) ? cfg.pin : [];
    const gpioLabels = Array.isArray(cfg.aliases?.master_label)
      ? cfg.aliases.master_label
      : [];

    if (port === undefined || port === null) return result;

    const fallbackPrefix = layer === "LL" ? "LL_GPIO_PIN_" : "HAL_GPIO_PIN_";
    const defaultPortParam = layer === "LL" ? `GPIO${port}` : `HAL_GPIO${port}`;

    let portEntry = result.find((e) => e && typeof e === "object" && e.port === port);
    if (!portEntry) {
      portEntry = { port: port, port_param: defaultPortParam, _pinItems: [] };
      result.push(portEntry);
    }
    if (!Array.isArray(portEntry._pinItems)) portEntry._pinItems = [];

    pins.forEach((pinStr, idx) => {
      if (pinStr === undefined || pinStr === null) return;
      const indexNum = Number(pinStr);
      const label = gpioLabels[idx];
      const hasLabel = typeof label === "string" && label.length > 0;
      const macro = hasLabel ? `${label}_PIN` : `${fallbackPrefix}${pinStr}`;

      // Uniqueness by port+pin number
      if (portEntry._pinItems.some((p) => p && p.index === indexNum)) return;
      portEntry._pinItems.push({ index: indexNum, macro, label: hasLabel ? label : "" });
    });

    // Sort by pin index for stable output
    portEntry._pinItems.sort((a, b) => (a.index ?? 0) - (b.index ?? 0));
    portEntry.pins = portEntry._pinItems.map((p) => p.macro);

    // If (and only if) there is exactly one pin for this port and it has a GPIO label,
    // use the alias port macro in generated calls.
    if (portEntry._pinItems.length === 1 && portEntry._pinItems[0]?.label) {
      portEntry.port_param = `${portEntry._pinItems[0].label}_PORT`;
    } else {
      portEntry.port_param = defaultPortParam;
    }
  } catch (e) {
    console.error(`helper_gpio_group_pins_by_port: ${e}`);
  }

  return result;
}

/**
  * Retrieve all the interruptions for the GPIO inside a need but not generated
  * @param {object} nvic_api Getter on NVIC api
  * @param {object} gpio_api Getter on GPIO api
  * @param {object} exti_api Getter on EXTI api
  * @param {string} resource Peripheral which has enabled the GPIO
  * @returns {object}
  */
function helper_gpio_need_get_irq_handler(nvic_api, gpio_api, exti_api, resource) {
  const result = [];
  try {
    console.info(`helper_gpio_need_get_irq_handler: resource=${resource}}`);
    /** Retrieve all the GPIO assigned to a peripheral */
    const gpio_needs = gpio_api.getAllocatedResourceNeedsByHwInstance(resource);

    /** Retrieve the configuration for all the pins */
    gpio_needs.forEach(gpio_need => {
      const gpio_nvic_config = gpio_api.getNeedById(gpio_need.needId);
      /** Check if EXTI has been enabled on the pin */
      const enable_exti = gpio_nvic_config.configuration.basic?.enable_exti ?? false;
      if (enable_exti) {
        const exti_config = exti_api.getNeedById(gpio_nvic_config.configuration.basic.exti_config.needs[0].id);
        /** Check if interruption has beenn enabled on the EXTI line */
        const enableInterruption = exti_config.configuration.basic.interruption?.enable_interruption ?? false;
        if (enableInterruption) {
          /** Check if IRQ handler generated is done on code generation or not */
          const irqHandlerGeneration = exti_config.configuration.basic.interruption.irq_handler_generation ?? false;
          if (!irqHandlerGeneration) {
            const labels = exti_config.configuration.labels || [];
            const nvic_config = nvic_api.getNeedById(exti_config.configuration.basic.interruption.nvic.needs[0].id);
            /** Fill the object to be used for aliases in mx_hal_def.h */
            if (labels.length) {
              let first_label = true;
              for (const label of labels) {
                result.push({
                  resource,
                  signal_name: gpio_nvic_config.signalName,
                  exti_name: nvic_config.name,
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
                signal_name: gpio_nvic_config.signalName,
                exti_name: nvic_config.name,
                alias: "",
                nvic_config,
                generated: false
              });
            }
          }
        }
      }
    });
  } catch (e) {
    console.error(`helper_gpio_need_get_irq_handler: ${e}`);
  }
  return result;
}

/**
  * Retrieve all the interruptions set by GPIO/EXTI but not generated
  * @param {object} nvic_api Getter on NVIC api
  * @param {object} exti_api Getter on EXTI api
  * @param {object} resource Current resource
  * @param {object} config current configuration of the GPIO/EXTI
  * @returns {object}
  */
function helper_gpio_get_irq_handler(nvic_api, exti_api, resource, config) {
  let result = [];
  try {
    console.info(`helper_gpio_get_irq_handler: resource=${resource}, config=${JSON.stringify(config)}`
    );

    /** Parse all the user pins configured in GPIO panel */
    const list_pins = config.pins;
    list_pins.forEach(pin => {
      /** Check if EXTI has been enabled on the pin */
      const enable_exti = pin.basic?.enable_exti ?? false;
      if (enable_exti) {
        const exti_config = exti_api.getNeedById(pin.basic.exti_config.needs[0].id);
        /** Check if interruption has beenn enabled on the EXTI line */
        const enableInterruption = exti_config.configuration.basic.interruption?.enable_interruption ?? false;
        if (enableInterruption) {
          /** Check if IRQ handler generated is done on code generation or not */
          const irqHandlerGeneration = exti_config.configuration.basic.interruption.irq_handler_generation ?? false;
          if (!irqHandlerGeneration) {
            const labels = exti_config.configuration.labels || [];
            const nvic_config = nvic_api.getNeedById(exti_config.configuration.basic.interruption.nvic.needs[0].id);
            /** Fill the object to be used for aliases in mx_hal_def.h */
            if (labels.length) {
              let first_label = true;
              for (const label of labels) {
                result.push({
                  resource: resource.toUpperCase(),
                  signal_name: pin._foreignKey,
                  exti_name: nvic_config.name,
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
                signal_name: pin._foreignKey,
                exti_name: nvic_config.name,
                alias: "",
                nvic_config,
                generated: false
              });
            }
          }
        }
      }
    });
  } catch (e) {
    console.error(`helper_gpio_get_irq_handler: ${e}`);
  }
  return result;
}

/**
 * Generate C macro definitions for peripheral GPIO pins from software labels only.
 * @detail This helper function queries the pinout API to retrieve all GPIO pins allocated to a given hardware
 *         resource instance. For each pin, it extracts software labels and generates aligned C `#define`
 *         macros for port and pin aliases.
 *         The macros are formatted according to the specified software layer (`HAL` or `LL`):
 *         - For `HAL`, port macros are prefixed with `HAL_GPIO` and pin macros with `HAL_GPIO_PIN`.
 *         - For `LL`, port macros use the port name (e.g., `GPIOA`), while pin macros keep the `LL_GPIO_PIN` prefix.
 *         Every GPIO label generates a set of port and pin macros. The first software label is preferred by
 *         peripheral source templates when a single label is needed.
 *         The generated string can be inserted directly into header files to provide convenient symbolic names for
 *         GPIO pins used in firmware development.
 * @param {object} pinout_api - API object providing access to pinout configuration and needs.
 * @param {object} current_resource - Hardware resource instance for which to generate aliases.
 * @param {string} layer - Software abstraction layer identifier, typically "HAL" or "LL".
 * @returns {string} A formatted string containing the generated C macro definitions for GPIO aliases.
 */
function helper_gpio_generate_aliases(pinout_api, current_resource, layer) {
  let result = "";
  try {
    // console.info(//   `helper_gpio_generate_aliases: config`
    //);

    const list_pins = pinout_api.getAllocatedResourceNeedsByHwInstance(current_resource);

    function getPortMacroValue(port, layer) {
      return layer === "LL" ? `GPIO${port}` : `${layer}_GPIO${port}`;
    }

    list_pins.forEach((pin) => {
      const pin_config = pinout_api.getNeedById(pin.needId);
      const swlabels = pin_config.configuration.label_name || [];
      const gpio_labels = helper_gpio_create_ppp_gpio_aliases(swlabels);

      if (gpio_labels.length > 0) {
        result += `\r\n/** GPIO pin aliases for ${pin_config.signalName} */`;
        gpio_labels.forEach((label) => {
          const port_macro_value = getPortMacroValue(pin_config.gpioPad.port, layer);
          let right_part = helper_gpio_add_pad_right(`${label}_PORT`, 37);
          result += `\r\n#define ${right_part} ${port_macro_value}`;
          right_part = helper_gpio_add_pad_right(`${label}_PIN`, 37);
          result += `\r\n#define ${right_part} ${layer}_GPIO_PIN_${pin_config.gpioPad.index}\r\n`;
        });
      }
    });
  } catch (e) {
    console.error(`helper_gpio_generate_aliases: ${e}`);
  }
  return result;
}

/**
 * Filter allocated GPIO needs with selectors derived from their signal names.
 * A signal such as "SPI1_RX" has the selector "RX" for the "SPI1" resource.
 * Selector matching is case-insensitive.
 * @param {object} pinout_api
 * @param {Array<object>} gpio_needs
 * @param {string} current_resource
 * @param {Array<string>|string|undefined} selectors Comma-separated selector string, selector array, or undefined
 * @returns {Array<object>} Selected GPIO needs
 */
function helper_gpio_filter_needs_by_selectors(pinout_api, gpio_needs, current_resource, selectors) {
  const needs = Array.isArray(gpio_needs) ? gpio_needs : [];

  try {
    if (selectors === undefined || selectors === null) {
      return needs;
    }

    const normalized_selectors = (Array.isArray(selectors) ? selectors : [selectors])
      .filter((selector) => selector !== undefined && selector !== null)
      .flatMap((selector) => String(selector).split(","))
      .map((selector) => String(selector).trim().toUpperCase());

    if (normalized_selectors.includes("ALL_PINS")) {
      return needs;
    }

    const resource_prefix = `${String(current_resource).trim().toUpperCase()}_`;

    return needs.filter((gpio_need) => {
      let signal_name = gpio_need?.signalName;
      if (signal_name === undefined || signal_name === null) {
        signal_name = pinout_api.getNeedById(gpio_need.needId)?.signalName;
      }
      if (signal_name === undefined || signal_name === null) {
        return false;
      }

      const normalized_signal_name = String(signal_name).trim().toUpperCase();
      const selector = normalized_signal_name.startsWith(resource_prefix)
        ? normalized_signal_name.slice(resource_prefix.length)
        : normalized_signal_name;

      return normalized_selectors.includes(selector);
    });
  } catch (e) {
    console.error(`helper_gpio_filter_needs_by_selectors: ${e}`);
  }

  return [];
}

/**
 * Aggregate GPIO configuration for a hardware resource.
 * @param {object} pinout_api
 * @param {string} current_resource
 * @param {Array<string>|string|undefined} selectors Comma-separated signal selectors, or "all_pins"/undefined for every pin
 * @returns {object} { list_port:[], list_config_pins:[] }
 */
function helper_gpio_get_allocated_resource_needs(pinout_api, current_resource, selectors) {
  let result = { list_port: [], list_config_pins: [] };
  try {
    let gpio_needs = [];
    if(current_resource.indexOf("USB") !== -1){
      gpio_needs = pinout_api.getAllocatedResourceNeedsByResourceName(current_resource) || [];
    }
    else{
      gpio_needs = pinout_api.getAllocatedResourceNeedsByHwInstance(current_resource) || [];
    }
    gpio_needs = helper_gpio_filter_needs_by_selectors(pinout_api, gpio_needs, current_resource, selectors);
    gpio_needs.forEach((gpio_need) => {
      const gpio_ctxt = pinout_api.getNeedById(gpio_need.needId);
      if (!gpio_ctxt) return;
      // If no user configuration is present for this pin, skip it.
      if (!(gpio_ctxt.configuration?.basic)) return;

      let current_config = { ...gpio_ctxt.configuration.basic };
      // SW labels
      if (gpio_ctxt.configuration.label_name) {
        let labels = gpio_ctxt.configuration.label_name;
        if (!Array.isArray(labels)) labels = [labels];
        current_config.label_name = [labels];
      } else {
        current_config.label_name = [];
      }
      let current_gpio = gpio_ctxt.gpioPad || { port: "B", index: 6 };
      if (!result.list_port.includes(current_gpio.port)) {
        result.list_port.push(current_gpio.port);
      }
      if (gpio_ctxt.AFid !== undefined && gpio_ctxt.AFid !== null) {
        current_config.af = String(gpio_ctxt.AFid);
      }
      current_config.port = current_gpio.port;
      if (current_config.maxSpeed && !current_config.speed) current_config.speed = current_config.maxSpeed;
      if (current_config.outputType && !current_config.output_type) current_config.output_type = current_config.outputType;
      if (current_config.pullMode && !current_config.pull) current_config.pull = current_config.pullMode;

      // Per-pin GPIO aliases derived from SW labels only
      const sw_labels_flat = gpio_ctxt.configuration?.label_name
        ? (Array.isArray(gpio_ctxt.configuration.label_name) ? gpio_ctxt.configuration.label_name : [gpio_ctxt.configuration.label_name])
        : [];
      const per_pin_gpio_labels = helper_gpio_create_ppp_gpio_aliases(sw_labels_flat);
      const per_pin_gpio_label = per_pin_gpio_labels[0] || "";
      let existing = result.list_config_pins.find((cfg) =>
        cfg.port === current_config.port &&
        cfg.mode === current_config.mode &&
        cfg.speed === current_config.speed &&
        cfg.output_type === current_config.output_type &&
        cfg.af === current_config.af &&
        cfg.pull === current_config.pull
      );
      if (existing) {
        existing.pin.push(current_gpio.index.toString());
        existing.exti_cfg.push({
          pin: current_gpio.index.toString(),
          port: current_config.port,
          exti_enabled: current_config.enable_exti,
          config: current_config.exti_config,
        });
        existing.signalName.push(gpio_ctxt.signalName);
        if (gpio_ctxt.configuration?.label_name) {
          let newLabels = gpio_ctxt.configuration.label_name;
          if (!Array.isArray(newLabels)) newLabels = [newLabels];
          existing.label_name.push(newLabels);
        }
        // Accumulate GPIO labels per pin (aligned with existing.pin order)
        if (!existing.aliases || typeof existing.aliases !== "object") {
          existing.aliases = { master_label: [], other_labels: [] };
        }
        if (!Array.isArray(existing.aliases.master_label)) existing.aliases.master_label = [];
        if (!Array.isArray(existing.aliases.other_labels)) existing.aliases.other_labels = [];
        existing.aliases.master_label.push(per_pin_gpio_label);
        existing.aliases.other_labels.push(per_pin_gpio_labels.slice(1));
      } else {
        current_config.signalName = gpio_ctxt.signalName ? [gpio_ctxt.signalName] : [];
        current_config.pin = [current_gpio.index.toString()];
        current_config.exti_cfg = [{
          pin: current_gpio.index.toString(),
          port: current_config.port,
          exti_enabled: current_config.enable_exti,
          config: current_config.exti_config,
        }];
        if (gpio_ctxt.configuration?.label_name && !current_config.label_name.length) {
          let labels = gpio_ctxt.configuration.label_name;
          if (!Array.isArray(labels)) labels = [labels];
          current_config.label_name = [labels];
        }
        // GPIO labels are stored per pin, aligned with the grouped pin list
        current_config.aliases = {
          master_label: [per_pin_gpio_label],
          other_labels: [per_pin_gpio_labels.slice(1)],
        };
        result.list_config_pins.push(current_config);
      }
    });
  } catch (e) {
    console.error(`helper_gpio_get_allocated_resource_needs: ${e}`);
  }
  return result;
}

/**
 * Get the default pull-up/pull-down configuration for a given GPIO pin based on its port and index.
 * This function checks the default values of the GPIOx_PUPDR register for specific pins and returns the corresponding pull configuration.
 * @param {string} port GPIO port (e.g., "A", "B", "C")
 * @param {integer} index GPIO pin index (e.g., 0, 1, 2)
 * @returns {string} pull configuration ("NO", "UP", "DOWN")
 */
function helper_gpio_get_default_pull(port, index) {
  let result = "NO";
  //console.error(`helper_gpio_get_default_pull: port ${JSON.stringify(port)}, index ${JSON.stringify(index)}`);
  try {
    const pin_name = `${port}${index}`;
    /** check the default values of GPIOx_PUPDR
     * Reset value: 0x6400 0000 (for port A)
     * Reset value: 0x0000 0100 (for port B)
     * Reset value: 0x0000 0000 (for the other ports)
    */
    const map_pull = {
      A13: "UP",
      A14: "DOWN",
      A15: "UP",
      B4: "UP",
    }
    result = map_pull[pin_name] || "NO";
  } catch (e) {
    console.error(`helper_gpio_get_default_pull: ${e}`);
  }
  return result;
}

/**
 * Get the default speed configuration for a given GPIO pin based on its port and index.
 * This function checks the default values of the GPIOx_OSPEEDR register for specific pins and returns the corresponding speed configuration.
 * @param {string} port GPIO port (e.g., "A", "B", "C")
 * @param {integer} index GPIO pin index (e.g., 0, 1, 2)
 * @returns {string} speed configuration ("LOW", "MEDIUM", "HIGH", "VERY_HIGH")
 */
function helper_gpio_get_default_speed(port, index) {
  let result = "LOW";
  //console.error(`helper_gpio_get_default_speed: port ${JSON.stringify(port)}, index ${JSON.stringify(index)}`);
  try {
    const pin_name = `${port}${index}`;
    /** check the default values of GPIOx_OSPEEDR
     * Reset value: 0x0C00 0000 (for port A)
     * Reset value: 0x0000 00C0 (for port B)
     * Reset value: 0x0000 0000 (for the other ports)
    */
    const map_speed = {
      A13: "VERY_HIGH",
      B3: "VERY_HIGH"
    }
    result = map_speed[pin_name] || "LOW";
  } catch (e) {
    console.error(`helper_gpio_get_default_speed: ${e}`);
  }
  return result;
}

/**
 * Replace all occurrences of a substring in a target string with a given replacement value.
 * This function validates the input string and search substring before performing a global replacement.
 * If the target value is not a string, an empty string is returned.
 * If the search value is not a valid non-empty string, the original target string is returned unchanged.
 * @param {string} targetString Original string in which the replacement will be performed
 * @param {string} findChar Substring to search for in the target string
 * @param {string} replaceChar Replacement value used for each matched substring
 * @returns {string} updated string after replacement
 */
function helper_gpio_replace(targetString, findChar, replaceChar) {
  if (typeof targetString !== 'string') {
    return '';
  }

  if (typeof findChar !== 'string' || findChar.length === 0) {
    return targetString;
  }

  return targetString.split(findChar).join(replaceChar ?? '');
}

/**
 * Check whether retime is available for a GPIO pin.
 * The function reads RETIME_CFG as a bit string and evaluates the bit at the given index.
 * @param {string} retime RETIME_CFG value in hexadecimal string format, for example "16'h0780".
 * @param {integer} index Bit index to test (0-based, from right to left).
 * @returns {boolean} True if the selected bit is "1"; otherwise false.
 */
function helper_gpio_get_retime_cfg(retime, index) {
  let result = false;
  //console.info(`helper_gpio_get_retime_cfg: retime ==> ${JSON.stringify(retime)}, index ==> ${JSON.stringify(index)}`);
  try {
    if (retime === undefined || retime === null || typeof retime !== "string"){
      return result;
    }
    if (retime.includes("'h")) {
      const string_hex_config_value = retime.split("'h")[1];
      const string_binary_config_value = parseInt(string_hex_config_value, 16).toString(2);
      const pos = string_binary_config_value.length - 1 - index;
      if (pos >= 0) {
        result = string_binary_config_value[pos] === "1";
      }
    }
  } catch (e) {
    console.error(`helper_gpio_get_retime_cfg: ${e}`);
  }
  return result;
}
module.exports = {
  helper_gpio_retrieve_exti_object,

  helper_gpio_get_gpioconfig_standalone_object,

  helper_gpio_get_allocated_resource_needs,

  helper_gpio_create_aliases,

  helper_gpio_create_ppp_gpio_aliases,

  helper_gpio_add_pad_right,

  helper_gpio_merge_exti_cfg,

  helper_gpio_group_pins_by_port,

  helper_gpio_need_get_irq_handler,

  helper_gpio_get_retime_cfg,

  helper_gpio_get_irq_handler,

  helper_gpio_generate_aliases,

  helper_gpio_get_default_pull,

  helper_gpio_get_default_speed,

  helper_gpio_replace
};
