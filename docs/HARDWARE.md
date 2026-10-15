# Future hardware integration

## Confirmed direction

A controller prototype described as Arduino-based, with a roughly 5-inch screen, will let the player edit TONEX settings without a computer during use. USB-C or Bluetooth connectivity is being explored; neither transport nor exact protocol has been verified for the prototype here.

The platform must be designed so a computer can transfer the information the controller needs to configure downstream devices wherever remote control is supported. Manual operation remains the first platform milestone. Hardware integration is an approved future requirement, not an implemented feature.

## Proposed architecture requirements

- Store a tone recipe as structured data, not only a paragraph of instructions. The same settings should support human-readable instructions and future hardware export.
- Identify each device model and applicable firmware, parameter names, units, ranges, and verified capabilities.
- Keep musical intent, device-specific settings, and transport commands separate. Do not let generated prose directly become hardware commands.
- Use device adapters to translate validated settings into supported commands. Distinguish standard MIDI from any device-specific USB protocol.
- Include routing information such as target device, output port, and MIDI channel where applicable. Do not assume every device uses MIDI channels or standard MIDI.
- Define a versioned transfer package with schema validation and controller compatibility checks before transfer.
- Report which settings can be sent automatically, which require manual adjustment, and which are unsupported or unverified.
- Design for the controller to retain imported recipes and use them without a computer. Storage, capacity, and persistence need prototype verification.
- Distinguish requested values, transmitted commands, and confirmed device values. A successful send does not prove the receiving device applied the setting.
- Define ordering, timing, and supported value conversions from verified device documentation or prototype tests.

No final schema, libraries, transports, or firmware architecture have been selected.

## Proposed workflow

1. Platform creates a structured recipe for a known rig.
2. Computer connects to the controller and checks compatibility.
3. Controller validates and stores the recipe, reporting unsupported items.
4. Player selects or edits it on the screen.
5. Controller translates supported settings into commands for connected equipment.
6. Manual instructions remain available for settings that cannot be controlled.

## Prototype details to collect later

- Exact TONEX model and firmware.
- Exact microcontroller board, screen, and existing firmware or source repository.
- Working connection topology, including adapters and USB host/device roles.
- What USB or Bluetooth currently does in the prototype and which parameters have actually been tested.
- Other intended MIDI devices and the parameters to control.
- Computer-to-controller transport and whether configuration and pedal control must work simultaneously.
- Whether parameter readback is supported and how the screen handles unknown state.

A USB-C connector does not establish a device's protocol or USB role. Bluetooth and parameter readback must be verified for each concrete hardware arrangement.
