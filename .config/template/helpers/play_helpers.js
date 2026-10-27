/**
 * @file Helpers functions used for PLAY SW component
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

/* Add a cache at module scope */
const lutInputSelectableCache = new Map();

module.exports = {

  /**
    * Return if given LUT direct output is selectable as input of a specific LUT.
    * Uses a cache to avoid recomputation.
    * @param   {number}  lutIndex - LUT index of the LUT to check.
    * @param   {number}  lutInputIndex - LUT input index, the index of the LUT that may or may not be selected
    *                                    as input of lutIndex.
    * @param   {number}  lud_grid_x - LUT grid x size.
    * @param   {number}  lud_grid_y - LUT grid y size.
    * @returns {boolean} true or false if lutInputIndex is selectable as input of lutIndex.
    */
  helper_play_is_lut_input_selectable(lutIndex, lutInputIndex, lud_grid_x, lud_grid_y) {
    /* Create a unique key for this grid configuration */
    const cacheKey = `${lud_grid_x}x${lud_grid_y}`;
    /* Initialize cache for this grid if needed */
    /* If the cache does not have the current grid configuration, compute and store it */
    if (!lutInputSelectableCache.has(cacheKey)) {
      const lutCount = lud_grid_x * lud_grid_y;
      const lutSelectable = [];
      for (let lutIdx = 0; lutIdx < lutCount; lutIdx++) {
        /* Maximum x index for selectable LUTs */
        let i_max = lutIdx % lud_grid_x;
        /* Each LUT can always select itself */
        let selectable_luts = [lutIdx];
        for (let idx_i = 0; idx_i < i_max; idx_i++) {
          for (let idx_j = 0; idx_j < lud_grid_y; idx_j++) {
            /* Calculate LUT index in the grid */
            let item = idx_i + idx_j * lud_grid_x;
            /* Add to selectable LUTs */
            selectable_luts.push(item);
          }
        }
        /* Store as a Set for fast lookup */
        lutSelectable[lutIdx] = new Set(selectable_luts);
      }
      /* Cache the result for this grid */
      lutInputSelectableCache.set(cacheKey, lutSelectable);
    }
    /* Lookup if lutInputIndex is selectable for lutIndex in this grid */
    const lutSelectable = lutInputSelectableCache.get(cacheKey);
    return lutSelectable[lutIndex]?.has(lutInputIndex) || false;
  },

  /**
    * Return the premuxsel value of a PLAY input from the query id.
    * @param   {string} id - query interconnect id, 'play_inx', either 'play_inx' or 'play_inxx_yy'.
    * @returns {number} the premuxsel value of the PLAY input.
    */
  helper_play_get_premuxsel_from_id(id) {
    let result = 0;
    try {
      const normalizedId = String(id || '').replace(/play\d*_in/, '');
      /* Support two data format: "xxx" the sequencial ID or "xx_yy" with xx the MUX index and yy the premuxsel value.
         In the second case, we directly return yy as premuxsel value, otherwise we compute it as ID modulo 8 */
      if (normalizedId.includes('_')) {
        const parts = normalizedId.split('_');
        result = parseInt(parts[1], 10);
      } else {
        const id_int = parseInt(normalizedId, 10);
        result = Number.isNaN(id_int) ? 0 : id_int % 8;
      }
    } catch (e) {
      console.info(`helper_play_get_premuxsel_from_id: id: ${id}`);
      console.error(`helper_play_get_premuxsel_from_id: ${e}`);
    }
    return result;
  },

  /**
    * Return the input mux index from the query id.
    * @param   {string} id - query interconnect id, either 'play_inx' or 'play_inxx_yy'.
    * @returns {number} the input mux index.
    */
  helper_play_get_input_mux_from_id(id) {
    let result = 0;
    try {
      const normalizedId = String(id || '').replace(/play\d*_in/, '');
      if (normalizedId.includes('_')) {
        const parts = normalizedId.split('_');
        result = parseInt(parts[0], 10);
      } else {
        const id_int = parseInt(normalizedId, 10);
        result = Number.isNaN(id_int) ? 0 : Math.floor(id_int / 8);
      }
    } catch (e) {
      console.info(`helper_play_get_input_mux_from_id: id: ${id}`);
      console.error(`helper_play_get_input_mux_from_id: ${e}`);
    }
    return result;
  },

  /**
   * Return the proper name of the PLAY input from the query source name.
   * @param   {string} source - query interconnect source name.
   * @returns {string} the formatted name of the PLAY input according to HAL namings.
   */
  helper_play_input_src_rename(source) {
    let result = "";
    try {
      result = source.replace(/PLAY\d*_IN/, 'IN').toUpperCase();
    } catch (e) {
      console.info(`helper_play_input_src_rename: id: ${source}`);
      console.error(`helper_play_input_src_rename: ${e}`);
    }
    return result;
  },

  /**
    * Compute the truth table value for a LUT from a logical expression string.
    *
    * This function supports a maximum of 4 inputs: A, B, C, and D. These letters correspond to the 4 inputs of the LUT.
    * You can use any subset of these inputs if you don't need all of them.
    * Non-specified inputs are treated as "don't care" and will not affect the output.
    *
    * The logical expression must use the following syntax:
    * - Use `&` for AND operations.
    * - Use `|` for OR operations.
    * - Use `!` for NOT operations.
    * - Use parentheses `()` to prioritize operations.
    *
    * Example expressions:
    * - "A & B | !C"
    * - "(A | B) & C"
    * - "!A & (B | C)"
    *
    * @param {string} expr - Logical expression (e.g., "A & B | !C").
    * @param {string[]} vars - Array of variable names (e.g., ["A", "B", "C", "D"]).
    * @returns {number} Truth table value as an integer.
    */
  helper_play_truth_table_from_expr(expr, vars) {
    let table = 0;
    const n = vars.length;
    let debugRows = [];

    console.info(`helper_play_truth_table_from_expr: input equation: ${expr}`);

    /* Reverse the order of variables to match the correct bit significance */
    vars = vars.reverse();

    /* Generate all possible input combinations */
    for (let i = 0; i < (1 << n); i++) {
      /* Build a context for this combination */
      let context = {};
      for (let j = 0; j < n; j++) {
        /* Set the solution for variable: determine if the (n - j - 1)th bit in 'i' is 1 (true) or 0 (false) */
        context[vars[j]] = !!(i & (1 << (n - j - 1)));
      }
      /* Prepare the expression for eval */
      let evalExpr = expr;
      for (const v of vars) {
        /* Replace variable with its boolean value */
        evalExpr = evalExpr.replace(new RegExp(`\\b${v}\\b`, 'g'), context[v] ? 'true' : 'false');
      }
      /* Replace logical operators with JS equivalents */
      evalExpr = evalExpr.replace(/!/g, '!').replace(/&/g, '&&').replace(/\|/g, '||');
      let result = false;
      try {
        /* Evaluate the expression in the context of the current variable values */
        result = !!eval(evalExpr);
      } catch (e) {
        console.error(`helper_play_truth_table_from_expr: ${e}`);
      }
      if (result) {
        /* Set the corresponding bit in the truth table */
        table |= (1 << i);
      }
      /* Collect debug info for this row */
      debugRows.push({
        inputs: vars.map(v => context[v] ? 1 : 0),
        output: result ? 1 : 0
      });
    }
    /* Print debug table */
    console.info('helper_play_truth_table_from_expr: Truth Table');
    console.info(vars.join(' | ') + ' | OUT');
    console.info('-------------------');
    for (const row of debugRows) {
      console.info(row.inputs.join(' | ') + ' |  ' + row.output);
    }
    return table;
  },


  /**
    * Retrieve all the interruptions set by PLAY but not generated.
    * @param {object} nvic_api - Getter on NVIC api.
    * @param {object} exti_api - Getter on EXTI api.
    * @param {object} resource - Current resource.
    * @param {object} config   - Current configuration of the PLAY.
    * @returns {object}
   */
  helper_play_get_irq_handler(nvic_api, exti_api, resource, config) {
    let result = [];
    try {
      /* Check if interruption has beenn enabled on the PLAY */
      const enableInterruption = config?.system?.nvic?.enable ?? false;
      if (enableInterruption) {

        /* Check if IRQ handler generated is done on code generation or not */
        const irqHandlerGeneration = config.system?.nvic?.irq_handler_generation ?? false;

        if (!irqHandlerGeneration) {
          const labels = config.info?.labels || [];
          const nvic_config = nvic_api.getNeedById(config.system?.nvic?.nvic_config?.needs[0].id);
          /* Fill the object to be used for aliases in mx_hal_def.h */
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
      console.error(`helper_play_get_irq_handler: ${e}`);
    }
    return result;
  }

}