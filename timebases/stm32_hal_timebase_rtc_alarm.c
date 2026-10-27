/**
  ******************************************************************************
  * @file    stm32_hal_timebase_rtc_alarm.c
  * @brief   HAL timebase based on the hardware RTC_ALARM.
  *
  *          This file overrides the native HAL timebase functions (defined as weak)
  *          to use the RTC ALARM for timebase generation:
  *           + Initializes the RTC peripheral to increment the seconds registers each 1ms, 10ms, or 100ms
  *           + The alarm is configured to assert an interrupt when the RTC reaches 1ms, 10ms, or 100ms
  *           + HAL_IncTick is called at each Alarm event
  *           + HSE (default), LSE or LSI can be selected as RTC clock source
  **********************************************************************************************************************
  * @attention
  *
  * Copyright (c) 2026 STMicroelectronics.
  * All rights reserved.
  *
  * This software is licensed under terms that can be found in the LICENSE file
  * in the root directory of this software component.
  * If no LICENSE file comes with this software, it is provided AS-IS.
  *
  **********************************************************************************************************************
  */
/* Includes ------------------------------------------------------------------*/
#include "stm32_hal.h"
#include "stm32_hal_timebase.h"
/** @addtogroup STM32G5xx_HAL_Driver
  * @{
  */
/** @defgroup HAL_TimeBase_RTC_Alarm  HAL TimeBase RTC Alarm
  * @{
  */
/** @defgroup TimeBase_RTC_Alarm_Introduction TimeBase RTC Alarm Introduction
  * @{
  * - The RTC alarm timebase pattern provides an alternative to the default Cortex System Timer (SysTick)
  *   for the HAL timebase in STM32 microcontrollers.
  *
  * - This is useful in applications where SysTick is reserved for an RTOS, or when an ultra-low-power
  *   timebase is required. In this case, the RTC peripheral and its alarm feature are used to generate periodic
  *   interrupts for the HAL tick.
  *
  * - The RTC alarm timebase implementation is ready-to-use, requires no customization, and integrates
  *   seamlessly with the STM32 HAL.
  *
  */
/**
  * @}
  */
/** @defgroup TimeBase_RTC_Alarm_How_To_Use TimeBase RTC Alarm How To Use
  * @{
# How to use this driver #####
    Copy this file to the application folder and modify it as follows:
    - Rename it to 'stm32_hal_timebase_rtc_alarm.c'.
    - Add this file and the RTC HAL drivers to the project and uncomment the
      USE_HAL_RTC_MODULE define in stm32g5xx_hal_conf.h.
    - Do not use the HAL RTC alarm and HAL RTC Alarm drivers with low-power modes:
      The wake-up capability of the RTC can be intrusive when a prior low power mode
      configuration requires different wake-up sources.
      Application or example behavior is no longer guaranteed.
    - Use stm32_hal_timebase_rtc_alarm.c for applications or examples requiring low-power modes.
  */
/**
  * @}
  */
/** @defgroup TimeBase_RTC_Alarm_Configuration_Table TimeBase RTC Alarm Configuration Table
  * @{
## Configuration inside the timebase RTC alarm:
Config defines                  | Where            | Default value     | Note
------------------------------- | -----------------| ------------------| -------------------------------------------
USE_HAL_RTC_MODULE              | hal_conf.h       |         1         | Enable the HAL RTC module.
USE_ASSERT_DBG_PARAM            | PreProcessor env |         NA        | Enable parameter assert.
  */
/**
  * @}
  */
#if defined(USE_HAL_RTC_MODULE) && (USE_HAL_RTC_MODULE == 1)
/* Private typedef -----------------------------------------------------------*/
/* Private define ------------------------------------------------------------*/
#define SECOND_TO_HZ_CONVERTER 1000U
/* Private macro -------------------------------------------------------------*/
/** @defgroup TimeBase_RTC_Alarm_Private_Macros HAL TimeBase RTC Alarm private macros
  * @{
  */
/*! Check the HAL tick frequency value */
#define IS_TICK_FREQ(freq) (((freq) == HAL_TICK_FREQ_10HZ)     \
                            || ((freq) == HAL_TICK_FREQ_100HZ) \
                            || ((freq) == HAL_TICK_FREQ_1KHZ))
/*! Check HAL tick priority value */
#define IS_TICK_PRIO(prio) ((prio) <= ((1UL << (7U - uwPrioGroup)) - 1U))
/**
  * @}
  */
/* Private variables ---------------------------------------------------------*/
/* Private function prototypes -----------------------------------------------*/
static hal_status_t RtcAlarmTimebaseConfigTick(hal_tick_freq_t tick_freq);
static hal_status_t FindAsyncAndSyncPrescaler(uint32_t rtc_freq, uint32_t timebase_freq,
                                              uint8_t *async_prescaler, uint32_t *sync_prescaler);
__STATIC_INLINE uint32_t MapPriorityToGrouping(uint32_t old_prio, uint32_t old_bits, uint32_t new_bits);
/* Exported variables by reference--------------------------------------------*/
/* Private functions ---------------------------------------------------------*/
static hal_status_t RtcAlarmTimebaseConfigTick(hal_tick_freq_t tick_freq)
{
  hal_rtc_alarm_config_t alarm_config;
  hal_rtc_date_t date;
  hal_rtc_alarm_date_time_t alarm_date_time;
  hal_rtc_config_t rtc_config;
  uint8_t asyn_prescaler;
  uint32_t syn_prescaler;

  if (FindAsyncAndSyncPrescaler(HAL_RCC_RTC_GetKernelClkFreq(), tick_freq, &asyn_prescaler, &syn_prescaler) != HAL_OK)
  {
    return HAL_ERROR;
  }

  rtc_config.asynch_prediv = asyn_prescaler;
  rtc_config.synch_prediv = syn_prescaler;

  /* Set the RTC global configuration */
  rtc_config.mode = HAL_RTC_MODE_BCD;
  if (HAL_RTC_SetConfig(&rtc_config) != HAL_OK)
  {
    return HAL_ERROR;
  }

  /* Set the year to a value other than zero to trigger INITS (calendar initialized) */
  date.wday = HAL_RTC_WEEKDAY_MONDAY;
  date.mon = HAL_RTC_MONTH_JANUARY;
  date.mday = 1U;
  date.year = 1U;
  if (HAL_RTC_CALENDAR_SetDate(&date) != HAL_OK)
  {
    return HAL_ERROR;
  }

  /* Set the alarm configuration */
  alarm_config.subsec_auto_reload = HAL_RTC_ALARM_SUBSECONDS_AUTO_RELOAD_DISABLE;
  alarm_config.auto_clear = HAL_ALARM_AUTO_CLEAR_DISABLE;
  if (HAL_RTC_ALARM_SetConfig(HAL_RTC_ALARM_A, &alarm_config) != HAL_OK)
  {
    return HAL_ERROR;
  }

  /* Set the alarm date and time */
  alarm_date_time.mday_wday_selection = HAL_RTC_ALARM_DAY_TYPE_SEL_MONTHDAY;
  alarm_date_time.wday_mday.mday = 1U;
  /* Mask all to set alarm in each second unit increment (every 1 ms, 10 ms, or 100 ms) */
  alarm_date_time.mask = HAL_RTC_ALARM_MASK_ALL;
  alarm_date_time.subsec_mask = 0U;
  alarm_date_time.time.am_pm = HAL_RTC_TIME_FORMAT_AM_24H;
  alarm_date_time.time.hour = 0U;
  alarm_date_time.time.min = 0U;
  alarm_date_time.time.sec = 0U;
  alarm_date_time.time.subsec = 0U;
  if (HAL_RTC_ALARM_SetDateTime(HAL_RTC_ALARM_A, &alarm_date_time) != HAL_OK)
  {
    return HAL_ERROR;
  }

  return HAL_OK;
}

hal_status_t FindAsyncAndSyncPrescaler(uint32_t rtc_freq, uint32_t timebase_freq,
                                       uint8_t *async_prescaler, uint32_t *sync_prescaler)
{
  /*
  The update event period is calculated as follows:
  Update_event = RTC_CLK / ((APSC + 1) * (SPSC + 1))
  Where: RTC_CLK = RTC clock input
  APSC = 7-bit asynchronous prescaler register (0..127)
  SPSC = 16-bit synchronous prescaler register (1..32767)
  */
  /* The timebase must be 1 ms, 10 ms, or 100 ms
     Time base = ((RTC_ASYNCH_PREDIV + 1) * (RTC_SYNCH_PREDIV + 1)) / RTC_CLOCK
  */
  uint32_t target;
  uint32_t papsc;
  int64_t pspsc;

  target = rtc_freq / (SECOND_TO_HZ_CONVERTER / timebase_freq);
  for (papsc = 0; papsc <= 0x7FU; papsc++)
  {
    if (target % (papsc + 1) == 0)
    {
      pspsc = (target / (papsc + 1)) - 1;
      if (pspsc >= 0U && pspsc <= 0x7FFFU) /* SPSC min = 0, max = 0x7FFFU (32767). */
      {
        *async_prescaler = (uint16_t)papsc;
        *sync_prescaler = (uint16_t)pspsc;
        return HAL_OK; /* Found a valid pair */
      }
    }
  }
  return HAL_ERROR;
}

/**
  * @brief  Map a priority value from one NVIC grouping bit allocation to another.
  * @param  old_prio Priority value encoded with the previous bit allocation.
  * @param  old_bits Number of bits allocated in the previous grouping.
  * @param  new_bits Number of bits allocated in the new grouping.
  * @retval uint32_t Priority value remapped to the new grouping.
  */
__STATIC_INLINE uint32_t MapPriorityToGrouping(uint32_t old_prio, uint32_t old_bits, uint32_t new_bits)
{
  uint32_t max_new;
  uint32_t max_old;
  uint32_t tmp_old_prio;

  max_new = (1UL << (new_bits & 0x7U)) - 1U;
  max_old = (1UL << (old_bits & 0x7U)) - 1U;

  /* If old had no bits but new does, assign max new value that gives the lowest priority */
  if ((old_bits == 0U) && (new_bits > 0U))
  {
    return max_new;
  }

  /* Mask to valid bits */
  tmp_old_prio = old_prio & max_old;

  if (max_old == 0U)
  {
    return (max_new > 0U) ? max_new : 0U;
  }

  uint32_t new_prio = ((tmp_old_prio * max_new) + (max_old / 2UL)) / max_old;

  return (new_prio > max_new) ? max_new : new_prio;
}

/** @defgroup TimeBase_RTC_Alarm_Exported_Functions HAL TimeBase RTC Alarm Functions
  * @{
  */
/**
  * @brief Configure the timebase frequency and interrupt priority.
  * @param tick_freq  Tick frequency of type **hal_tick_freq_t** (to keep the current value, use global variable
  *        @ref uwTickFreq)
  * @param tick_priority Tick interrupt priority (to keep the current value, use global variable @ref uwTickPrio)
  * @note  Called at the beginning of the program by HAL_Init()
  *        or when the system core clock is modified (for instance, by the HAL RCC driver when needed).
  * @note  Declared as __WEAK to allow override in a user file.
  * @warning HAL tick is updated from interrupts at regular time intervals.
  *          Take care if HAL_Delay() is called from a peripheral interrupt process:
  *          the tick interrupt line needs higher priority (numerically lower) than the peripheral interrupt;
  *          otherwise, the caller interrupt process is blocked.
  * @retval HAL_OK HAL timebase correctly configured
  */
hal_status_t HAL_InitTick(hal_tick_freq_t tick_freq, uint32_t tick_priority)
{
  ASSERT_DBG_PARAM(IS_TICK_FREQ(tick_freq));
  ASSERT_DBG_PARAM(IS_TICK_PRIO(tick_priority));

  if (HAL_RTC_CALENDAR_IsInitialized() == HAL_RTC_CALENDAR_NOT_INITIALIZED)
  {
    timebase_init();
  }
  else
  {
    if (HAL_RTC_ALARM_Stop(HAL_RTC_ALARM_A) != HAL_OK)
    {
      return HAL_ERROR;
    }
  }

  HAL_RTC_DisableWriteProtection();
  HAL_RTC_EnterInitMode();

  if (RtcAlarmTimebaseConfigTick(tick_freq) != HAL_OK)
  {
    return HAL_ERROR;
  }

  uwTickFreq = tick_freq;
  uwTickPrio = tick_priority;

  /* Set the pre-emption priority and sub-priority according to the priority grouping meaning
     the number of allocated bits used respectively to encode the pre-emption and sub-priority */
  HAL_CORTEX_NVIC_SetPriority(TIMEBASE_IRQ,
                              (hal_cortex_nvic_preemp_priority_t)uwTickPrio,
                              (hal_cortex_nvic_sub_priority_t)uwTicksubPrio);

  /* Start RTC alarm with interrupt */
  if (HAL_RTC_ALARM_Start(HAL_RTC_ALARM_A, HAL_RTC_ALARM_IT_ENABLE) != HAL_OK)
  {
    return HAL_ERROR;
  }

  HAL_RTC_ExitInitMode();
  HAL_RTC_EnableWriteProtection();

  return HAL_OK;
}

/**
  * @brief  Adapts the HAL RTC Alarm Timebase interrupt preemption priority and subpriority
  *         according to changes in the NVIC priority grouping.
  *         This function recalculates and updates the HAL RTC Alarm Timebase interrupt priority values
  *         based on the previous NVIC priority grouping (stored in @ref uwPrioGroup)
  *         and the current grouping (read from @ref HAL_CORTEX_NVIC_GetPriorityGrouping).
  *         It ensures that the priorities remain valid and consistent after a change
  *         in the NVIC priority grouping.
  * @note   This function must be called by the user after changing the NVIC
  *         priority grouping using @ref HAL_CORTEX_NVIC_SetPriorityGrouping.
  * @note   If the previous priority grouping had no bits allocated for preemption
  *         priority or subpriority, but the new grouping does, the corresponding
  *         priority will be set to the maximum value (lowest priority) in the new
  *         grouping.
  */
void HAL_UpdateCoreTickPrio(void)
{
  hal_cortex_nvic_priority_group_t current_group = HAL_CORTEX_NVIC_GetPriorityGrouping();

  /* Calculate old and new preemption/subpriority bits */
  uint32_t old_preempt_bits = 7UL - uwPrioGroup;
  uint32_t old_sub_bits     = 4UL - old_preempt_bits;

  uint32_t new_preempt_bits = 7UL - (uint32_t)current_group;
  uint32_t new_sub_bits     = 4UL - new_preempt_bits;

  /* Map priorities from old to new grouping */
  uwTickPrio    = MapPriorityToGrouping(uwTickPrio,    old_preempt_bits, new_preempt_bits);
  uwTicksubPrio = MapPriorityToGrouping(uwTicksubPrio, old_sub_bits,     new_sub_bits);

  /* Update to current_group */
  uwPrioGroup = (uint32_t)current_group;

  /* Set the pre-emption priority and sub-priority according to the priority grouping meaning
     the number of allocated bits used respectively to encode the pre-emption and sub-priority */
  HAL_CORTEX_NVIC_SetPriority(TIMEBASE_IRQ,
                              (hal_cortex_nvic_preemp_priority_t)uwTickPrio,
                              (hal_cortex_nvic_sub_priority_t)uwTicksubPrio);
}

/**
  * @brief  Suspend tick increment.
  * @note   Disable tick increment by disabling the RTC alarm A interrupt.
  * @retval None
  */
void HAL_SuspendTick(void)
{
  HAL_RTC_DisableWriteProtection();
  HAL_RTC_EnterInitMode();

  HAL_RTC_ALARM_Stop(HAL_RTC_ALARM_A);

  HAL_RTC_ExitInitMode();
  HAL_RTC_EnableWriteProtection();
}

/**
  * @brief  Resume tick increment.
  * @note   Enable tick increment by enabling the RTC alarm A interrupt.
  * @retval None
  */
void HAL_ResumeTick(void)
{
  HAL_RTC_DisableWriteProtection();
  HAL_RTC_EnterInitMode();

  /* Start RTC alarm with interrupt */
  HAL_RTC_ALARM_Start(HAL_RTC_ALARM_A, HAL_RTC_ALARM_IT_ENABLE);

  HAL_RTC_ExitInitMode();
  HAL_RTC_EnableWriteProtection();
}

/**
  * @brief  Handle the RTC alarm A callback.
  * @param  None
  * @retval None
  */
void HAL_RTC_AlarmAEventCallback(void)
{
  HAL_IncTick();
}

/**
  * @}
  */
#endif /* USE_HAL_RTC_MODULE */
/**
  * @}
  */
/**
  * @}
  */
