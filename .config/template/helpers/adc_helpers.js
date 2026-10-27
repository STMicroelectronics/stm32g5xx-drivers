/**
  * @file Helpers functions used for ADC SW component
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
 * Get first character of adc post processing config
 * @param {string} str : left_bit_shift
 * @returns {string} First character of left_bit_shift value
 */
function helper_adc_post_processing_get_firstChar (str) {
  try {
    if (typeof str === 'string' && str.length > 0) {
      return str.charAt(0);
    } else {
      return '';
    }
  } catch (e) {
    console.error(`helper_adc_post_processing_get_firstChar: ${e}`);
  }
}
/**
 * Remove underscore character
 * @param {string} str
 * @returns {string} str without underscore
 */
function helper_adc_removeUnderscore (str) {
  try {
    if (typeof str === 'string' && str.length > 0) {
      return str.replace(/_/g, '');
    } else {
      return '';
    }
  } catch (e) {
    console.error(`helper_adc_removeUnderscore: ${e}`);
  }
}

/**
 * Calculate the timer output frequency based on prescaler and period values
 * @note  This api is used directly in the tim_parameters.json in advanced view
 * @param {integer} input_clock_frequency system clock frequency in Hz
 * @param {integer} prescaler Prescaler set by the user
 * @param {integer} period Period set by the user
 * @returns {integer} Timer output frequency in Hz
 */
function helper_adc_compute_sampling(
  input_clock_frequency,
  prescaler,
  cycles
) {
  let result = 10000; /* default value to 10KHz */
  try {
    /* Convert input parameters to integer */
    var prescaler_num = parseInt(prescaler.replace('ASYNC_DIV', ''), 10);

    var cycle_num = parseInt(cycles.replace('CYCLES', ''), 10);

    /* Calculate the actual timer frequency */
    var adc_frequency_hz = input_clock_frequency / (prescaler_num);

    /* Calculate the actual output frequency */
    var sampling_time = (cycle_num * 1000000000) / adc_frequency_hz;

    /* Return the output frequency */
    result = Math.floor(sampling_time);
  } catch (e) {
    console.error(`helper_adc_compute_sampling: ${e}`);
  }
  return result;
}

/**
 * Calculate the timer output frequency based on prescaler and period values
 * @note  This api is used directly in the tim_parameters.json in advanced view
 * @param {integer} input_clock_frequency system clock frequency in Hz
 * @param {integer} prescaler Prescaler set by the user
 * @returns {integer} Timer output frequency in Hz
 */
function helper_adc_compute_frequency(
  input_clock_frequency,
  prescaler,
) {
  let result = 10000; /* default value to 10KHz */
  try {
    /* Convert input parameters to integer */
    var prescaler_num = parseInt(prescaler.replace('ASYNC_DIV', ''), 10);

    /* Calculate the actual timer frequency */
    var adc_frequency_hz = input_clock_frequency / (prescaler_num);

    /* Return the output frequency */
    result = Math.floor(adc_frequency_hz);
  } catch (e) {
    console.error(`helper_adc_compute_sampling: ${e}`);
  }
  return result;
}

/**
 * Check if the channel_id has been configured in input
 * @param {object} channels list of configured channels
 * @param {integer} channel_id id of the channel
 * @returns true or false
 */
function helper_adc_find_channel_enable(channels, channel_id) {
  try {
    if (channels === undefined) {
      return false;
    }
    return (
      channels.find(function (channel) {
        return (
          channel["_foreignKey"] === channel_id.toString() &&
          channel.mode === "Input"
        );
      }) !== undefined
    );
  } catch (e) {
    console.error(`helper_tim_find_channel_config_in_input: ${e}`);
    return false;
  }
}

/**
 * Check whether an interconnect entry is a valid ADC analog input candidate.
 * Keep the common exclusion rules here so they can be updated in one place.
 * @param {object} entry - Interconnect entry coming from resource.interconnect.
 * @returns {boolean} True when the entry passes the generic ADC input filters.
 */
function helper_adc_is_valid_analog_input_entry(entry) {
  return Boolean(
    entry &&
    entry.type === 'analog input' &&
    typeof entry.source === 'string' &&
    typeof entry.id === 'string' &&
    !/gnd/i.test(entry.source) &&
    entry.source !== 'VREF-' &&
    !entry.source.startsWith('DFT')
  );
}

/**
 * Check whether an analog input entry is connected to the positive ADC path.
 * Negative-only inputs such as Vinnx must not be exposed in channel pickers.
 * @param {object} entry - Interconnect entry coming from resource.interconnect.
 * @returns {boolean} True when the entry targets a positive ADC input.
 */
function helper_adc_is_positive_analog_input_entry(entry) {
  const entryId = entry?.id;
  const entrySource = entry?.source;

  return Boolean(
    entry &&
    typeof entryId === 'string' &&
    !/vinn/i.test(entryId) &&
    !/vinn/i.test(entrySource || '') &&
    /vinp/i.test(entryId)
  );
}

/**
 * Check whether an input is a supported internal ADC source.
 * Update this function when a new internal source naming rule must be accepted.
 * @param {string} source - Interconnect source name.
 * @returns {boolean} True when the source is treated as an internal ADC channel.
 */
function helper_adc_is_supported_internal_source(source) {
  if (typeof source !== 'string') {
    return false;
  }

  const normalizedSource = source.toLowerCase();

  return (
    ['vsens', 'vrefint', 'vddcore', 'vddarray', 'vbat'].includes(normalizedSource) ||
    /^opamp/i.test(source) ||
    /^dac_/i.test(source) ||
    /^dac\d+_out\d+$/i.test(source) ||
    /^vcore/i.test(source) ||
    /^vsens/i.test(source) ||
    /^vbat(\/4)?$/i.test(source)
  );
}

/**
 * Check whether the current entity is the first source occurrence exposed by
 * the positive analog-input list. Query selectors use this to avoid duplicated
 * entries when several positive analog-input nodes share the same source name,
 * without letting a negative input hide its positive counterpart.
 * @param {object} entity - Query entity being evaluated.
 * @param {object} resource - Current ADC resource.
 * @returns {boolean} True when the entity is the first occurrence for its source.
 */
function helper_adc_is_first_query_source_occurrence(entity, resource) {
  if (!entity || !resource?.interconnect) {
    return true;
  }

  const matchingIds = resource.interconnect
    .filter(entry => (
      helper_adc_is_valid_analog_input_entry(entry) &&
      helper_adc_is_positive_analog_input_entry(entry) &&
      entry.source === entity.source
    ))
    .map(entry => entry.id)
    .sort();

  return matchingIds[0] === entity.id;
}

/**
 * Check whether an entity matches the STM32V8 query filter.
 * Keep this logic in JavaScript so the JSON query stays easy to maintain.
 * @param {object} entity - Query entity being evaluated.
 * @param {object} resource - Current ADC resource.
 * @returns {boolean} True when the entity can be proposed by the query.
 */
function helper_adc_is_v8_query_channel(entity, resource) {
  try {
    return (
      helper_adc_is_valid_analog_input_entry(entity) &&
      helper_adc_is_positive_analog_input_entry(entity) &&
      helper_adc_is_first_query_source_occurrence(entity, resource)
    );
  } catch (e) {
    console.error(`helper_adc_is_v8_query_channel: ${e}`);
    return false;
  }
}

/**
 * Check whether an entity matches the standard ADC query filter.
 * The rule is split from the JSON file so internal-source and pin-mapping
 * updates can be handled in one place only.
 * @param {object} entity - Query entity being evaluated.
 * @param {object} resource - Current ADC resource.
 * @param {Function} getValue - Getter function provided by the template engine.
 * @returns {boolean} True when the entity can be proposed by the query.
 */
function helper_adc_is_standard_query_channel(entity, resource, getValue) {
  try {
    return (
      helper_adc_is_valid_analog_input_entry(entity) &&
      helper_adc_is_positive_analog_input_entry(entity) &&
      (
        helper_adc_is_supported_internal_source(entity.source) ||
        helper_adc_is_mappable_external_source(entity, resource, getValue)
      ) &&
      helper_adc_is_first_query_source_occurrence(entity, resource)
    );
  } catch (e) {
    console.error(`helper_adc_is_standard_query_channel: ${e}`);
    return false;
  }
}

/**
 * Check whether an input is a mappable external ADC pin for the current instance.
 * Keep the pin-mapping rule isolated here so it is easy to adapt later.
 * @param {object} entry - Interconnect entry coming from resource.interconnect.
 * @param {object} resource - Current ADC resource.
 * @param {Function} getValue - Getter function provided by the template engine.
 * @returns {boolean} True when the entry maps to a valid ADC pin.
 */
function helper_adc_is_mappable_external_source(entry, resource, getValue) {
  if (!entry || !resource || typeof getValue !== 'function') {
    return false;
  }

  const resourcePrefix = `${resource.name}_`;
  if (!/vinp/i.test(entry.id) || !entry.source.startsWith(resourcePrefix)) {
    return false;
  }

  const signalName = entry.source.replace(resourcePrefix, '');
  return getValue('pinout.peripheralCanBeMapped', resource.name, signalName) === true;
}

/**
 * Check whether the differential input mode can be proposed for a channel tab.
 * Internal sources such as VREFINT, VSENSE, VCORE or OPAMP inputs do not have an INP number.
 * @param {object} item - Current channel item.
 * @param {object} resource - Current ADC resource.
 * @param {Function} getValue - Getter function provided by the template engine.
 * @returns {boolean} True when the matching INN pin can be mapped.
 */
function helper_adc_can_enable_differential_input(item, resource, getValue) {
  try {
    if (!item || !resource?.name || typeof getValue !== 'function') {
      return false;
    }

    const channelSource = item._foreignKey || item.source || item.id;
    if (typeof channelSource !== 'string') {
      return false;
    }

    const channelMatch = channelSource.match(/INP(\d+)$/i);
    if (!channelMatch) {
      return false;
    }

    return getValue('pinout.peripheralCanBeMapped', resource.name, `INN${channelMatch[1]}`) === true;
  } catch (e) {
    console.error(`helper_adc_can_enable_differential_input: ${e}`);
    return false;
  }
}

/**
 * Keep only the first occurrence of each source name.
 * This avoids duplicate channel tabs when several interconnect entries point
 * to the same ADC source.
 * @param {object} entry - Current interconnect entry.
 * @param {number} index - Current entry index.
 * @param {Array} entries - Full entries list.
 * @returns {boolean} True when the entry is the first occurrence for its source.
 */
function helper_adc_is_first_source_occurrence(entry, index, entries) {
  return index === entries.findIndex(candidate => candidate.source === entry.source);
}

/**
 * Return the channel source list used by STM32V8 ADC templates.
 * The V8 flow only exposes VINP signals after the generic exclusions.
 * @param {object} resource - Current ADC resource.
 * @returns {Array} Filtered list of ADC channel sources.
 */
function helper_adc_get_v8_channel_sources(resource) {
  try {
    return (resource?.interconnect || [])
      .filter(entry => (
        helper_adc_is_valid_analog_input_entry(entry) &&
        helper_adc_is_positive_analog_input_entry(entry)
      ))
      .filter(helper_adc_is_first_source_occurrence);
  } catch (e) {
    console.error(`helper_adc_get_v8_channel_sources: ${e}`);
    return [];
  }
}

/**
 * Return the channel source list used by the standard ADC templates.
 * The filtering rules are intentionally split into small helpers so future
 * updates can be done without touching the JSON expression.
 * @param {object} resource - Current ADC resource.
 * @param {Function} getValue - Getter function provided by the template engine.
 * @returns {Array} Filtered list of ADC channel sources.
 */
function helper_adc_get_standard_channel_sources(resource, getValue) {
  try {
    return (resource?.interconnect || [])
      .filter(helper_adc_is_valid_analog_input_entry)
      .filter(helper_adc_is_positive_analog_input_entry)
      .filter(entry => (
        helper_adc_is_supported_internal_source(entry.source) ||
        helper_adc_is_mappable_external_source(entry, resource, getValue)
      ))
      .filter(helper_adc_is_first_source_occurrence);
  } catch (e) {
    console.error(`helper_adc_get_standard_channel_sources: ${e}`);
    return [];
  }
}

/**
 * Check whether the multimode uses regular conversions.
 * @param {string} mode - ADC multimode selection.
 * @returns {boolean} True when regular multimode settings apply.
 */
function helper_adc_mm_is_regular_mode(mode) {
  return [
    'DUAL_REG_SIMULT',
    'DUAL_REG_INTERL',
    'DUAL_REG_SIM_INJ_SIM',
    'DUAL_REG_SIM_INJ_ALT',
    'DUAL_REG_INT_INJ_SIM'
  ].includes(mode);
}

/**
 * Check whether the multimode uses injected conversions.
 * @param {string} mode - ADC multimode selection.
 * @returns {boolean} True when injected multimode settings apply.
 */
function helper_adc_mm_is_injected_mode(mode) {
  return [
    'DUAL_INJ_SIMULT',
    'DUAL_INJ_ALTERN',
    'DUAL_REG_SIM_INJ_SIM',
    'DUAL_REG_SIM_INJ_ALT',
    'DUAL_REG_INT_INJ_SIM'
  ].includes(mode);
}

/**
 * Check whether the multimode uses interleaved regular conversions.
 * @param {string} mode - ADC multimode selection.
 * @returns {boolean} True when interleaved delay applies.
 */
function helper_adc_mm_is_interleaved_mode(mode) {
  return ['DUAL_REG_INTERL', 'DUAL_REG_INT_INJ_SIM'].includes(mode);
}

/**
 * Check whether the current ADC instance is the multimode slave.
 * @param {string} instanceRole - ADC multimode instance role.
 * @returns {boolean} True when the instance role is SLAVE.
 */
function helper_adc_mm_is_slave(instanceRole) {
  return instanceRole === 'SLAVE';
}

/**
 * Check whether the current ADC instance is a slave in regular multimode.
 * @param {string} instanceRole - ADC multimode instance role.
 * @param {string} mode - ADC multimode selection.
 * @returns {boolean} True when regular slave multimode rules apply.
 */
function helper_adc_mm_is_slave_regular_mode(instanceRole, mode) {
  return helper_adc_mm_is_slave(instanceRole) && helper_adc_mm_is_regular_mode(mode);
}

/**
 * Check whether the current ADC instance is a slave in injected multimode.
 * @param {string} instanceRole - ADC multimode instance role.
 * @param {string} mode - ADC multimode selection.
 * @returns {boolean} True when injected slave multimode rules apply.
 */
function helper_adc_mm_is_slave_injected_mode(instanceRole, mode) {
  return helper_adc_mm_is_slave(instanceRole) && helper_adc_mm_is_injected_mode(mode);
}

/**
 * Check whether the current ADC instance is a slave in interleaved multimode.
 * @param {string} instanceRole - ADC multimode instance role.
 * @param {string} mode - ADC multimode selection.
 * @returns {boolean} True when interleaved slave multimode rules apply.
 */
function helper_adc_mm_is_slave_interleaved_mode(instanceRole, mode) {
  return helper_adc_mm_is_slave(instanceRole) && helper_adc_mm_is_interleaved_mode(mode);
}

/**
 * Check whether the interleaved delay is compatible with the ADC resolution.
 * @param {string|number} interlDelay - Interleaved delay in ADC clock cycles.
 * @param {number} resolution - ADC resolution in bits.
 * @returns {number} 1 when valid, 0 when invalid.
 */
function helper_adc_interl_delay_assert(interlDelay, resolution) {
  const delay = Number(interlDelay);
  const maxDelayByResolution = {
    6: 7,
    8: 9,
    10: 11,
    12: 13
  };
  const maxDelay = maxDelayByResolution[Number(resolution)] ?? 13;

  return Number.isInteger(delay) && delay >= 1 && delay <= maxDelay ? 1 : 0;
}

/**
 * Check whether Nadc simultaneous trigger is sourced from another ADC instance.
 * @param {string} multiadcTrigger - Nadc simultaneous trigger selection.
 * @returns {boolean} True when the selection is an ADCx source, not disabled or master.
 */
function helper_adc_is_multiadc_trigger_from_other(multiadcTrigger) {
  return typeof multiadcTrigger === 'string' && multiadcTrigger !== 'DISABLE' && multiadcTrigger !== 'MASTER';
}

/**
 * Return the ADC pair corresponding to a single ADC instance name.
 * This helper maps instance names to the common-pair grouping used by multimode logic.
 * @param {string} resourceName - ADC instance name, for example ADC1, ADC2, ADC3, ADC4 or ADC5.
 * @returns {Array<string>|null} Pair resources such as ['ADC1', 'ADC2'], or null when unsupported.
 */
function helper_adc_get_pair_resources(resourceName) {
  const normalized = typeof resourceName === 'string' ? resourceName.toUpperCase() : '';

  if (normalized === 'ADC1' || normalized === 'ADC2') {
    return ['ADC1', 'ADC2'];
  }

  if (normalized === 'ADC3' || normalized === 'ADC4') {
    return ['ADC3', 'ADC4'];
  }

  if (normalized === 'ADC5') {
    return ['ADC4', 'ADC5'];
  }

  return null;
}

/**
 * Extract a pair of consecutive ADC instances from a compact parent name.
 * Examples: ADC45 -> ['ADC4', 'ADC5'], ADC910 -> ['ADC9', 'ADC10'].
 * @param {string} parentResource - Compact parent resource name that ends with concatenated ADC indexes.
 * @returns {Array<string>|null} Two consecutive ADC instance names, or null when no valid split is found.
 */
function helper_adc_get_pair_resources_from_parent(parentResource) {
  const normalized = typeof parentResource === 'string' ? parentResource.toUpperCase() : '';
  const parentMatch = normalized.match(/ADC(\d+)$/);

  if (!parentMatch || parentMatch[1].length < 2) {
    return null;
  }

  const digits = parentMatch[1];

  for (let splitIndex = 1; splitIndex < digits.length; splitIndex += 1) {
    const left = Number(digits.slice(0, splitIndex));
    const right = Number(digits.slice(splitIndex));

    if (!Number.isInteger(left) || !Number.isInteger(right)) {
      continue;
    }

    if (right === left + 1) {
      return [`ADC${left}`, `ADC${right}`];
    }
  }

  return null;
}

/**
 * Resolve the ADC query parent used by peripheralBlock trigger queries.
 * @param {object|string} resourceOrName - Current ADC resource, or its resource name.
 * @returns {string|null} ADC common parent name, or the resource itself when no common parent applies.
 */
function helper_adc_get_query_parent(resourceOrName) {
  try {
    if (resourceOrName && typeof resourceOrName === 'object') {
      const parent = resourceOrName.parent;

      if (typeof parent === 'string') {
        const parentMatch = parent.toUpperCase().match(/(?:^|\.)((?:ADC)\d+)$/);

        if (parentMatch) {
          return parentMatch[1];
        }
      }

      return typeof resourceOrName.name === 'string' ? resourceOrName.name.toUpperCase() : null;
    }

    if (typeof resourceOrName !== 'string') {
      return null;
    }

    const resourceName = resourceOrName.toUpperCase();
    const pairResources = helper_adc_get_pair_resources(resourceName);

    if (pairResources?.[0] === 'ADC1') {
      return 'ADC12';
    }

    if (pairResources?.[0] === 'ADC3') {
      return 'ADC34';
    }

    if (pairResources?.[0] === 'ADC4') {
      return 'ADC45';
    }

    return resourceName;
  } catch (e) {
    console.error(`helper_adc_get_query_parent: ${e}`);
    return null;
  }
}

/**
 * Resolve the other ADC instance participating in multimode.
 * @param {*} instancesOrParentResource - Parent resource context used to identify the ADC pair.
 * @param {string} currentResource - Current ADC instance name.
 * @returns {string|null} The other ADC instance name, or null if none was found.
 */
function helper_adc_get_multimode_other_instance(instancesOrParentResource, currentResource) {
  try {
    const current = typeof currentResource === 'string' ? currentResource.toUpperCase() : '';
    const pairResources = helper_adc_get_pair_resources(current);

    if (typeof instancesOrParentResource === 'string') {
      const normalizedParent = instancesOrParentResource.toUpperCase();
      const parentMatch = normalizedParent.match(/ADC(\d+)\.ADC(\d+)$/);

      if (parentMatch) {
        const parentResources = parentMatch[1].split('').map((digit) => `ADC${digit}`);
        const otherResource = parentResources.find((resource) => resource !== current);

        if (otherResource) {
          return otherResource;
        }
      }
    }

    if (pairResources) {
      return pairResources.find((resource) => resource !== current) ?? null;
    }

    const parentAsText = JSON.stringify(instancesOrParentResource ?? '');
    const matches = [...parentAsText.matchAll(/ADC\d+/gi)].map((match) => match[0].toUpperCase());

    return matches.find((resource) => resource !== current) ?? null;
  } catch (e) {
    console.error(`helper_adc_get_multimode_other_instance: ${e}`);
    return null;
  }
}

/**
 * Increment the given value by 1.
 * @param {number} value - The value to be incremented.
 * @returns {number} The incremented value.
 */
function helper_adc_increment(value) {
  try {
    return value + 1;
  } catch (e) {
    console.error(`increment: ${e}`);
    return null;
  }
}

/**
 * Return the absolute numeric value.
 * @param {number|string} value - The value to normalize.
 * @returns {number|null} The absolute value, or null when the input is not numeric.
 */
function helper_adc_absolute_value(value) {
  try {
    const numericValue = Number(value);

    if (Number.isNaN(numericValue)) {
      return null;
    }

    return Math.abs(numericValue);
  } catch (e) {
    console.error(`helper_adc_absolute_value: ${e}`);
    return null;
  }
}

/**
 * Normalize a GPIO port/pin pair into the compact pin identifier used by remap rules.
 * Accepted inputs include ('E', 7), ('GPIOE', 'GPIO_PIN_7') and a pin string such as 'PE7'.
 * @param {*} port - GPIO port value or object.
 * @param {*} pin - GPIO pin value or object.
 * @returns {string|null} Normalized pin name such as 'PE7', or null when it cannot be resolved.
 */
function helper_adc_normalize_gpio_pin(port, pin) {
  if ((port === undefined || port === null) && (pin === undefined || pin === null)) {
    return null;
  }

  const pinText = typeof pin === 'object' ? JSON.stringify(pin) : String(pin ?? '');
  const pinWithPortMatch = pinText.toUpperCase().match(/P([A-Z])\s*_?\s*(\d+)/);

  if (pinWithPortMatch) {
    return `P${pinWithPortMatch[1]}${pinWithPortMatch[2]}`;
  }

  const portText = typeof port === 'object' ? JSON.stringify(port) : String(port ?? '');
  const portMatch = portText.toUpperCase().match(/(?:GPIO)?([A-Z])$/);
  const pinMatch = pinText.toUpperCase().match(/(\d+)$/);

  if (!portMatch || !pinMatch) {
    return null;
  }

  return `P${portMatch[1]}${pinMatch[1]}`;
}

/**
 * Add a normalized GPIO pin string to a list when it is already in compact form.
 * @param {Array} pins - Destination list of normalized pins.
 * @param {*} value - Candidate value to normalize.
 */
function helper_adc_add_normalized_gpio_pin(pins, value) {
  if (typeof value !== 'string') {
    return;
  }

  const normalizedValue = value.toUpperCase();
  if (/^P[A-Z][0-9]+$/.test(normalizedValue) && !pins.includes(normalizedValue)) {
    pins.push(normalizedValue);
  }
}

/**
 * Recursively collect allocated GPIO pins from the structure returned by GPIO helpers.
 * The exact object shape can vary between generators, so this scans common fields and nested values.
 * @param {*} value - GPIO allocation data or nested value.
 * @param {Array} pins - Destination list of normalized pins.
 */
function helper_adc_collect_allocated_gpio_pins(value, pins) {
  if (value === undefined || value === null) {
    return;
  }

  if (typeof value === 'string') {
    helper_adc_add_normalized_gpio_pin(pins, value);
    return;
  }

  if (Array.isArray(value)) {
    value.forEach((entry) => helper_adc_collect_allocated_gpio_pins(entry, pins));
    return;
  }

  if (typeof value !== 'object') {
    return;
  }

  ['id', 'name', 'connectionInstance'].forEach((key) => {
    helper_adc_add_normalized_gpio_pin(pins, value[key]);
  });

  if (value.port !== undefined && value.pin !== undefined) {
    const configPins = Array.isArray(value.pin) ? value.pin : [value.pin];

    configPins.forEach((pin) => {
      const normalizedPin = helper_adc_normalize_gpio_pin(value.port, pin);

      if (normalizedPin && !pins.includes(normalizedPin)) {
        pins.push(normalizedPin);
      }
    });
  }

  Object.keys(value).forEach((key) => helper_adc_collect_allocated_gpio_pins(value[key], pins));
}

/**
 * Extract every allocated GPIO pin from the GPIO configuration context.
 * @param {object} gpioConfigs - Allocated GPIO configuration returned by helper_gpio_get_allocated_resource_needs().
 * @returns {Array} List of normalized GPIO pins, for example ['PE7'].
 */
function helper_adc_get_allocated_gpio_pins(gpioConfigs) {
  try {
    const pins = [];

    helper_adc_collect_allocated_gpio_pins(gpioConfigs, pins);

    return pins;
  } catch (e) {
    console.error(`helper_adc_get_allocated_gpio_pins: ${e}`);
    return [];
  }
}

/**
 * Normalize an ADC channel source to the form used in remap rules.
 * Examples: 'ADC3_INP3' and 'ADC3_IN3' both become 'ADC3_IN3'.
 * @param {*} source - Candidate channel source.
 * @returns {string|null} Normalized source name, or null when not a string.
 */
function helper_adc_normalize_channel_source(source) {
  if (typeof source !== 'string') {
    return null;
  }

  const normalizedSource = source.toUpperCase();
  const channelMatch = normalizedSource.match(/^ADC(\d+)_INP?(\d+)$/);

  if (channelMatch) {
    return `ADC${channelMatch[1]}_IN${channelMatch[2]}`;
  }

  return normalizedSource;
}

/**
 * Normalize and append an ADC channel source to the given list.
 * @param {Array} sources - Destination list of normalized channel sources.
 * @param {*} source - Candidate channel source.
 */
function helper_adc_push_normalized_channel_source(sources, source) {
  const normalizedSource = helper_adc_normalize_channel_source(source);

  if (normalizedSource) {
    sources.push(normalizedSource);
  }
}

/**
 * Return normalized channel sources from the enabled ADC channel configuration list.
 * @param {Array} channels - ADC channel configuration list.
 * @returns {Array} Normalized channel sources.
 */
function helper_adc_get_enabled_channel_sources(channels) {
  try {
    const sources = [];

    (channels || []).forEach((channel) => {
      if (!channel?.use_channel) {
        return;
      }

      [channel._foreignKey, channel.source, channel.id].forEach((source) => {
        helper_adc_push_normalized_channel_source(sources, source);
      });
    });

    return sources;
  } catch (e) {
    console.error(`helper_adc_get_enabled_channel_sources: ${e}`);
    return [];
  }
}

/**
 * Return normalized channel sources referenced by regular or injected sequencers.
 * This catches generated channels even when the channel tab state is not enough to infer usage.
 * @param {Array} sequencers - List containing regular and injected sequencer arrays.
 * @returns {Array} Normalized channel sources.
 */
function helper_adc_get_sequencer_channel_sources(sequencers) {
  try {
    const sources = [];

    (sequencers || []).forEach((sequencer) => {
      (sequencer || []).forEach((entry) => {
        helper_adc_push_normalized_channel_source(sources, entry?._foreignKey);
        helper_adc_push_normalized_channel_source(sources, entry?.source);
        helper_adc_push_normalized_channel_source(sources, entry?.id);
        helper_adc_push_normalized_channel_source(sources, entry?.channel?._foreignKey);
        helper_adc_push_normalized_channel_source(sources, entry?.channel?.source);
        helper_adc_push_normalized_channel_source(sources, entry?.channel?.id);
      });
    });

    return sources;
  } catch (e) {
    console.error(`helper_adc_get_sequencer_channel_sources: ${e}`);
    return [];
  }
}

/**
 * Build the ADC option-register channel pin remap flag combination.
 * GPIO remaps are selected only when the matching ADC channel is enabled and
 * the alternate pin is allocated. OPAMP remaps are selected from the enabled
 * internal source because they do not have a GPIO target pin.
 * @param {Array} channels - ADC channel configuration list.
 * @param {object} gpioConfigs - Allocated GPIO configuration returned by helper_gpio_get_allocated_resource_needs().
 * @param {string} resourceName - Current ADC resource name.
 * @param {string} layer - Software layer prefix, either HAL or LL.
 * @param {Array} regularSequencer - Regular sequencer channel list.
 * @param {Array} injectedSequencer - Injected sequencer channel list.
 * @returns {string} Flag combination, or an empty string when no remap is needed.
 */
function helper_adc_get_channel_pin_remap_flags(channels, gpioConfigs, resourceName, layer, regularSequencer, injectedSequencer) {
  try {
    const resource = typeof resourceName === 'string' ? resourceName.toUpperCase() : '';
    const prefix = layer === 'LL' ? 'LL' : 'HAL';
    const enabledSources = [
      ...helper_adc_get_enabled_channel_sources(channels),
      ...helper_adc_get_sequencer_channel_sources([regularSequencer, injectedSequencer])
    ];
    const allocatedPins = helper_adc_get_allocated_gpio_pins(gpioConfigs);
    const remapRules = [
      {
        resource: 'ADC1',
        sources: ['OPAMP3_INT', 'OPAMP3_INST', 'OPAMP3_OPAMPINT'],
        halFlag: 'HAL_ADC_REMAP_ADC1_IN7_PA7_TO_OPAMP3',
        llFlag: 'LL_ADC_REMAP_ADC1_IN7_PA7_TO_OPAMP3'
      },
      {
        resource: 'ADC1',
        sources: ['OPAMP2_INT', 'OPAMP2_OPAMPINT'],
        halFlag: 'HAL_ADC_REMAP_ADC1_IN10_PC2_TO_OPAMP2',
        llFlag: 'LL_ADC_REMAP_ADC1_IN10_PC2_TO_OPAMP2'
      },
      {
        resource: 'ADC2',
        sources: ['ADC2_IN13'],
        pin: 'PH5',
        halFlag: 'HAL_ADC_REMAP_ADC2_IN13_PA6_TO_PH5',
        llFlag: 'LL_ADC_REMAP_ADC2_IN13_PA6_TO_PH5'
      },
      {
        resource: 'ADC3',
        sources: ['ADC3_IN3'],
        pin: 'PE7',
        halFlag: 'HAL_ADC_REMAP_ADC3_IN3_PB13_TO_PE7',
        llFlag: 'LL_ADC_REMAP_ADC3_IN3_PB13_TO_PE7'
      },
      {
        resource: 'ADC3',
        sources: ['ADC3_IN6'],
        pin: 'PE10',
        halFlag: 'HAL_ADC_REMAP_ADC3_IN6_PB14_TO_PE10',
        llFlag: 'LL_ADC_REMAP_ADC3_IN6_PB14_TO_PE10'
      },
      {
        resource: 'ADC3',
        sources: ['ADC3_IN7'],
        pin: 'PE11',
        halFlag: 'HAL_ADC_REMAP_ADC3_IN7_PC3_TO_PE11',
        llFlag: 'LL_ADC_REMAP_ADC3_IN7_PC3_TO_PE11'
      },
      {
        resource: 'ADC3',
        sources: ['ADC3_IN10'],
        pin: 'PF12',
        halFlag: 'HAL_ADC_REMAP_ADC3_IN10_PB15_TO_PF12',
        llFlag: 'LL_ADC_REMAP_ADC3_IN10_PB15_TO_PF12'
      }
    ];

    return remapRules
      .filter((rule) => rule.resource === resource)
      .filter((rule) => rule.sources.some((source) => enabledSources.includes(source)))
      .filter((rule) => !rule.pin || allocatedPins.includes(rule.pin))
      .map((rule) => (prefix === 'LL' ? rule.llFlag : rule.halFlag))
      .filter((flag, index, flags) => flags.indexOf(flag) === index)
      .join(' | ');
  } catch (e) {
    console.error(`helper_adc_get_channel_pin_remap_flags: ${e}`);
    return '';
  }
}

/**
 * Transform the channel name to its corresponding ADC channel name.
 * @param {string} channel - The channel name to be transformed.
 * @returns {string} The transformed channel name.
 */
function helper_adc_transform_channel_name(channel) {
  try {
    // Normalize the input string to uppercase for comparison
    const channelUpper = channel.toUpperCase();

    // Special cases with uppercase keys
    const specialCases = {
      'VREFINT': 'ADC_CHANNEL_VREFINT',
      'VSENS': 'ADC_CHANNEL_TEMPSENSOR',
      'VSENSE': 'ADC_CHANNEL_TEMPSENSOR',
      'VBAT/4': 'ADC_CHANNEL_VBAT',
      'VCORE': 'ADC_CHANNEL_VDDCORE',
      'VDDCORE': 'ADC_CHANNEL_VDDCORE',
      'OPAMP1_INT': 'ADC_CHANNEL_OPAMP1_OUT',
      'OPAMP2_INT': 'ADC_CHANNEL_OPAMP2_OUT',
      'OPAMP3_INST': 'ADC_CHANNEL_OPAMP3_OUT',
      'OPAMP3_INT': 'ADC_CHANNEL_OPAMP3_OUT',
      'DAC_INT1': 'ADC_CHANNEL_DAC1CH1',
      'DAC1_OUT1': 'ADC_CHANNEL_DAC1CH1',
      'DAC1_OUT2': 'ADC_CHANNEL_DAC1CH2',
      'OPAMP1_OPAMPINT': 'ADC_CHANNEL_OPAMP1_OUT',
      'OPAMP2_OPAMPINT': 'ADC_CHANNEL_OPAMP2_OUT',
      'OPAMP3_OPAMPINT': 'ADC_CHANNEL_OPAMP3_OUT',
      'VDDARRAY': 'ADC_CHANNEL_VDDARRAY',
    };
    if (specialCases[channelUpper]) {
      return specialCases[channelUpper];
    }

    // Regular expressions to test against the original channel string
    const patterns = [
      /ADC1_IN(\d+)/,
      /ADC2_IN(\d+)/,
      /ADC3_IN(\d+)/,
      /ADC4_IN(\d+)/,
      /ADC1_INP(\d+)/,
      /ADC2_INP(\d+)/,
      /ADC3_INP(\d+)/,
      /ADC4_INP(\d+)/,
      /ADC12_INP(\d+)/,
      /ADC123_INP(\d+)/
    ];

    // Iterate over patterns and return transformed channel if matched
    for (const pattern of patterns) {
      const match = channel.match(pattern);
      if (match) {
        return `ADC_CHANNEL_${match[1]}`;
      }
    }

    // Default case: return the original channel string
    return channel;
  } catch (e) {
    console.error(`transform_channel_name: ${e}`);
    return null;
  }
}

/**
 * Generate code with combination of ADC internal channels (logical OR) with path enable in ADC common instance.
 * @param {list of string} list_channels - List of channels in json format.
 * @returns {string} Combination or channels logical OR, example: "LL_ADC_CHANNEL_TEMPSENSOR | LL_ADC_CHANNEL_VREFINT"
 */
function helper_adc_common_path_internal_channels_combination(list_channels) {
  try {
    // 1. Mapping special names
    const mapSpecial = {
      'VREFINT': 'ADC_CHANNEL_VREFINT',
      'VSENS': 'ADC_CHANNEL_TEMPSENSOR',
      'VSENSE': 'ADC_CHANNEL_TEMPSENSOR',
      'VBAT/4': 'ADC_CHANNEL_VBAT',
    };

    // 2. Filter channels with use_channel "true" and extract _foreignKey
    let keys = (list_channels || [])
      .filter(ch => ch.use_channel)
      .map(ch => (ch._foreignKey || '').toUpperCase())
      .filter(k => Object.keys(mapSpecial).includes(k));

    // 3. Map to special names and add prefix "LL_"
    keys = keys.map(k => `LL_${mapSpecial[k]}`);

    // 4. Concatenate with " | "
    let result = keys.join(' | ');

    // 5. If no element, return empty string
    if (!result) {
      result = '';
    }

    // 6. Return string
    return result;
  } catch (e) {
    console.error(`transform_channel_name: ${e}`);
    return null;
  }
}

/**
 * Lookup a channel by its foreign key in the list of channels.
 * @param {Array} channels - The list of channels.
 * @param {string} source - The foreign key to lookup.
 * @returns {object|null} The found channel object or null if not found.
 */
function helper_adc_lookup_channel(channels, source) {
  try {
    return channels.find(channel => channel._foreignKey === source);
  } catch (e) {
    console.error(`lookup_channel: ${e}`);
    return null;
  }
}

/**
 * Get the length of the given array.
 * @param {Array} array - The array whose length is to be determined.
 * @returns {number} The length of the array, or 1 if the array is empty.
 */
function helper_adc_get_sequencer_length(array) {
  try {
    const length = array.length;
    return length === 0 ? 1 : length;
  } catch (e) {
    console.error(`sequencer_length: ${e}`);
    return null;
  }
}

/**
 * Check if the given array has more than one element.
 * @param {Array} array - The array to be checked.
 * @returns {number} Returns 1 if the array has more than one element, otherwise returns 0.
 */
function helper_adc_is_sequencer_not_empty(array) {
  try {
    return (array && array.length >= 1) ? 1 : 0;
  } catch (e) {
    console.error(`helper_adc_is_sequencer_not_empty: ${e}`);
    return null;
  }
}

/**
 * Transform ADC trigger name to match LL&HAL ADC drivers literals
 * @param {string} trigger - Trigger name to be transformed.
 * @returns {string} Transformed trigger name.
 */
function helper_adc_transform_trigger_name(trigger) {
  try {
    // Validate input
    if (!trigger || typeof trigger !== 'string') {
      console.error('Invalid trigger input');
      return null;
    }

    // Set to uppercase
    trigger = trigger.toUpperCase();

    // EXT_IT[n] -> EXTIn
    let match = trigger.match(/^EXT_IT\[(\d+)\]$/);
    if (match) {
      trigger = 'EXTI' + match[1];
    }

    // Manage triggers from HRTIM
    // step 1: HRTIM_xxx -> HRTIM1_xxx
    match = trigger.match(/^HRTIM_(.+)$/);
    if (match) {
      trigger = 'HRTIM1_' + match[1];
    }
    // step 2: HRTIMn_ADC_xxx -> HRTIMn_xxx
    match = trigger.match(/^HRTIM(\d+)_ADC_(.+)$/);
    if (match) {
      trigger = 'HRTIM' + match[1] + '_' + match[2];
    }

    return trigger;
  } catch (e) {
    console.error(`transform_trigger_name: ${e}`);
    return null;
  }
}

/**
 * Check if an ADC channel is internal.
 * A channel is considered internal when it does not start with 'ADC'.
 * @param {string} channel - The channel identifier (e.g., 'ADC1_IN1', 'VREFINT').
 * @returns {boolean} Returns true if the channel is internal, false otherwise.
 */
function helper_adc_is_internal_channel(channel) {
  try {
    if (typeof channel !== 'string' || channel.length === 0) {
      return false;
    }
    return !channel.toUpperCase().startsWith('ADC');
  } catch (e) {
    console.error(`helper_adc_is_internal_channel: ${e}`);
    return false;
  }
}

/**
 * Check if the channel_id has been configured in input
 * @param {object} channels list of configured channels
 * @param {string} adc_id id of the ADC (e.g., 'ADC1', 'ADC2', 'ADC3')
 * @param {string} channel_id id of the channel (e.g., 'INP0')
 * @param {string} path parameter to check
 * @returns {string} The value of the parameter if it exists, null otherwise
 */
function helper_adc_get_param_in_channel_config(channels, adc_id, channel_id, path) {
  try {
    // Create a regex pattern to match the full channel identifier
    const pattern = new RegExp(`^ADC(\\d+|12|123)_${channel_id}$`);

    const channel = channels.find(function (channel) {
      return pattern.test(channel._foreignKey);
    });

    if (channel) {
      if (path.includes('.')) {
        return path.split('.').reduce((obj, key) => (obj && obj[key] !== 'undefined') ? obj[key] : null, channel);
      } else {
        return channel[path] !== undefined ? channel[path] : null;
      }
    } else {
      return null;
    }
  } catch (e) {
    console.error(`helper_adc_get_param_in_channel_config: ${e}`);
    return null;
  }
}

/**
 * Transform a boolean value to "ENABLE" or "DISABLE".
 * @param {boolean} value - The boolean value to be transformed.
 * @returns {string} "ENABLE" if the value is true, "DISABLE" if the value is false.
 */
function helper_adc_boolean_to_enable_disable(value) {
  try {
    if (typeof value === 'boolean') {
      return value ? 'ENABLE' : 'DISABLE';
    }
    return 'DISABLE'; // Default to DISABLE if the value is not a boolean
  } catch (e) {
    console.error(`helper_enable_disable: ${e}`);
    return 'DISABLE';
  }
}

/**
 * Helper to get the AWD panels from the context and return them in an array.
 * Each panel is included if its selection property (awd1_sel, awd2_sel, awd3_sel) is true.
 * @param {object} context - The context object containing the additional property.
 * @param {object} options - Handlebars options object.
 * @returns {string} The rendered template with the AWD panels.
 */
function helper_adc_get_awd_panels(context, options) {
  const awdPanels = [];
  // Check if AWD1 panel is selected and add it to the array
  if (context.additional.awd1_panel && context.additional.awd1_panel.awd1_sel) {
    awdPanels.push({ panel: context.additional.awd1_panel, awd_number: 1 });
  }
  // Check if AWD2 panel is selected and add it to the array
  if (context.additional.awd2_panel && context.additional.awd2_panel.awd2_sel) {
    awdPanels.push({ panel: context.additional.awd2_panel, awd_number: 2 });
  }
  // Check if AWD3 panel is selected and add it to the array
  if (context.additional.awd3_panel && context.additional.awd3_panel.awd3_sel) {
    awdPanels.push({ panel: context.additional.awd3_panel, awd_number: 3 });
  }
  // Return the rendered template with the AWD panels
  return options.fn({ awdPanels });
}

/**
 * Helper to get the offset panels from the context and return them in an array.
 * Each panel is included if its selection property (offset_1_sel, offset_2_sel, offset_3_sel, offset_4_sel) is true.
 * @param {object} context - The context object containing the additional property.
 * @param {object} options - Handlebars options object.
 * @returns {string} The rendered template with the offset panels.
 */
function helper_adc_get_offset_panels(context, options) {
  const offsetPanels = [];
  // Check if offset 1 panel is selected and add it to the array
  if (context.additional.offset_1_panel && context.additional.offset_1_panel.offset_1_sel) {
    offsetPanels.push({ panel: context.additional.offset_1_panel, offset_number: 1 });
  }
  // Check if offset 2 panel is selected and add it to the array
  if (context.additional.offset_2_panel && context.additional.offset_2_panel.offset_2_sel) {
    offsetPanels.push({ panel: context.additional.offset_2_panel, offset_number: 2 });
  }
  // Check if offset 3 panel is selected and add it to the array
  if (context.additional.offset_3_panel && context.additional.offset_3_panel.offset_3_sel) {
    offsetPanels.push({ panel: context.additional.offset_3_panel, offset_number: 3 });
  }
  // Check if offset 4 panel is selected and add it to the array
  if (context.additional.offset_4_panel && context.additional.offset_4_panel.offset_4_sel) {
    offsetPanels.push({ panel: context.additional.offset_4_panel, offset_number: 4 });
  }
  // Return the rendered template with the offset panels
  return options.fn({ offsetPanels });
}

/**
 * Handlebars Helper: helper_adc_remove_suffix
 * Removes the suffix '_BIT' or '_BITS' (case-insensitive) from the end of a string.
 * @param {string} input - The input string.
 * @returns {string} - The string without the suffix, or original if no suffix found.
 */
function helper_adc_remove_suffix(input) {
  try {
    if (typeof input !== 'string') {
      return input;
    }
    const pattern = /_BIT(S)?$/i;

    return input.replace(pattern, '');
  } catch (e) {
    console.error(`[ERROR] helper_adc_remove_suffix: ${e}`);
    return input;
  }
}

/**
  * Retrieve all the interruptions set by ADC but not generated
  * @param {object} nvic_api Getter on NVIC api
  * @param {object} exti_api Getter on EXTI api (not used)
  * @param {object} resource Current resource
  * @param {object} config current configuration of the ADC
  * @returns {object}
  */
function helper_adc_get_irq_handler(nvic_api, exti_api, resource, config) {
  let result = [];
  try {
    /** Reference all the elements which enable the ADC interruptions
     * @type {Array} List of interruptions available for the ADC
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
      /** Check if interruption has been enabled on the ADC */
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
    console.error(`helper_adc_get_irq_handler: ${e}`);
  }
  return result;
}

/**
 * Get the gain value for LL API based on the input gain string.
 */
function helper_adc_get_ll_gain_value(gain) {
  try {
    const gainValue = Number(gain);

    if (Number.isNaN(gainValue)) {
      return 0;
    }

    return Math.trunc((gainValue * 4096) / 1000);
  } catch (e) {
    console.error(`helper_adc_get_ll_gain_value: ${e}`);
  }
}

module.exports = {
  helper_adc_increment,
  helper_adc_absolute_value,
  helper_adc_lookup_channel,
  helper_adc_transform_channel_name,
  helper_adc_common_path_internal_channels_combination,
  helper_adc_transform_trigger_name,
  helper_adc_is_internal_channel,
  helper_adc_get_sequencer_length,
  helper_adc_post_processing_get_firstChar,
  helper_adc_removeUnderscore,
  helper_adc_compute_sampling,
  helper_adc_compute_frequency,
  helper_adc_get_param_in_channel_config,
  helper_adc_find_channel_enable,
  helper_adc_can_enable_differential_input,
  helper_adc_get_v8_channel_sources,
  helper_adc_get_standard_channel_sources,
  helper_adc_get_query_parent,
  helper_adc_mm_is_slave,
  helper_adc_mm_is_regular_mode,
  helper_adc_mm_is_injected_mode,
  helper_adc_mm_is_interleaved_mode,
  helper_adc_mm_is_slave_regular_mode,
  helper_adc_mm_is_slave_injected_mode,
  helper_adc_mm_is_slave_interleaved_mode,
  helper_adc_interl_delay_assert,
  helper_adc_get_multimode_other_instance,
  helper_adc_is_v8_query_channel,
  helper_adc_is_standard_query_channel,
  helper_adc_boolean_to_enable_disable,
  helper_adc_get_awd_panels,
  helper_adc_get_offset_panels,
  helper_adc_is_sequencer_not_empty,
  helper_adc_remove_suffix,
  helper_adc_get_irq_handler,
  helper_adc_get_ll_gain_value,
  helper_adc_get_channel_pin_remap_flags,
  helper_adc_normalize_gpio_pin,
  helper_adc_add_normalized_gpio_pin,
  helper_adc_collect_allocated_gpio_pins,
  helper_adc_get_allocated_gpio_pins,
  helper_adc_normalize_channel_source,
  helper_adc_push_normalized_channel_source,
  helper_adc_get_enabled_channel_sources,
  helper_adc_get_sequencer_channel_sources,
  helper_adc_is_multiadc_trigger_from_other,
};
