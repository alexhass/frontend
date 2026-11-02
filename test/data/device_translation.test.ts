import { describe, expect, it } from "vitest";
import type { DeviceRegistryEntry } from "../../src/data/device/device_registry";
import {
  computeDeviceManufacturer,
  computeDeviceModel,
} from "../../src/data/device/device_translation";

const translations: Record<string, string> = {
  "component.syr_connect.device.safefloor.model": "Funk-Bodensensor {variant}",
};

const localize = ((key: string, placeholders?: Record<string, string>) => {
  const value = translations[key];
  if (value === undefined) {
    return "";
  }
  return value.replace(/\{(\w+)\}/g, (_, name) => placeholders?.[name] ?? "");
}) as any;

const device = (
  overrides: Partial<DeviceRegistryEntry> = {}
): DeviceRegistryEntry =>
  ({
    manufacturer: "Sanibel",
    model: "Wireless Floor Sensor A25",
    translation_key: "safefloor",
    translation_placeholders: { variant: "A25" },
    ...overrides,
  }) as DeviceRegistryEntry;

describe("computeDeviceModel", () => {
  it("translates the model with the translation key", () => {
    expect(computeDeviceModel(localize, device(), "syr_connect")).toBe(
      "Funk-Bodensensor A25"
    );
  });

  it("keeps the stored model without a translation", () => {
    expect(
      computeDeviceModel(
        localize,
        device({ translation_key: "other" }),
        "syr_connect"
      )
    ).toBe("Wireless Floor Sensor A25");
  });

  it("keeps the stored model without a translation key or domain", () => {
    expect(
      computeDeviceModel(
        localize,
        device({ translation_key: null }),
        "syr_connect"
      )
    ).toBe("Wireless Floor Sensor A25");
    expect(computeDeviceModel(localize, device(), undefined)).toBe(
      "Wireless Floor Sensor A25"
    );
  });

  it("shows no model when the device has none", () => {
    expect(
      computeDeviceModel(localize, device({ model: null }), "syr_connect")
    ).toBeNull();
  });
});

describe("computeDeviceManufacturer", () => {
  it("keeps a manufacturer without a translation", () => {
    expect(computeDeviceManufacturer(localize, device(), "syr_connect")).toBe(
      "Sanibel"
    );
  });
});
