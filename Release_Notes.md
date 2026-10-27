

# Release Notes for
# <mark>STM32G5xx HAL Drivers SW Pack</mark>

[![ST logo](_htmresc/st_logo_2020.png)](https://www.st.com)

# Purpose

STM32Cube enables developers to achieve design success. With a comprehensive suite of professional development tools and embedded software components, STM32Cube allows developers to differentiate products, streamline design cycles, and reduce costs. STM32Cube ecosystem supports all design steps, including selection, configuration, development, debugging, programming, and monitoring.

The STM32Cube embedded software offer provides ready-to-use software components that can be added to a project. It includes STM32 peripheral driver APIs with two levels of abstraction, middleware, board drivers, and examples. There are several distribution channels, including the STM32CubeMX2 tool, the ST website, and GitHub. All embedded software comes with enhanced online documentation, with flowcharts and user sequences.

More detailed documentation is available at [STM32G5xx HAL Drivers online documentation](https://dev.st.com/stm32cube-docs/stm32g5xx-hal-drivers/latest/en/index.html)


# Update History

<label for="collapse-section-2.0.0" aria-hidden="true">__2.0.0 / 25-September-2026__</label>
<div>

## Main changes

### First Official release of **STM32G5xx HAL Drivers**


## Contents

- **HAL/LL Drivers** are available for all peripherals:
  - **System** : CORTEX, CRS, DBGMCU, DCACHE, DMA(Q), GTZC, ICACHE, IWDG, PWR, RCC, RTC, SBS, WWDG
  - **I/O** : EXTI, GPIO
  - **Analog** : ADC, COMP, DAC, DTS, OPAMP, POSENC, VREFBUF
  - **Timers** : TIM, HRTIM, LPTIM
  - **Connectivity** : FDCAN, I2C, I2S, I3C, SMARTCARD, SMBUS, SPI, UART, LPUART, USART, UCPD, USB (HCD/PCD)
  - **Security** : AES, CCB, HASH, OTFDEC (part of XSPI), RNG, PKA, TAMP
  - **Computing** : CORDIC, CRC, FMAC
  - **Memory** : FLASH, RAMCFG, XSPI(DLYB)
  - **Logic Array**: PLAy
  - **Common** : OS, Timebases, Templates
- **Utils** are available for FDCAN, I2C, I3C peripherals.



## Development toolchains and compilers

- IAR Embedded Workbench for ARM (EWARM) toolchain V9.60.3 + ST-LINK
- MDK-ARM Keil uVision V5.42
- STM32CubeIDE for Visual Studio Code (GCC13 compiler)
- STM32CubeMX2 V1.1.1


## Supported devices and boards

- STM32G564xx, STM32G563xx, STM32G554xx, STM32G553xx devices
- STM32G544xx, STM32G534xx devices
- NUCLEO-G564RE(revB02), B-G564E-MC1S(revB02), B-G564E-DPOW1(revB01) boards


## Known limitations

- HAL DAC
  - Missing define for TIM12 DAC conversion trigger (HAL_DAC_TRIGGER_TIM12_TRGO, LL_DAC_TRIGGER_TIM12_TRGO). User should use HAL_DAC_TRIGGER_TIM9_TRGO, LL_DAC_TRIGGER_TIM9_TRGO instead (same underlying value).
  - Missing define for TIM12 DAC reset trigger (HAL_DAC_RST_TRIGGER_TIM12_TRGO, LL_DAC_RST_TRIGGER_TIM12_TRGO). User should use HAL_DAC_RST_TRIGGER_TIM9_TRGO, LL_DAC_RST_TRIGGER_TIM9_TRGO instead (same underlying value).
- HAL FLASH
  - Wrong reported HW address for EDATA in case of ECC error
- HAL I2S
  - ARMCC v6.24.0 compilation with -Oz optimization may reorder peripheral memory accesses causing initialization and execution issues in HAL I2S driver.
- HAL I3C
  - Acknowledgement issue is observed after 2 consecutive aborts (interrupt race condition).


## Backward compatibility

- None


## Dependencies

- STM32G5xx DFP 2.0.0


</div>



For complete documentation on STM32 Microcontrollers,
visit: [www.st.com/stm32](https://www.st.com/en/microcontrollers-microprocessors/stm32-32-bit-arm-cortex-mcus.html)
<abbr title="Based on template cx566953 version 2.1"></abbr>