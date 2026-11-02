import type { LocalizeFunc } from "../../common/translations/localize";
import type { DeviceRegistryEntry } from "./device_registry";

type TranslatedDeviceField = "manufacturer" | "model";

// The registry keeps the values the integration passed, they are only
// translated for display. Without a translation the stored value is shown.
const computeTranslatedDeviceField = (
  localize: LocalizeFunc,
  device: DeviceRegistryEntry,
  domain: string | undefined,
  field: TranslatedDeviceField
): string | null => {
  const value = device[field];
  if (!value || !domain || !device.translation_key) {
    return value;
  }
  return (
    localize(
      `component.${domain}.device.${device.translation_key}.${field}`,
      device.translation_placeholders ?? {}
    ) || value
  );
};

export const computeDeviceModel = (
  localize: LocalizeFunc,
  device: DeviceRegistryEntry,
  domain: string | undefined
): string | null =>
  computeTranslatedDeviceField(localize, device, domain, "model");

export const computeDeviceManufacturer = (
  localize: LocalizeFunc,
  device: DeviceRegistryEntry,
  domain: string | undefined
): string | null =>
  computeTranslatedDeviceField(localize, device, domain, "manufacturer");
