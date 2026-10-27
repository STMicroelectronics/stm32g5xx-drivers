/**
 * @file Helper functions used by the HRTIM software component
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
 * Get the list of compare units supported by a slave timer
 * @param {string} timer_name master or slave timer
 * @returns {object[]} array of compare unit descriptors
 */
function helper_hrtim_get_compare_units(timer_name) {
  const compare_units = [
    {
      name: "Unit 1",
      features: {
        greater_than_comparison_mode: true,
        auto_delayed_mode: false,
        triggered_half_mode: false,
      }
    },
    {
      name: "Unit 2",
      features: {
        greater_than_comparison_mode: false,
        auto_delayed_mode: true,
        triggered_half_mode: true,
      }
    },
    {
      name: "Unit 3",
      features: {
        greater_than_comparison_mode: true,
        auto_delayed_mode: false,
        triggered_half_mode: false,
      }
    },
    {
      name: "Unit 4",
      features: {
        greater_than_comparison_mode: false,
        auto_delayed_mode: true,
        triggered_half_mode: false,
      }
    }
  ];

  try {
    //console.info(`helper_hrtim_get_compare_units: timer_name=${timer_name}`);

    if (timer_name === "Timer M") {
      compare_units.forEach(unit => {
        unit.features.greater_than_comparison_mode = false;
        unit.features.auto_delayed_mode = false;
        unit.features.triggered_half_mode = false;
      });
    }

    //console.info(`helper_hrtim_get_compare_units: compare_units=${JSON.stringify(compare_units)}`);
  } catch (error) {
    console.error(`helper_hrtim_get_compare_units: ${error}`);
  }

  return compare_units;
}

/**
 * Get the list of capture units supported by a slave timer
 * @returns {object[]} array of capture unit descriptors
 */
function helper_hrtim_get_capture_units() {
  const capture_units = [
    {
      name: "Unit 1"
    },
    {
      name: "Unit 2"
    }
  ];

  try {
    // console.info(`helper_hrtim_get_capture_units`);

  } catch (error) {
    console.error(`helper_hrtim_get_capture_units: ${error}`);
  }

  return capture_units;
}

/**
 * Get the list of ADC triggers
 * @returns {object[]} Array of adc triggers descriptors
 */
function helper_hrtim_get_adc_tiggers() {
  const adc_triggers = [
    {
      name: "ADC trigger 1",
      number: 1,
      combined_sources: true
    },
    {
      name: "ADC trigger 2",
      number: 2,
      combined_sources: true
    },
    {
      name: "ADC trigger 3",
      number: 3,
      combined_sources: true
    },
    {
      name: "ADC trigger 4",
      number: 4,
      combined_sources: true
    },
    {
      name: "ADC trigger 5",
      number: 5,
      combined_sources: false
    },
    {
      name: "ADC trigger 6",
      number: 6,
      combined_sources: false
    },
    {
      name: "ADC trigger 7",
      number: 7,
      combined_sources: false
    },
    {
      name: "ADC trigger 8",
      number: 8,
      combined_sources: false
    },
    {
      name: "ADC trigger 9",
      number: 9,
      combined_sources: false
    },
    {
      name: "ADC trigger 10",
      number: 10,
      combined_sources: false
    }
  ];

  try {
    // console.info(`helper_hrtim_get_adc_tiggers`);

  } catch (error) {
    console.error(`helper_hrtim_get_adc_tiggers: ${error}`);
  }

  return adc_triggers;
}

/**
 * Determine whether at least one resource has a truthy value for the given key
 * @param {object[]} resources resources array
 * @param {string} key property name to check (e.g. "use", "use_channel")
 * @returns {boolean} true if at least one resource is used, false otherwise
 */
function helper_hrtim_any_resource_used(resources, key) {
  let anyUsed = false;

  if (!resources || !Array.isArray(resources) || typeof key !== "string") {
    return anyUsed;
  }

  try {
    // console.info(`helper_hrtim_any_resource_used: resources=${JSON.stringify(resources)}, key=${key}`);
    anyUsed = resources.some(event => !!event[key]);
  } catch (error) {
    console.error(`helper_hrtim_any_resource_used: ${error}`);
  }

  return anyUsed;
}

/**
 * Check whether the resource is used
 * @param {object} config resource configuration
 * @param {string} resource (output channel, external event, fault input or timer)
 * @returns true if the resource is used, false otherwise.
 */
function helper_hrtim_is_used_resource(config, resource) {
  let isUsed = false;

  try {
    // console.info(`helper_hrtim_is_used_resource: config=${JSON.stringify(config)},  resource=${resource}`);

    if (resource === undefined || config === undefined) {
      return false;
    }

    const item = config.find(item => item._foreignKey === resource);

    if (item) {
      isUsed = item.use;
    }
  } catch (error) {
    console.error(`helper_hrtim_is_used_resource: ${error}`);
  }

  return isUsed;
}

function helper_hrtim_convert_timer(timer) {
  try {
    // console.info(`helper_hrtim_convert_timer: timer=${timer}`);

    const timerMap = {
      "Timer M": "MASTER",
      "Timer A": "TIMA",
      "Timer B": "TIMB",
      "Timer C": "TIMC",
      "Timer D": "TIMD",
      "Timer E": "TIME",
      "Timer F": "TIMF"
    };

    return timerMap[timer];
  } catch (error) {
    console.error(`helper_hrtim_convert_timer: ${error}`);
    return "";
  }
}

/**
 * Extract the capture/compare unit number from the capture/compare string
 * @param {string} cc_unit capture/compare unit name
 * @returns {string} capture/compare unit number
 */
function helper_hrtim_extract_unit_number(cc_unit) {
  try {
    // console.info(`helper_hrtim_extract_unit_number: cc_unit=${cc_unit}`);

    const match = cc_unit.match(/Unit\s+(\d+)/);
    return match ? match[1] : '';
  } catch (error) {
    console.error(`helper_hrtim_extract_unit_number: ${error}`);
    return "";
  }
}

/**
 * Check whether an event can be used to set or reset the output.
 * @param {string} output output channel
 * @param {string} event from timing unit
 * @returns {boolean} true if the event can be used to set or reset the output, false otherwise
 */
function helper_hrtim_is_event_relevant_to_output(output, event) {
  const lookupTable = {
    "CHA": ["TACMP1", "TACMP2", "TACMP3", "TACMP4", "TBCMP1", "TBCMP2", "TCCMP2", "TCCMP3", "TDCMP1", "TDCMP2", "TECMP3", "TECMP4", "TFCMP4"],
    "CHB": ["TACMP1", "TACMP2", "TBCMP1", "TBCMP2", "TBCMP3", "TBCMP4", "TCCMP3", "TCCMP4", "TDCMP3", "TDCMP4", "TECMP1", "TECMP2", "TFCMP3"],
    "CHC": ["TACMP2", "TACMP3", "TBCMP2", "TBCMP3", "TCCMP1", "TCCMP2", "TCCMP3", "TCCMP4", "TDCMP2", "TDCMP4", "TECMP3", "TECMP4", "TFCMP2"],
    "CHD": ["TACMP1", "TACMP4", "TBCMP2", "TBCMP4", "TCCMP4", "TDCMP1", "TDCMP2", "TDCMP3", "TDCMP4", "TECMP1", "TECMP4", "TFCMP1", "TFCMP3"],
    "CHE": ["TACMP4", "TBCMP3", "TBCMP4", "TCCMP1", "TCCMP2", "TDCMP1", "TDCMP2", "TECMP1", "TECMP2", "TECMP3", "TECMP4", "TFCMP3", "TFCMP4"],
    "CHF": ["TACMP3", "TBCMP1", "TBCMP4", "TCCMP1", "TCCMP4", "TDCMP3", "TDCMP4", "TECMP2", "TECMP3", "TFCMP1", "TFCMP2", "TFCMP3", "TFCMP4"]
  };
  let isRelevantEvent = false;

  try {
    // console.info(`helper_hrtim_is_event_relevant_to_output: output=${output}, event=${event}`);

    const baseOutput = output.slice(0, 3);
    if (!lookupTable[baseOutput]) {
      return false;
    }

    isRelevantEvent = lookupTable[baseOutput].includes(event)
  } catch (error) {
    console.error(`helper_hrtim_is_event_relevant_to_output: ${error}`);
    return false;
  }

  return isRelevantEvent;
}

function helper_hrtim_is_blanking_relevant_to_timer(timer, blanking) {
  const lookupTable = {
    'Timer A': ['TBRST_TBCMP1', 'TBRST_TBCMP4', 'CHB2', 'TCRST_TCCMP1', 'TCRST_TCCMP4', 'TFRST_TFCMP1', 'TDRST_TDCMP1', 'TERST_TECMP2'],
    'Timer B': ['TARST_TACMP1', 'TARST_TACMP4', 'CHA2', 'TCRST_TCCMP1', 'TCRST_TCCMP2', 'TFRST_TFCMP2', 'TDRST_TDCMP2', 'TERST_TECMP1'],
    'Timer C': ['TARST_TACMP2', 'TBRST_TBCMP1', 'TBRST_TBCMP4', 'TFRST_TFCMP1', 'TDRST_TDCMP1', 'TDRST_TDCMP4', 'CHD2', 'TERST_TECMP4'],
    'Timer D': ['TARST_TACMP1', 'TBRST_TBCMP2', 'TCRST_TCCMP1', 'TCRST_TCCMP2', 'CHC2', 'TERST_TECMP1', 'TERST_TECMP4', 'TFRST_TFCMP4'],
    'Timer E': ['TARST_TACMP2', 'TBRST_TBCMP1', 'TCRST_TCCMP1', 'TFRST_TFCMP4', 'CHF2', 'TDRST_TDCMP1', 'TDRST_TDCMP4', 'CHD2'],
    'Timer F': ['TARST_TACMP4', 'TBRST_TBCMP2', 'TCRST_TCCMP4', 'TDRST_TDCMP2', 'TDRST_TDCMP4', 'TERST_TECMP1', 'TERST_TECMP4', 'CHE2']
  };

  let isRelevantBlanking = false;

  try {
    // console.info(`helper_hrtim_is_blanking_relevant_to_timer: timer=${timer}, blanking=${blanking}`);

    if (lookupTable.hasOwnProperty(timer)) {
      isRelevantBlanking = lookupTable[timer].includes(blanking);
    }
  } catch (error) {
    console.error(`helper_hrtim_is_blanking_relevant_to_timer: ${error}`);
  }

  return isRelevantBlanking;
}

/**
 * Check whether a windowing configuration can filter an event at timing unit level.
 * @param {string} timer timing unit
 * @param {string} windowing configuration
 * @returns {boolean} true if the windowing configuration can be used, false otherwise
 */
function helper_hrtim_is_windowing_relevant_to_timer(timer, windowing) {
  const lookupTable = {
    'Timer A': ['TBRST_TBCMP2', 'TBCMP2_TBRST', 'TBCMP1_TBRST'],
    'Timer B': ['TARST_TACMP2', 'TACMP2_TARST', 'TACMP1_TARST'],
    'Timer C': ['TDRST_TDCMP2', 'TDCMP2_TDRST', 'TDCMP1_TDRST'],
    'Timer D': ['TCRST_TCCMP2', 'TCCMP2_TCRST', 'TCCMP1_TCRST'],
    'Timer E': ['TFRST_TFCMP2', 'TFCMP2_TFRST', 'TFCMP1_TFRST'],
    'Timer F': ['TERST_TECMP2', 'TECMP2_TERST', 'TECMP1_TERST']
  };

  let isRelevantWindowing = false;

  try {
    // console.info(`helper_hrtim_is_windowing_relevant_to_timer: timer=${timer}, blanking=${windowing}`);

    if (lookupTable.hasOwnProperty(timer)) {
      isRelevantWindowing = lookupTable[timer].includes(windowing);
    }
  } catch (error) {
    console.error(`helper_hrtim_is_windowing_relevant_to_timer: ${error}`);
  }

  return isRelevantWindowing;
}

/**
 * Check whether an event can be used as a trigger source for an ADC trigger.
 * @param {integer} adc_trigger_num - ADC trigger number (1..10)
 * @param {string} source - ADC trigger source
 * @returns {boolean} true if the event can be used, false otherwise
 */
function helper_hrtim_is_event_relevant_to_adc_trigger(adc_trigger_num, source) {
  const lookupTable = [
    {
      "adc_triggers": [1, 3, 5, 7, 9],
      "events": [
        "TAPER", "TARST", "TACMP3", "TACMP4",
        "TBPER", "TBRST", "TBCMP3", "TBCMP4",
        "TCPER", "TCCMP3", "TCCMP4",
        "TDPER", "TDCMP3", "TDCMP4",
        "TEPER", "TECMP3", "TECMP4",
        "TFPER", "TFRST", "TFCMP2", "TFCMP3", "TFCMP4",
        "EEV1", "EEV2", "EEV3", "EEV4", "EEV5"
      ]
    },
    {
      "adc_triggers": [2, 4, 6, 8, 10],
      "events": [
        "TAPER", "TACMP2", "TACMP4",
        "TBPER", "TBCMP2", "TBCMP4",
        "TCPER", "TCRST", "TCCMP2", "TCCMP4",
        "TDPER", "TDRST", "TDCMP2", "TDCMP4",
        "TERST", "TECMP2", "TECMP3", "TECMP4",
        "TFPER", "TFCMP2", "TFCMP3", "TFCMP4",
        "EEV6", "EEV7", "EEV8", "EEV9", "EEV10"
      ]
    }
  ];

  let isRelevantEvent = false;

  try {
    // console.info(`helper_hrtim_is_event_relevant_to_adc_trigger: adc_trigger_num=${adc_trigger_num}, source=${source}`);

    for (const entry of lookupTable) {
      if (entry.adc_triggers.includes(adc_trigger_num)) {
        isRelevantEvent = entry.events.includes(source);
        break;
      }
    }
  } catch (error) {
    console.error(`helper_hrtim_is_event_relevant_to_adc_trigger: ${error}`);
  }

  return isRelevantEvent;
}

function helper_hrtim_get_fault_blanking_mode(fault, blanking_mode) {

  const mapping = {
    "FLT1": {
      "RESET_ALIGNED_BLANKING": "TARST_TACMP3",
      "MOVING_BLANKING": "TACMP4_TACMP3"
    },
    "FLT2": {
      "RESET_ALIGNED_BLANKING": "TBRST_TBCMP3",
      "MOVING_BLANKING": "TBCMP4_TBCMP3"
    },
    "FLT3": {
      "RESET_ALIGNED_BLANKING": "TCRST_TCCMP3",
      "MOVING_BLANKING": "TCCMP4_TCCMP3"
    },
    "FLT4": {
      "RESET_ALIGNED_BLANKING": "TDRST_TDCMP3",
      "MOVING_BLANKING": "TDCMP4_TDCMP3"
    },
    "FLT5": {
      "RESET_ALIGNED_BLANKING": "TERST_TECMP3",
      "MOVING_BLANKING": "TECMP4_TECMP3"
    },
    "FLT6": {
      "RESET_ALIGNED_BLANKING": "TFRST_TFCMP3",
      "MOVING_BLANKING": "TFCMP4_TFCMP3"
    },
    "FLT7": {
      "RESET_ALIGNED_BLANKING": "TDRST_TDCMP1",
      "MOVING_BLANKING": "TDCMP2_TDCMP1"
    },
    "FLT8": {
      "RESET_ALIGNED_BLANKING": "TFRST_TFCMP1",
      "MOVING_BLANKING": "TFCMP2_TFCMP1"
    }
  };

  let faultBlankingMode;

  try {
    // console.info(`helper_hrtim_get_fault_blanking_mode: fault=${fault}, blanking_mode=${blanking_mode}`);

    if (mapping[fault] && mapping[fault][blanking_mode]) {
      faultBlankingMode = mapping[fault][blanking_mode];
    } else {
      throw new Error(`Invalid combination of fault: ${fault} and blanking_mode: ${blanking_mode}`);
    }
  } catch (error) {
    console.error(`helper_hrtim_get_fault_blanking_mode: ${error}`);
    faultBlankingMode = null;
  }

  return faultBlankingMode;
}

/**
 * Convert a DFP like source into a HAL/LL source related constant suffix
 * @param {string} source DFP-like source
 * @returns {string|null} HAL/LL source related constant suffix
 */
function helper_hrtim_convert_source(source) {
  let conversionResult = null;

  try {
    // console.info(`helper_hrtim_convert_source: source=${source}`);

    if (!source) {
      return 'GPIO';
    }

    let preFormatedSource = source
      .toUpperCase()
      .replace(/BREAK\[(\d+)\]/g, 'BREAK$1')
      .replace(/ /g, '_')
      .replace(/\[.*$/, '')
      .replace(/\(.*$/, '')
      .replace(/_MUX_OUT$/, '')
      .replace(/_OUT$/, '')
      .replace(/HRTIM(\d+)_SYNC_OUT1/g, 'HRTIM$1_SYNCOUT')
      .replace(/EXT_TRG(\d+)/g, (_, n) => `PLAY1_OUT${Number(n) - 1}`);

    // console.info(`[DBG] helper_hrtim_convert_source: preFormatedSource=${preFormatedSource}`);

    if (preFormatedSource.includes('TGO_CKTIM')) {
      conversionResult = preFormatedSource.replace(/TGO_CKTIM/g, 'TRGO');
    } else if (preFormatedSource.includes('AFI')) {
      conversionResult = preFormatedSource.replace(/AFI/g, 'GPIO');
    } else if (preFormatedSource.includes('_CKTRGO')) {
      conversionResult = preFormatedSource.replace(/_CKTRGO/g, '');
    } else if (preFormatedSource.includes('AWDG')) {
      conversionResult = preFormatedSource.replace(/AWDG/g, 'AWD');
    } else {
      conversionResult = preFormatedSource;
    }
  } catch (error) {
    console.error(`helper_hrtim_convert_source: ${error}`);
  }

  return conversionResult;
}

/**
 * Convert configured update gating into the corresponding HAL/LL constant.
 * @param {string} updgat update gating
 * @param {string} upden update enable input
 * @returns {string} HAL/LL update gating related constant suffix
 */
function helper_hrtim_convert_update_gating(updgat, upden) {
  let conversionResult = "";

  try {
    // console.info(`helper_hrtim_convert_update_gating: updgat=${updgat}, upden=${upden}`);

    if (updgat.includes('ENABLE_INPUT') && upden !== undefined) {
      conversionResult = helper_hrtim_convert_source(upden);

      if (updgat.includes('UPDATE')) {
        conversionResult += '_UPDATE';
      }
    } else {
      conversionResult = updgat;
    }
  } catch (error) {
    console.error(`helper_hrtim_convert_update_gating: ${error}`);
  }

  return conversionResult;
}

/**
 * Convert a configured capture trigger source into the corresponding HAL/LL constant.
 * @param {string} timer timer name
 * @param {string} event capture trigger source
 * @returns {string|null} HAL/LL capture source related constant suffix
 */
function helper_hrtim_convert_capture_or_reset_trigger_source(timer, event) {
  let conversionResult = null;

  try {
    // console.info(`helper_hrtim_convert_capture_or_reset_trigger_source: timer=${timer}, event=${event}`);

    const timx = helper_hrtim_convert_timer(timer);

    if (!timx) {
      throw new Error('Invalid timer value');
    }

    const commonEvents = ['NONE', 'EEV'];
    const containsCommonEvent = commonEvents.some(commonEvent => event.includes(commonEvent));

    if (containsCommonEvent) {
      conversionResult = event;
    } else if (event.includes(timx + '_')) {
      conversionResult = event.replace(timx + '_', '');
    } else if (event.includes('CH')) {
      conversionResult = event.replace('CH', `${timx}_CH`);
    } else {
      conversionResult = event.replace(/TIM([A-F])_/, `${timx}_T$1`);
    }
  } catch (error) {
    console.error(`helper_hrtim_convert_capture_or_reset_trigger_source: ${error}`);
  }

  return conversionResult;
}

/**
 * Convert a configured ADC trigger ID into the corresponding HAL/LL constant.
 * @param {string} layer - HAL or LL
 * @param {string} adc_trigger - ADC trigger id ('ADC trigger n')
 * @returns {string|null} HAL/LL ADC trigger related constant
 */
function helper_hrtim_convert_adc_trigger_id(layer, adc_trigger) {
  let conversionResult = null;

  try {
    // console.info(`helper_hrtim_convert_adc_trigger_id: layer=${layer}, adc_trigger=${adc_trigger}`);

    const triggerNumber = adc_trigger.match(/\d+/)[0];

      if (layer === 'HAL') {
          conversionResult = `HAL_HRTIM_ADC_TRIGGER${triggerNumber}`;
      } else if (layer === 'LL') {
          conversionResult = `LL_HRTIM_ADCTRIG${triggerNumber}`;
      } else {
          throw new Error('Invalid layer. Must be "HAL" or "LL".');
      }
  } catch (error) {
    console.error(`helper_hrtim_convert_adc_trigger_id: ${error}`);
  }

  return conversionResult;
}

/**
 * Convert a configured ADC trigger source into the corresponding HAL/LL constant.
 * @param {string} layer HAL or LL
 * @param {string} adc_trigger ADC trigger
 * @param {string} event ADC trigger source
 * @returns {string|null} HAL/LL ADC trigger source related constant
 */
function helper_hrtim_convert_adc_trigger_source(layer, adc_trigger, event) {
  let conversionResult = null;

  try {
    // console.info(`helper_hrtim_convert_adc_trigger_source: layer=${layer}, adc_trigger=${adc_trigger}, event=${event}`);

    let adcTriggerNum;
    let cstSuffix;

    if (event !== undefined) {
      cstSuffix = event;
    } else {
      cstSuffix = 'NONE';
    }

    const triggerNum = parseInt(adc_trigger.replace('ADC trigger ', ''));
    if ([1, 3].includes(triggerNum)) {
      adcTriggerNum = '13';
    } else if ([2, 4].includes(triggerNum)) {
      adcTriggerNum = '24';
    } else if ([5, 7, 9].includes(triggerNum)) {
      adcTriggerNum = '579';
      if (event === 'NONE') {
        cstSuffix = 'MASTER_CMP1';
      }
    } else if ([6, 8, 10].includes(triggerNum)) {
      adcTriggerNum = '6810';
      if (event === 'NONE') {
        cstSuffix = 'MASTER_CMP1';
      }
    } else {
      throw new Error('Invalid ADC trigger number');
    }

    let cstPrefix;
    if (layer === 'LL') {
      cstPrefix = 'LL_HRTIM_ADCTRIG_SRC' + adcTriggerNum + '_';
    } else if (layer === 'HAL') {
      cstPrefix = 'HAL_HRTIM_ADC' + adcTriggerNum + '_TRIGGER_';
    } else {
      throw new Error('Invalid layer');
    }

    conversionResult = cstPrefix + cstSuffix;
  } catch (error) {
    console.error(`helper_hrtim_convert_adc_trigger_source: ${error}`);
  }

  return conversionResult;
}

/**
 * Convert configured external event filtering into the corresponding HAL/LL constant.
 * @param {string} timer timer name
 * @param {string} substitution pattern for filtering modes from another timing unit
 * @param {string} filter external event filtering mode
 * @returns {string} HAL/LL event filter related constant suffix
 */
function helper_hrtim_convert_event_filter(timer, pattern, filter) {
  let conversionResult = filter;

  try {
    // console.info(`helper_hrtim_convert_event_filter: timer=${timer}, pattern=${pattern}, filter=${filter}`);

    if (typeof filter === 'string' && filter.includes(pattern)) {
      let timerName = helper_hrtim_convert_timer(timer);
      conversionResult = filter.replace(new RegExp(pattern, 'g'), timerName);
    }
  } catch (error) {
    console.error(`helper_hrtim_convert_event_filter: ${error}`);
  }

  return conversionResult;
}

/**
 * Convert a configured output set/reset event into the corresponding HAL/LL constant.
 * @param {string} output output channel
 * @param {string} output set/reset event
 * @returns {string|null} HAL/LL output set/reset event related constant suffix
 */
function helper_hrtim_convert_output_set_reset_event(output, set_reset_event) {
  let conversionResult = null;

  try {
    // console.info(`helper_hrtim_convert_output_set_reset_event: output=${output}, set_reset_event=${set_reset_event}`);

    const timx = output.replace(/CH(\w)\w/g, 'TIM$1');

    if (!timx) {
      throw new Error('Invalid output value');
    }

    const commonEvents = ['NONE', 'EEV', 'MASTER'];
    const containsCommonEvent = commonEvents.some(commonEvent => set_reset_event.includes(commonEvent));

    if (containsCommonEvent) {
      conversionResult = set_reset_event;
    } else if (set_reset_event.includes(timx + '_')) {
      conversionResult = set_reset_event.replace(timx + '_', '');
    } else {
      conversionResult = set_reset_event.replace(/TIM([A-F])_/, `${timx}_T$1`);
    }
  } catch (error) {
    console.error(`helper_hrtim_convert_output_set_reset_event: ${error}`);
  }

  return conversionResult;
}

/**
 * Convert a configured dual-channel DAC mode into a HAL/LL step/reset trigger constant.
 * @param {string} trigger step or reset trigger
 * @param {string} dual channel DAC mode
 * @returns {string|null} HAL/LL dual-channel DAC step/reset trigger constant suffix
 */
function helper_hrtim_convert_dual_channel_dac_trigger(trigger, mode) {
  let dualChannelDacTrigger = null;

  try {
    // console.info(`helper_hrtim_convert_dual_channel_dac_trigger: trigger=${trigger}, mode=${mode}`);

    if (trigger === 'STEP') {
      if (mode.includes('SLOPE')) {
        dualChannelDacTrigger = 'CMP2';
      } else {
        dualChannelDacTrigger = 'OUT1_RESET';
      }
    } else if (trigger === 'RESET') {
      if (mode.includes('CENTER')) {
        dualChannelDacTrigger = 'OUT1_SET';
      } else {
        dualChannelDacTrigger = 'RESET';
      }
    } else {
      throw new Error('Invalid trigger value');
    }
  } catch (error) {
    console.error(`helper_hrtim_convert_dual_channel_dac_trigger: ${error}`);
  }

  return dualChannelDacTrigger;
}

/**
 * Convert a configured burst mode clock into the corresponding HAL/LL constant.
 * @param {string} clock burst mode controller clock source
 * @param {string} burst mode clock (on-chip interconnect)
 * @returns {string|null} HAL/LL burst mode clock related constant suffix
 */
function helper_hrtim_convert_burst_mode_clock(clock, bm_ck) {
  let conversionResult = null;

  try {
    // console.info(`helper_hrtim_convert_burst_mode_clock: clock=${clock}, bm_ck=${bm_ck}`);

    if (clock === 'ONCHIP') {
      conversionResult = helper_hrtim_convert_source(bm_ck.source);
    } else {
      conversionResult = clock;
    }
  } catch (error) {
    console.error(`helper_hrtim_convert_burst_mode_clock: ${error}`);
  }

  return conversionResult;
}

/**
 * Convert a configured burst mode trigger into the corresponding HAL/LL constant.
 * @param {string} trigger burst mode trigger
 * @param {string} burst mode trigger (on-chip interconnect)
 * @returns {string|null} HAL/LL burst mode trigger related constant suffix
 */
function helper_hrtim_convert_burst_mode_trigger(trigger, bm_trg_source) {

  let conversionResult = null;

  try {
    // console.info(`helper_hrtim_convert_burst_mode_trigger: trigger=${trigger}, bm_trg_source=${bm_trg_source}`);

    if (trigger === 'ONCHIP') {
      if (bm_trg_source === undefined) {
        throw new Error('bm_trg_source is undefined for ONCHIP trigger');
      }

      if (bm_trg_source === 'ONCHIP') {
        conversionResult = 'ONCHIP';
      } else {
        conversionResult = helper_hrtim_convert_source(bm_trg_source);
      }
    } else {
      conversionResult = trigger;
    }
  } catch (error) {
    console.error(`helper_hrtim_convert_burst_mode_trigger: ${error}`);
  }

  return conversionResult;
}

/**
 * Get the output channel identifier from the timing unit and the output number
 * @param {string} timer timing unit (TIMx, x: A..F)
 * @param {number} output output channel (y: 1 or 2)
 * @returns {string} output channel identifier (CHxy)
 */
function helper_hrtim_get_output_channel(timer, output) {
  let outputChannel = '';

  try {
    // console.info(`helper_hrtim_get_output_channel: timer=${timer}, output=${output}`);

    const validTimers = ['TIMA', 'TIMB', 'TIMC', 'TIMD', 'TIME', 'TIMF'];
    if (!validTimers.includes(timer)) {
      throw new Error(`Invalid timer: ${timer}`);
    }

    if (output !== 1 && output !== 2) {
      throw new Error(`Invalid output: ${output}`);
    }

    outputChannel = timer.replace('TIM', 'CH') + output;
  } catch (error) {
    console.error(`helper_hrtim_get_output_channel: ${error}`);
  }

  return outputChannel;
}

/**
 * Get the maximum number of interrupt request sources supported by the timer.
 * @param {string} timer - Timing unit to configure.
 * @param {integer} version - HR-Timer version.
 * @returns {number} number of interrupt request sources available for the timer
 */
function helper_hrtim_get_max_interrupt_request_sources(timer, version) {
  let interruptSourcesNumber = 0;

  try {
    // console.info(`helper_hrtim_get_max_interrupt_request_sources: timer=${timer}, version=${version}`);

    if (timer === 'Timer M') {
      interruptSourcesNumber = 7;
    } else {
      interruptSourcesNumber = 14;
      if (version >= 3) {
        interruptSourcesNumber += 2;
      }
    }
  } catch (error) {
    console.error(`helper_hrtim_get_max_interrupt_request_sources: ${error}`);
  }

  return interruptSourcesNumber;
}

/**
 * Get the maximum number of DMA request sources supported by the timer.
 * @param {string} timer - Timing unit to configure.
 * @param {integer} version - HR-Timer version.
 * @returns {number} number of DMA request sources available for the timer
 */
function helper_hrtim_get_max_dma_request_sources(timer, version) {
  let dmaSourcesNumber = 0;

  try {
    // console.info(`helper_hrtim_get_max_dma_request_sources: timer=${timer}, version=${version}`);

    if (timer === 'Timer M') {
      dmaSourcesNumber = 7;
    } else {
      dmaSourcesNumber = 14;
      if (version >= 3) {
        dmaSourcesNumber += 2;
      }
    }
  } catch (error) {
    console.error(`helper_hrtim_get_max_dma_request_sources: ${error}`);
  }

  return dmaSourcesNumber;
}

/**
 * Check whether GPIO configuration is needed for a given HRTIM input/output.
 * @param {object} Actual HRTIM input/output configuration.
 * @param {string} HRTIM input/output name.
 * @returns {boolean} true if GPIO configuration is needed, false otherwise.
 */
function helper_hrtim_is_hrtim_io_connected_to_gpio(hrtim_io_config, hrtim_io_name) {
  let isGpioNeeded = false;
  try {
    //console.info(`helper_hrtim_is_hrtim_io_connected_to_gpio: hrtim_io_config=${JSON.stringify(hrtim_io_config)}, hrtim_io_name=${hrtim_io_name}`);

    const configArray = Object.values(hrtim_io_config);

    if (hrtim_io_name.startsWith('CH')) {
      const config = configArray.find(config => config._foreignKey === hrtim_io_name && config.use_channel === true && config.output_config.use_gpio === true);
      if (config) {
        isGpioNeeded = true;
      }
    }
    else if (hrtim_io_name.startsWith('EEV')) {
      const config = configArray.find(config => config._foreignKey === hrtim_io_name && config.use_channel === true && config.external_event_config.source.source === 'AFI');
      if (config) {
        isGpioNeeded = true;
      }
    }
    else if (hrtim_io_name.startsWith('FLT')) {
      const config = configArray.find(config => config._foreignKey === hrtim_io_name && config.use_channel === true && config.fault_input_config.source.source === 'AFI');
      if (config) {
        isGpioNeeded = true;
      }
    }
    else if (hrtim_io_name.startsWith('SYNCIN')) {
      if (hrtim_io_config.use !== undefined && hrtim_io_config.source.source === 'AFI') {
        isGpioNeeded = hrtim_io_config.use;
      }
    }
    else if (hrtim_io_config.use !== undefined) {
      isGpioNeeded = hrtim_io_config.use;
    }
  } catch (error) {
    console.error(`helper_hrtim_is_hrtim_io_connected_to_gpio: ${error}`);
  }

  return isGpioNeeded;
}

/**
 * Check whether the HRTIM output operates in high-resolution mode.
 * @param {object} Actual HRTIM input/output configuration.
 * @param {string} HRTIM input/output name.
 * @returns {boolean} true if the HRTIM output operates in high-resolution mode, false otherwise.
 */
function helper_hrtim_is_hrtim_high_resolution_output(hrtim_io_config, hrtim_io_name) {
  let isHighResolution = false;
  try {
    //console.info(`helper_hrtim_is_hrtim_high_resolution_output: hrtim_io_config=${JSON.stringify(hrtim_io_config)}, hrtim_io_name=${hrtim_io_name}`);

    const configArray = Object.values(hrtim_io_config);

    if (hrtim_io_name.startsWith('CH')) {
      const config = configArray.find(config => config._foreignKey === hrtim_io_name && config.use_channel === true && config.output_config.use_gpio === true && config.output_config.high_resolution === true);
      if (config) {
        isHighResolution = true;
      }
    }
  } catch (error) {
    console.error(`helper_hrtim_is_hrtim_high_resolution_output: ${error}`);
  }

  return isHighResolution;
}

/**
 * Build a pipe-separated list of channel selectors from a GPIO object.
 * Output selectors: CH[A-F][1-2][L] or SCOUT (e.g. CHA1, CHB2, CHA1L, SCOUT).
 * Input selectors: EEV1..EEV16, FLT1..FLT8 or SCIN.
 * @param {object} gpio GPIO object from the software configuration.
 * @param {string} ioType selector type: "output" or "input".
 * @returns {string} Matching selectors joined with '|'.
 */
function helper_hrtim_get_gpio_selectors(gpio, ioType = 'output') {
  let selectors = [];

  //console.info(`helper_hrtim_get_gpio_selectors: gpio=${JSON.stringify(gpio)}, ioType=${ioType}`);

  try {
    if (!gpio || typeof gpio !== 'object') {
      return '';
    }

    const normalizedIoType = String(ioType).toLowerCase();
    const selectorPattern = normalizedIoType === 'input'
      ? /^(EEV([1-9]|1[0-6])|FLT[1-8]|SCIN)$/
      : /^(CH[A-F][12]L?|SCOUT)$/;

    Object.entries(gpio).forEach(([key, value]) => {
      const keyAsSelector = String(key).toUpperCase();
      if (selectorPattern.test(keyAsSelector)) {
        selectors.push(keyAsSelector);
      }

      if (value && Array.isArray(value.needs)) {
        value.needs.forEach(need => {
          const selector = String(need && need.selector ? need.selector : '').toUpperCase();
          if (selectorPattern.test(selector)) {
            selectors.push(selector);
          }
        });
      }
    });

    selectors = [...new Set(selectors)];
  } catch (error) {
    console.error(`helper_hrtim_get_gpio_selectors: ${error}`);
  }

  return selectors.join(',');
}

/**
 * Check whether at least one GPIO must be configured.
 * @param {object} Actual HRTIM input/output configuration.
 * @returns {boolean} true if at least one HRTIM input/output requiring a GPIO is used, false otherwise.
 */
function helper_hrtim_is_needed_gpio_settings(hrtim_io_config) {

  try {
    //console.info(`helper_hrtim_is_needed_gpio_settings: hrtim_io_config=${JSON.stringify(hrtim_io_config)}`);

    // Check if any output channel is used
    if (hrtim_io_config.outputs.some(output => output.use_channel && output.output_config.use_gpio)) {
      return true;
    }

    // Check if any external event is used and its source is AFI
    if (hrtim_io_config.external_events.some(event => event.use_channel && event.external_event_config.source.source === "AFI")) {
      return true;
    }

    // Check if any fault input is used and its source is AFI
    if (hrtim_io_config.fault_inputs.some(fault => fault.use_channel && fault.fault_input_config.source.source === "AFI")) {
      return true;
    }

    // Check if syncin is used and its source is AFI
    if (hrtim_io_config.syncin.use && hrtim_io_config.syncin.source.source === "AFI") {
      return true;
    }

    // Check if syncout is used
    if (hrtim_io_config.syncout.use) {
      return true;
    }
  } catch (error) {
    console.error(`helper_hrtim_is_needed_gpio_settings: ${error}`);
  }

  return false;
}

/**
 * Indicate whether the fast mode feature is available for a given external event.
 * @param {string} event - External event.
 * @param {string} feature - External event feature (FILTER or FAST_MODE).
 * @returns {boolean} true if fast mode is supported by the external event.
 */
function helper_hrtim_is_supported_event_feature(event, feature) {
  let isSupported = false;

  try {
    // console.info(`helper_hrtim_is_supported_event_feature: event = ${event}, feature = ${feature}`);

    const fastModeEvents = ["EEV1", "EEV2", "EEV3", "EEV4", "EEV5", "EEV11", "EEV12", "EEV13"];
    const filterModeEvents = ["EEV6", "EEV7", "EEV8", "EEV9", "EEV10", "EEV14", "EEV15", "EEV16"];

    if (feature === "FAST_MODE" && fastModeEvents.includes(event)) {
      isSupported = true;
    } else if (feature === "FILTER" && filterModeEvents.includes(event)) {
      isSupported = true;
    }
  } catch (error) {
    console.error(`helper_hrtim_is_supported_event_feature: ${error}`);
  }

  return isSupported;
}

/**
 * Indicate whether the push-pull mode is enabled for a given timing unit.
 * @param {object[]} config - Timing unit configuration.
 * @param {string} timer - Timing unit.
 * @returns {boolean} true if push-pull mode is enabled for the timing unit.
 */
function helper_hrtim_is_enabled_pushpull(config, timer) {
  let isEnabled = false;

  try {
    // console.info(`helper_hrtim_is_enabled_pushpull: timers_config=${JSON.stringify(config)}, timer=${timer}`);

     isEnabled = config.some(item =>
          item._foreignKey === timer && item.timer_config.output_stage.push_pull_mode === true
      );
      } catch (error) {
    console.error(`helper_hrtim_is_enabled_pushpull: ${error}`);
  }

  return isEnabled;
}

/**
 * Returns the combined event source default value.
 * @param {object} event - External event.
 * @param {integer} source - Selected source.
 * @returns {string} Combined event source name.
 */
function helper_hrtim_get_combined_event_source_name(event, source) {
  let sourceName = null;

  try {
    // console.info(`helper_hrtim_get_combined_event_source_name: event=${event}, source=${source}`);

    const eventMapping = {
      "EEVA": [ "External event 1"  , "External event 11" , "External event 1 AND external event 2"   , "External event 1 AND external event 11" ],
      "EEVB": [ "External event 2"  , "External event 12" , "External event 2 AND external event 3"   , "External event 2 AND external event 12" ],
      "EEVC": [ "External event 3"  , "External event 13" , "External event 3 AND external event 4"   , "External event 3 AND external event 13" ],
      "EEVD": [ "External event 4"  , "External event 14" , "External event 4 AND external event 5"   , "External event 4 AND external event 14" ],
      "EEVE": [ "External event 5"  , "External event 15" , "External event 5 AND external event 6"   , "External event 5 AND external event 15" ],
      "EEVF": [ "External event 6"  , "External event 16" , "External event 6 AND external event 7"   , "External event 6 AND external event 16" ],
      "EEVG": [ "External event 7"  , "External event 11" , "External event 7 AND external event 8"   , "External event 7 AND external event 11" ],
      "EEVH": [ "External event 8"  , "External event 12" , "External event 8 AND external event 9"   , "External event 8 AND external event 12" ],
      "EEVI": [ "External event 9"  , "External event 13" , "External event 9 AND external event 10"  , "External event 9 AND external event 13" ],
      "EEVJ": [ "External event 10" , "External event 14" , "External event 10 AND external event 11" , "External event 10 AND external event 14"],
    };

    if (!eventMapping.hasOwnProperty(event)) {
      throw new Error(`Invalid event: ${event}`);
    }

    if (source > 3) {
      throw new Error(`Invalid selection: ${source}`);
    }

    sourceName = eventMapping[event][source];

  } catch (error) {
    console.error(`helper_hrtim_get_combined_event_source_name: ${error}`);
  }

  return sourceName;
}

/**
 * Returns the combined event source default value.
 * @param {object} event - External event.
 * @param {integer} source - Selected source.
 * @returns {string} Combined event source value.
 */
function helper_hrtim_get_combined_event_source_value(event, source) {
  let sourceValue = null;

  try {
    //console.info(`helper_hrtim_get_combined_event_source_value: event=${event}, source=${source}`);

    const eventMapping = {
      "EEVA": [ "EEV1"  , "EEV11" , "EEV1_EEV2"   , "EEV1_EV11"  ],
      "EEVB": [ "EEV2"  , "EEV12" , "EEV2_EEV3"   , "EEV2_EEV12" ],
      "EEVC": [ "EEV3"  , "EEV13" , "EEV3_EEV4"   , "EEV3_EEV13" ],
      "EEVD": [ "EEV4"  , "EEV14" , "EEV4_EEV5"   , "EEV4_EEV14" ],
      "EEVE": [ "EEV5"  , "EEV15" , "EEV5_EEV6"   , "EEV5_EEV15" ],
      "EEVF": [ "EEV6"  , "EEV16" , "EEV6_EEV7"   , "EEV6_EEV16" ],
      "EEVG": [ "EEV7"  , "EEV11" , "EEV7_EEV8"   , "EEV7_EEV11" ],
      "EEVH": [ "EEV8"  , "EEV12" , "EEV8_EEV9"   , "EEV8_EEV12" ],
      "EEVI": [ "EEV9"  , "EEV13" , "EEV9_EEV10"  , "EEV9_EEV13" ],
      "EEVJ": [ "EEV10" , "EEV14" , "EEV10_EEV11" , "EEV10_EEV14"],
    };

    if (!eventMapping.hasOwnProperty(event)) {
      throw new Error(`Invalid event: ${event}`);
    }

    if (source > 3) {
      throw new Error(`Invalid selection: ${source}`);
    }

    sourceValue = eventMapping[event][source];

  } catch (error) {
    console.error(`helper_hrtim_get_combined_event_source_value: ${error}`);
  }

  return sourceValue;
}

function helper_hrtim_get_crossbar_configuration(prefix, sources, key) {
  let crossbarConfiguration = "";

  try {
    // console.info(`helper_hrtim_get_crossbar_configuration: prefix=${prefix}, sources=${JSON.stringify(sources)}, key=${key}`);

    if (Array.isArray(sources) && sources.length > 0) {
      const combinedSources = [];

      for (let i = 0; i < sources.length; i++) {
        try {
          const sourceName = sources[i].source;
          const convertedEvent = helper_hrtim_convert_output_set_reset_event(key, sourceName);
          combinedSources.push(`${prefix}_${convertedEvent}`);
        } catch (innerError) {
          console.error(`[ERROR] Failed to process source at index ${i}:`, innerError);
          // Continue processing other sources despite errors
        }
      }

      crossbarConfiguration = combinedSources.join(" | ");
    }

  } catch (error) {
    console.error(`[ERROR] helper_hrtim_get_crossbar_configuration: ${error.message}`);
  }

  return crossbarConfiguration;
}

/**
 * Removes all occurrences of a specified substring from a given string.
 * @param {string} str - The original string from which to remove the substring.
 * @param {string} substr - The substring to be removed from the original string.
 * @returns {string} The resulting string after all occurrences of the substring have been removed.
 *                   If either parameter is not a string, returns the original string unchanged.
 */
function helper_hrtim_remove_substring(str, substr) {
  if (typeof str !== 'string' || typeof substr !== 'string') {
    return str;
  }
  return str.split(substr).join('');
}

/**
 * Converts an array of trigger objects into a formatted string of LL HRTIM reset trigger constants.
 *
 * @param {string} prefix - The LL HRTIM constant prefix to prepend to each trigger source (e.g., "LL_HRTIM_RESETTRIG_").
 * @param {string} timer - The timer name.
 * @param {Array<{source: string}>} triggers - Array of trigger sources.
 * @returns {string} A string of LL reset trigger constants separated by `" | "`, or `prefix + "NONE"`
 *                   if no valid triggers are found.
 */
function helper_hrtim_format_ll_capture_or_reset_triggers_selection(prefix, timer, triggers) {
  let selectedTriggers = prefix + 'NONE';

  try {
    //console.info(`helper_hrtim_format_ll_capture_or_reset_triggers_selection: timer=${timer}, triggers=${JSON.stringify(triggers)}`);
    // Check if triggers exists and is a non-empty array
    if (Array.isArray(triggers) && triggers.length > 0 ) {
      // Filter out sources with value "NONE"
      const filteredTriggers = triggers.filter(item => item.source !== 'NONE');

      // If after filtering there are valid sources, build the string
      if (filteredTriggers.length > 0) {
        selectedTriggers = filteredTriggers
          .map(item => prefix + helper_hrtim_convert_capture_or_reset_trigger_source(timer, item.source))
          .join(' | ');
      }
    }
  } catch (error) {
    console.error(`[ERROR] helper_hrtim_format_ll_capture_or_reset_triggers_selection: ${error.message}`);
  }

  return selectedTriggers;
}

/**
 * Formats an array of trigger objects into a string of LL HRTIM trigger constants.
 *
 * This function processes an array of trigger objects, each expected to have a `source` property,
 * and converts them into a formatted string of Low-Level (LL) Hardware Timer (HRTIM) constants.
 * It prepends each valid trigger source with the provided prefix and joins them with `" | "` as a separator.
 *
 * @param {string} prefix - The LL HRTIM constant prefix to prepend to each trigger source (e.g., "LL_HRTIM_UPDATETRIG_").
 * @param {Array<{source: string}>} triggers - Array of trigger objects, each with a `source` string property.
 * @param {string} property - The property name in each trigger object to use (e.g., "source").
 * @returns {string} A string of formatted trigger constants separated by `" | "`, or `"prefixNONE"` if no valid triggers are present.
 */
function helper_hrtim_format_ll_triggers_selection(prefix, triggers, property) {
  let selectedTriggers = prefix + 'NONE';

  try {
    //console.info(`helper_hrtim_format_ll_triggers_selection: prefix=${prefix}, triggers=${JSON.stringify(triggers)}, property=${property}`);
    // Check if triggers exists and is a non-empty array
    if (
      Array.isArray(triggers) &&
      triggers.length > 0
    ) {
      // Filter out sources with value "NONE"
      const filteredTriggers = triggers.filter(item => item[property] !== 'NONE');

      // If after filtering there are valid sources, build the string
      if (filteredTriggers.length > 0) {
        selectedTriggers = filteredTriggers
          .map(item => prefix + `${item[property]}`.toUpperCase())
          .join(' | ');
      }
    }
  } catch (error) {
    console.error(`[ERROR] helper_hrtim_format_ll_triggers_selection: ${error.message}`);
  }

  return selectedTriggers;
}

/**
 * Formats the LL update gating string based on update_gating and update_enable_source.
 * @param {string} update_gating - The update gating mode.
 * @param {string} update_enable_source - The update enable source string.
 * @returns {string} Formatted update gating string.
 */
function helper_hrtim_format_ll_update_gating(update_gating, update_enable_source) {
  let updateGating = 'LL_HRTIM_UPDATEGAT_INDEPENDENT';

  try {
    //console.info(`helper_hrtim_format_ll_update_gating: update_gating=${update_gating}, update_enable_source=${update_enable_source}, dbg=${JSON.stringify(update_enable_source)}`);
    switch (update_gating) {
      case 'DMABURST_COMPLETE':
        updateGating = 'LL_HRTIM_UPDATEGAT_DMABURST_COMPLETE';
        break;

      case 'DMABURST_UPDATE':
        updateGating = 'LL_HRTIM_UPDATEGAT_DMABURST_UPDATE';
        break;

      case 'ENABLE_INPUT':
        updateGating = 'LL_HRTIM_UPDATEGAT_' + helper_hrtim_convert_source(update_enable_source);
        break;

      case 'ENABLE_INPUT_UPDATE':
        updateGating = 'LL_HRTIM_UPDATEGAT_' + helper_hrtim_convert_source(update_enable_source) + '_UPDATE';
        break;
    }
  } catch (error) {
    console.error(`[ERROR] helper_hrtim_format_ll_update_gating: ${error.message}`);
  }

  return updateGating;
}

/**
 * Formats the LL roll over mode string string based on roll over mode.
 * @param {string} roll_over_mode - The roll_over_mode mode.
 * @returns {string} Formatted roll over mode string.
 */
function helper_hrtim_format_ll_roll_over_mode(roll_over_mode) {
  let rollOverMode = 'LL_HRTIM_ROLLOVER_MODE_BOTH';

  try {
    //console.info(`helper_hrtim_format_ll_roll_over_mode: roll_over_mode=${roll_over_mode}`);
    switch (roll_over_mode) {
      case 'VALLEY':
        rollOverMode = 'LL_HRTIM_ROLLOVER_MODE_RST';
        break;

      case 'CREST':
        rollOverMode = 'LL_HRTIM_ROLLOVER_MODE_PER';
        break;
    }
  } catch (error) {
    console.error(`[ERROR] helper_hrtim_format_ll_roll_over_mode: ${error.message}`);
  }

  return rollOverMode;
}

/**
 * Converts an auto delayed mode identifier into the corresponding LL HRTIM compare mode constant string.
 *
 * This function maps a given auto delayed mode string to its corresponding Low-Level (LL) Hardware Timer (HRTIM)
 * compare mode constant. If the input mode does not match any predefined cases, it returns a default constant.
 *
 * @param {string} auto_delayed_mode - The auto delayed mode identifier string.
 * @returns {string} The corresponding LL HRTIM compare mode constant string.
 */
function helper_hrtim_format_ll_auto_delayed_mode(auto_delayed_mode) {
  let autoDelayedMode = 'LL_HRTIM_COMPAREMODE_REGULAR';

  try {
    //console.info(`helper_hrtim_format_ll_auto_delayed_mode: auto_delayed_mode=${auto_delayed_mode}`);
    switch (auto_delayed_mode) {
      case 'TIMEOUT_NONE':
        autoDelayedMode = 'LL_HRTIM_COMPAREMODE_DELAY_NOTIMEOUT';
        break;

      case 'TIMEOUT_CMP1':
        autoDelayedMode = 'LL_HRTIM_COMPAREMODE_DELAY_CMP1';
        break;

      case 'TIMEOUT_CMP3':
        autoDelayedMode = 'LL_HRTIM_COMPAREMODE_DELAY_CMP3';
        break;
    }
  } catch (error) {
    console.error(`[ERROR] helper_hrtim_format_ll_auto_delayed_mode: ${error.message}`);
  }

  return autoDelayedMode;
}

/**
 * Generates the LL delayed protection related constant name based on input parameters.
 *
 * @param {string} mode - The configured delayed prtection mode.
 * @param {string} outputs - The output(s) delayed protectyion mode is applied to.
 * @param {string} eev - The external event selected in delayed idle mode.
 * @returns {string} The generated LL delayed protection constant name.
 */
function helper_hrtim_format_ll_delayed_protection_mode(mode, outputs, eev) {
  // Initialize with default value
  let delayedProtectionMode = `LL_HRTIM_DLYPRT_DELAYOUT1_${eev}`;

  try {
    //console.info(`helper_hrtim_format_ll_delayed_protection_mode: mode=${mode}, outputs=${outputs}, eev=${eev}`);
    // Check for undefined parameters explicitly
    if (mode === undefined || eev === undefined) {
      throw new Error("One or more parameters are undefined");
    }

    if (mode === "DELAYED_IDLE") {
      if (outputs === undefined) {
        throw new Error("eev parameter is undefined for DELAYED_IDLE mode");
      }

      if (outputs === "OUT1") {
        delayedProtectionMode = `LL_HRTIM_DLYPRT_DELAYOUT1_${eev}`;
      } else if (outputs === "OUT2") {
        delayedProtectionMode = `LL_HRTIM_DLYPRT_DELAYOUT2_${eev}`;
      } else if (outputs === "OUT1_OUT2") {
        delayedProtectionMode = `LL_HRTIM_DLYPRT_DELAYBOTH_${eev}`;
      }
    } else if (mode === "BALANCED_IDLE" || mode === "BALANCED_IDLE_AUTO_RESUME") {
      delayedProtectionMode = `LL_HRTIM_DLYPRT_BALANCED_${eev}`;
    }
  } catch (error) {
    console.error(`[ERROR] helper_hrtim_format_ll_delayed_protection_mode: ${error.message}`);
  }

  return delayedProtectionMode;
}

/**
 * Generates a concatenated string of fault constants separated by ' | '.
 *
 * @param {Array<{enable: string}>} faults - Array of objects with an 'enable' string property.
 * @returns {string} Concatenated string of fault constants prefixed with 'LL_HRTIM_'.
 *                   Defaults to "LL_HRTIM_FLT1" if input is invalid, empty, or on error.
 */
function helper_hrtim_format_ll_faults_selection(faults) {
  let faultSelection = "LL_HRTIM_FLT1";

  try {
    //console.info(`helper_hrtim_format_ll_faults_selection: faults=${JSON.stringify(faults)}`);
    if (Array.isArray(faults) && faults.length > 0) {
      const faultStrings = faults
        .map(fault => fault && typeof fault.enable === 'string' ? `LL_HRTIM_${fault.enable}` : null)
        .filter(Boolean);

      if (faultStrings.length > 0) {
        faultSelection = faultStrings.join(' | ');
      }
    }
  } catch (error) {
    console.error(`[ERROR] helper_hrtim_format_ll_faults_selection: ${error.message}`);
  }

  return faultSelection;
}

/**
 * Replaces all occurrences of a substring within a string with another substring.
 *
 * @param {string} str - The original string.
 * @param {string} searchValue - The substring to search for.
 * @param {string} replaceValue - The substring to replace with.
 * @returns {string} The resulting string after replacements.
 */
function helper_hrtim_replace_substring(str, searchValue, replaceValue) {
  if (typeof str !== 'string' || typeof searchValue !== 'string' || typeof replaceValue !== 'string') {
    return str;
  }
  return str.split(searchValue).join(replaceValue);
}

/**
 * Constructs a bitmask string of HRTIM interrupt enable flags.
 *
 * @param {Object} global_events - Object representing HRTIM global interrupts configuration.
 *
 * @returns {string} A concatenated string of interrupt enable flags separated by " | ", or an empty string on error.
 */
function helper_hrtim_define_ll_hrtim_dier_mask(global_events) {
  try {
    // console.info(`helper_hrtim_define_ll_hrtim_dier_mask: global_events=${JSON.stringify(global_events)}`);

    let dierMask = [];

    // Single lookup table mapping all source names to base bit field names
    const sourceMap = {
      "SYSFLT": "LL_HRTIM_IER_SYSFLTIE",
      "FLT1": "LL_HRTIM_IER_FLT1IE",
      "FLT2": "LL_HRTIM_IER_FLT2IE",
      "FLT3": "LL_HRTIM_IER_FLT3IE",
      "FLT4": "LL_HRTIM_IER_FLT4IE",
      "FLT5": "LL_HRTIM_IER_FLT5IE",
      "FLT6": "LL_HRTIM_IER_FLT6IE",
      "FLT7": "LL_HRTIM_IER_FLT7IE",
      "FLT8": "LL_HRTIM_IER_FLT8IE",
      "DLL_CALIBRATION": "LL_HRTIM_IER_DLLRDYIE",
      "BURST_MODE_PERIOD": "LL_HRTIM_IER_BMPERIE",
    };

    // Process global_events array
    if (Array.isArray(global_events)) {
      global_events.forEach(({ source }) => {
        if (sourceMap[source]) {
          dierMask.push(sourceMap[source]);
        }
      });
    }

    // Join all parts with " | "
    return dierMask.join(" | ");
  } catch (error) {
    console.error(`[ERROR] helper_hrtim_define_ll_hrtim_dier_mask: ${error.message}`);
    return "";
  }
}

/**
 * Constructs a bitmask string of master timer interrupt/DMA request enable flags.
 *
 * @param {Object} timer_events - Object representing master timer interrupts/DMA requests configuration.
 * @param {string} suffix - Suffix string to append to each flag ("IE" or "DE").
 *
 * @returns {string} A concatenated string of interrupt enable flags separated by " | ", or an empty string on error.
 */
function helper_hrtim_define_ll_master_timer_dier_mask(timer_events, suffix) {
  try {
    console.info(`helper_hrtim_define_ll_master_timer_dier_mask: timer_events=${JSON.stringify(timer_events)}, suffix=${suffix}`);

    let dierMask = [];

    // Helper function to append constant suffix to flag base name
    const withSuffix = (base) => base + suffix;

    // Single lookup table mapping all source names to base bit field names
    const sourceMap = {
      "SYNCHRO": "LL_HRTIM_MDIER_SYNC",
      "UPDATE": "LL_HRTIM_MDIER_MUPD",
      "REPETITION": "LL_HRTIM_MDIER_MREP",
      "CMP1": "LL_HRTIM_MDIER_MCMP1",
      "CMP2": "LL_HRTIM_MDIER_MCMP2",
      "CMP3": "LL_HRTIM_MDIER_MCMP3",
      "CMP4": "LL_HRTIM_MDIER_MCMP4",
    };

    // Process timer events
    if (Array.isArray(timer_events)) {
      const sources = timer_events.map(src => src.source);
      sources.forEach(source => {
        if (sourceMap[source]) {
          dierMask.push(withSuffix(sourceMap[source]));
        }
      });
    }

    // Join all parts with " | "
    return dierMask.join(" | ");
  } catch (error) {
    console.error(`[ERROR] helper_hrtim_define_ll_master_timer_dier_mask: ${error.message}`);
    return "";
  }
}

/**
 * Constructs a bitmask string of timing unit interrupt/DMA request enable flags.
 *
 * @param {Object} timer_events - Object representing timing unit interrupts/DMA requests configuration.
 * @param {string} suffix - Suffix string to append to each flag ("IE" or "DE").
 *
 * @returns {string} A concatenated string of interrupt enable flags separated by " | ", or an empty string on error.
 */
function helper_hrtim_define_ll_timx_dier_mask(timer_events, suffix) {
  try {
    console.info(`helper_hrtim_define_ll_timx_dier_mask: timer_events=${JSON.stringify(timer_events)}, suffix=${suffix}`);

    let dierMask = [];

    // Helper function to append constant suffix to flag base name
    const withSuffix = (base) => base + suffix;

    // Single lookup table mapping all source names to base bit field names
    const sourceMap = {
      "UPDATE": "LL_HRTIM_TIMDIER_UPD",
      "REPETITION": "LL_HRTIM_TIMDIER_REP",
      "RESET": "LL_HRTIM_TIMDIER_RST",
      "DELAYED_PROT": "LL_HRTIM_TIMDIER_DLYPRT",
      "CMP1": "LL_HRTIM_TIMDIER_CMP1",
      "CMP2": "LL_HRTIM_TIMDIER_CMP2",
      "CMP3": "LL_HRTIM_TIMDIER_CMP3",
      "CMP4": "LL_HRTIM_TIMDIER_CMP4",
      "CPT1": "LL_HRTIM_TIMDIER_CPT1",
      "CPT2": "LL_HRTIM_TIMDIER_CPT2",
      "SET1" : "LL_HRTIM_TIMDIER_SET1",
      "RESET1": "LL_HRTIM_TIMDIER_RST1",
      "SET2" : "LL_HRTIM_TIMDIER_SET2",
      "RESET2": "LL_HRTIM_TIMDIER_RST2",
      "XBAR_OVR_TRIGGER": "LL_HRTIM_TIMDIER_COT",
      "XBAR_OVR_REARM": "LL_HRTIM_TIMDIER_CORDE",
    };

    // Process timer events
    if (Array.isArray(timer_events)) {
      const sources = timer_events.map(src => src.source);
      sources.forEach(source => {
        if (sourceMap[source]) {
          dierMask.push(withSuffix(sourceMap[source]));
        }
      });
    }

    // Join all parts with " | "
    return dierMask.join(" | ");
  } catch (error) {
    console.error(`[ERROR] helper_hrtim_define_ll_timx_dier_mask: ${error.message}`);
    return "";
  }
}

function helper_hrtim_format_frequency(frequency) {
  if (frequency >= 1e9) {
    return (frequency / 1e9).toFixed(2) + ' GHz';
  } else if (frequency >= 1e6) {
    return (frequency / 1e6).toFixed(2) + ' MHz';
  } else if (frequency >= 1e3) {
    return (frequency / 1e3).toFixed(2) + ' KHz';
  } else {
    return frequency + ' Hz';
  }
}

/**
 * Format a period in s to a readable string in ms, us, ns or ps.
 * @param {number} period - The period in seconds.
 * @returns {string} Formatted period string with appropriate unit.
 */
function helper_hrtim_format_period(period) {
  if (period >= 1) {
    return period.toFixed(2) + ' s';
  } else if (period >= 1e-3) {
    return (period * 1e3).toFixed(2) + ' ms';
  } else if (period >= 1e-6) {
    return (period * 1e6).toFixed(2) + ' us';
  } else if (period >= 1e-9) {
    return (period * 1e9).toFixed(2) + ' ns';
  } else {
    return (period * 1e12).toFixed(2) + ' ps';
  }
}

/**
 * Convert string formatted by helper_hrtim_format_period into a number in seconds.
 * @param {string} periodStr - The period string (e.g., "1.23 ms").
 * @returns {number} The period in seconds.
 */
function helper_hrtim_parse_period(periodStr) {
  const regex = /^([\d.]+)\s*(s|ms|us|ns|ps)$/;
  const match = periodStr.match(regex);
  if (!match) {
    throw new Error(`Invalid period string: ${periodStr}`);
  }
  const value = parseFloat(match[1]);
  const unit = match[2];
  switch (unit) {
    case 's': return value;
    case 'ms': return value * 1e-3;
    case 'us': return value * 1e-6;
    case 'ns': return value * 1e-9;
    case 'ps': return value * 1e-12;
    default: throw new Error(`Unknown unit: ${unit}`);
  }
}

/*
 * Calculate prescaled value from prescaler ratio formatted as a string.
 * @param {number} input - Input frequency/period.
 * @param {string} prescalerRatio - Prescaler ratio (e.g., "DIV1", "DIV2", "DIV4", "DIV8", etc.).
 * @returns {number} Prescaled value.
 */
function helper_hrtim_calculate_prescaled_value(input, prescalerRatio) {
  let prescaledValue = 0;

  try {
    //console.info(`helper_hrtim_calculate_prescaled_value: input=${input}, prescalerRatio=${prescalerRatio}`);
    if (typeof input !== 'number' || input <= 0) {
      throw new Error(`Invalid input: ${input}`);
    }
    if (typeof prescalerRatio !== 'string') {
      throw new Error(`Invalid prescaler ratio: ${prescalerRatio}`);
    }
    if (prescalerRatio.startsWith('DIV')) {
      const divisor = parseInt(prescalerRatio.slice(3), 10);
      if (isNaN(divisor) || divisor <= 0) {
        throw new Error(`Invalid prescaler ratio: ${prescalerRatio}`);
      }
      prescaledValue = input / divisor;
    } else if (prescalerRatio.startsWith('MUL')) {
      const multiplier = parseInt(prescalerRatio.slice(3), 10);
      if (isNaN(multiplier) || multiplier <= 0) {
        throw new Error(`Invalid prescaler ratio: ${prescalerRatio}`);
      }
      prescaledValue = input * multiplier;
    } else {
      throw new Error(`Invalid prescaler ratio: ${prescalerRatio}`);
    }
  }
  catch (error) {
    console.error(`helper_hrtim_calculate_prescaled_value: ${error}`);
  }

  return prescaledValue;
}

/**
 * Calculate counter frequency from HRTIM clock and timer prescaler ratio.
 * @param {number} fHRTIM - HRTIM clock frequency in Hz.
 * @param {string} prescalerRatio - Prescaler ratio (e.g., "DIV1", "DIV2", "DIV4", "DIV8", etc.).
 * @param {number} period - Timer period
 * @returns {string} Counter frequency formatted as a string.
 */
function helper_hrtim_calculate_counter_frequency(fHRTIM, prescalerRatio, period) {
  let prescaledClockFrequency = 0;

  try {
    console.info(`helper_hrtim_calculate_counter_frequency: fHRTIM=${fHRTIM}, period=${period}, prescalerRatio=${prescalerRatio}`);
    if (typeof fHRTIM !== 'number' || fHRTIM <= 0) {
      throw new Error(`Invalid HRTIM frequency: ${fHRTIM}`);
    }
    if (typeof period !== 'number' || period <= 0) {
      throw new Error(`Invalid period: ${period}`);
    }
    prescaledClockFrequency = helper_hrtim_calculate_prescaled_value(fHRTIM, prescalerRatio);
  }
  catch (error) {
    console.error(`helper_hrtim_calculate_counter_frequency: ${error}`);
  }
  return helper_hrtim_format_frequency(prescaledClockFrequency / (period + 1));
}

/**
 * Calculate deadtime resolution based on HRTIM clock and deadtime prescaler.
 * @param {number} fHRTIM - HRTIM clock frequency in Hz.
 * @param {string} deadtimePrescaler - Deadtime prescaler (e.g., "DIV1", "DIV2", "DIV4", "DIV8", etc.).
 * @returns {string} Deadtime resolution formatted as a string.
 */
function helper_hrtim_calculate_deadtime_resolution(fHRTIM, deadtimePrescaler) {
  let deadtimeResolution = 0;

  try {
    //console.info(`helper_hrtim_calculate_deadtime_resolution: fHRTIM=${fHRTIM}, deadtimePrescaler=${deadtimePrescaler}`);
    if (typeof fHRTIM !== 'number' || fHRTIM <= 0) {
      throw new Error(`Invalid HRTIM frequency: ${fHRTIM}`);
    }

    deadtimeResolution = helper_hrtim_calculate_prescaled_value(1 / fHRTIM, deadtimePrescaler);

  } catch (error) {
    console.error(`helper_hrtim_calculate_deadtime_resolution: ${error}`);
  }
  return helper_hrtim_format_period(deadtimeResolution);
}

/**
 * Calculate deadtime delay based on deadtime value, deadtime resolution, and sign.
 * @param {string} deadtimeResolution - Deadtime resolution.
 * @param {number} deadtimeValue - Deadtime value.
 * @param {string} deadtimeSign - Deadtime sign ("POSITIVE" or "NEGATIVE").
 * @returns {string} Deadtime delay formatted as a string.
 */
function helper_hrtim_calculate_deadtime_delay(deadtimeResolution, deadtimeValue, deadtimeSign) {
  let deadtimeDelay = 0;
  let periodStr = '';

  try {
    // console.info(`helper_hrtim_calculate_deadtime_delay: deadtimeResolution=${deadtimeResolution}, deadtimeValue=${deadtimeValue}, deadtimeSign=${deadtimeSign}`);
    if (typeof deadtimeValue !== 'number' || deadtimeValue < 0) {
      throw new Error(`Invalid deadtime value: ${deadtimeValue}`);
    }
    deadtimeDelay = deadtimeValue * helper_hrtim_parse_period(deadtimeResolution);
  } catch (error) {
    console.error(`helper_hrtim_calculate_deadtime_delay: ${error}`);
  }

  periodStr = helper_hrtim_format_period(deadtimeDelay);

      if (deadtimeSign === "NEGATIVE") {
      // Prepend a negative sign to the formatted period string
      periodStr = '-' + periodStr;
    }

  return periodStr;
}

/**
 * Calculate chopper frequency from HRTIM clock and timer prescaler ratio.
 * @param {number} fHRTIM - HRTIM clock frequency in Hz.
 * @param {string} prescalerRatio - Chopper prescaler ratio (e.g., "DIV16", "DIV32", "DIV48", "DIV64", etc.).
 * @returns {string} Chopper frequency formatted as a string.
 */
function helper_hrtim_calculate_chopper_frequency(fHRTIM, prescalerRatio) {
  let prescaledClockFrequency = 0;

  try {
    if (typeof fHRTIM !== 'number' || fHRTIM <= 0) {
      throw new Error(`Invalid HRTIM frequency: ${fHRTIM}`);
    }
    prescaledClockFrequency = helper_hrtim_calculate_prescaled_value(fHRTIM, prescalerRatio);
  }
  catch (error) {
    console.error(`helper_hrtim_calculate_chopper_frequency: ${error}`);
  }
  return helper_hrtim_format_frequency(prescaledClockFrequency);
}

/**
 * Calculate the length of the initial pulse in chopper mode, based on the HRTIM clock and configured start pulse width (STRPW).
 * @param {number} fHRTIM - HRTIM clock frequency in Hz.
 * @param {string} strpw - Configured start pulse width (STRPW) value.
 * @returns {string} Initial pulse length formatted as a string.
 */
function helper_hrtim_calculate_chopper_initial_pulse_width(fHRTIM, strpw) {
  let initialPulseLength = 0;

  try {
    if (typeof fHRTIM !== 'number' || fHRTIM <= 0) {
      throw new Error(`Invalid HRTIM frequency: ${fHRTIM}`);
    }

    initialPulseLength = helper_hrtim_calculate_prescaled_value(1/fHRTIM, strpw);

  } catch (error) {
    console.error(`helper_hrtim_calculate_chopper_initial_pulse_width: ${error}`);
  }

  return helper_hrtim_format_period(initialPulseLength);
}

/**
 * Calculate the length of the filtering window, based on the HRTIM clock, filter setting, and prescaler.
 * @param {number} fHRTIM - HRTIM clock frequency in Hz.
 * @param {string} filter - Filter setting.
 * @param {number} prescaler - Prescaler value.
 * @returns {string} Filtering window length formatted as a string.
 */
function helper_hrtim_calculate_filter_length(fHRTIM, filter, prescaler) {
  let filterLength = 0;
  let samplingClockFrequency = fHRTIM;

  try {
    if (typeof fHRTIM !== 'number' || fHRTIM <= 0) {
      throw new Error(`Invalid HRTIM frequency: ${fHRTIM}`);
    }

    if (typeof filter !== 'string') {
      throw new Error(`Invalid filter: ${filter}`);
    }

    if (typeof prescaler !== 'number' || prescaler <= 0) {
      throw new Error(`Invalid prescaler: ${prescaler}`);
    }

    // If filter === FDIV1 return "Filter Disabled"
    if (filter === 'FDIV1') {
      return 'Filter Disabled';
    }

    // Calculate the sampling clock frequency based on the HRTIM clock and prescaler
    const dividerMatch = filter.match(/FDIV(\d+)/);
    const divider = dividerMatch ? parseInt(dividerMatch[1], 10) : 1;
    samplingClockFrequency = fHRTIM / (divider * prescaler);

    // Calculate filter length: filterLength = tEEVs * N
    // where N is extracted from filter string, e.g. FDIV1_N2 => N=2
    const N = parseInt(filter.split('_N')[1], 10);
    filterLength = (1 / samplingClockFrequency) * N;

  } catch (error) {
    console.error(`helper_hrtim_calculate_filter_length: ${error}`);
  }

  return helper_hrtim_format_period(filterLength);
}

module.exports = {

  helper_hrtim_get_compare_units,

  helper_hrtim_get_capture_units,

  helper_hrtim_get_adc_tiggers,

  helper_hrtim_any_resource_used,

  helper_hrtim_is_used_resource,

  helper_hrtim_convert_timer,

  helper_hrtim_extract_unit_number,

  helper_hrtim_is_event_relevant_to_output,

  helper_hrtim_is_blanking_relevant_to_timer,

  helper_hrtim_is_windowing_relevant_to_timer,

  helper_hrtim_is_event_relevant_to_adc_trigger,

  helper_hrtim_get_fault_blanking_mode,

  helper_hrtim_convert_source,

  helper_hrtim_convert_update_gating,

  helper_hrtim_convert_capture_or_reset_trigger_source,

  helper_hrtim_convert_adc_trigger_id,

  helper_hrtim_convert_adc_trigger_source,

  helper_hrtim_convert_event_filter,

  helper_hrtim_convert_output_set_reset_event,

  helper_hrtim_convert_dual_channel_dac_trigger,

  helper_hrtim_convert_burst_mode_clock,

  helper_hrtim_convert_burst_mode_trigger,

  helper_hrtim_get_output_channel,

  helper_hrtim_get_max_interrupt_request_sources,

  helper_hrtim_get_max_dma_request_sources,

  helper_hrtim_is_hrtim_io_connected_to_gpio,

  helper_hrtim_is_hrtim_high_resolution_output,

  helper_hrtim_get_gpio_selectors,

  helper_hrtim_is_needed_gpio_settings,

  helper_hrtim_is_supported_event_feature,

  helper_hrtim_is_enabled_pushpull,

  helper_hrtim_get_combined_event_source_name,

  helper_hrtim_get_combined_event_source_value,

  helper_hrtim_get_crossbar_configuration,

  helper_hrtim_remove_substring,

  helper_hrtim_format_ll_capture_or_reset_triggers_selection,

  helper_hrtim_format_ll_triggers_selection,

  helper_hrtim_format_ll_update_gating,

  helper_hrtim_format_ll_roll_over_mode,

  helper_hrtim_format_ll_auto_delayed_mode,

  helper_hrtim_format_ll_delayed_protection_mode,

  helper_hrtim_format_ll_faults_selection,

  helper_hrtim_replace_substring,

  helper_hrtim_define_ll_hrtim_dier_mask,

  helper_hrtim_define_ll_master_timer_dier_mask,

  helper_hrtim_define_ll_timx_dier_mask,

  helper_hrtim_format_frequency,

  helper_hrtim_format_period,

  helper_hrtim_parse_period,

  helper_hrtim_calculate_prescaled_value,

  helper_hrtim_calculate_counter_frequency,

  helper_hrtim_calculate_deadtime_resolution,

  helper_hrtim_calculate_deadtime_delay,

  helper_hrtim_calculate_chopper_frequency,

  helper_hrtim_calculate_chopper_initial_pulse_width,

  helper_hrtim_calculate_filter_length,

};
