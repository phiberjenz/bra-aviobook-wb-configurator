"use client";

import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { RootSchema } from "@/lib/validation";
import {
  Root,
  HighlightedResult,
  Variation,
  General,
  Aircraft,
  WeightPolicy,
  Cabin,
  HoldConfiguration,
  EnvelopeType,
  Envelope,
  Table,
  Records,
  Lines,
} from "@/lib/types";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function ConfigsPage() {
  const form = useForm<z.infer<typeof RootSchema>>({
    resolver: zodResolver(RootSchema),
    defaultValues: {
      registration: "",
      operationalUse: false,
    },
  });

  function onSubmit(values: z.infer<typeof RootSchema>) {
    console.log(values);
  }

  const [config, setConfig] = useState<Root>({
    operationalUse: true,
    registration: "",
    variations: [],
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    path: string
  ) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;

    setConfig((prevConfig) => {
      if (!prevConfig) return prevConfig;
      const updatedConfig = { ...prevConfig };

      const setNestedValue = (obj: any, path: string, value: any) => {
        const keys = path.split(".");
        let current = obj;
        while (keys.length > 1) {
          const key = keys.shift()!;
          if (!current[key]) current[key] = {};
          current = current[key];
        }
        current[keys[0]] = value;
      };

      setNestedValue(updatedConfig, path, value);
      return updatedConfig;
    });
  };

  const handleMultiSelectChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
    path: string
  ) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map(
      (option) => option.value
    );

    setConfig((prevConfig) => {
      const updatedConfig = { ...prevConfig };

      const setNestedValue = (obj: any, path: string, value: any) => {
        const keys = path.split(".");
        let current = obj;
        while (keys.length > 1) {
          const key = keys.shift()!;
          if (!current[key]) current[key] = {};
          current = current[key];
        }
        current[keys[0]] = value;
      };

      // Update the highlightedResults either in root or in variation
      setNestedValue(updatedConfig, path, selectedOptions);
      return updatedConfig;
    });
  };

  // Handle JSON File Import
  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const importedConfig = JSON.parse(event.target?.result as string);
          setConfig(importedConfig); // Update the form state with the imported configuration
        } catch (error) {
          alert("Invalid JSON file");
        }
      };
      reader.readAsText(file);
    }
  };

  // Handle JSON File Export

  const exportConfig = () => {
    const dataStr = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(config, null, 2)
    )}`;
    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute(
      "download",
      `${config.registration || "config"}.json`
    );
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  // Define the HighlightedResult values explicitly
  const validHighlightedResults: HighlightedResult[] = [
    "DOW",
    "PAYLOAD",
    "ZFW",
    "TO",
    "TOW",
    "TRIP",
    "LW",
    "UNDERLOAD",
    "DOI",
    "ZFCG",
    "TOCG",
    "LCG",
    "MACZFW",
    "MACTOW",
    "MACLW",
    "THS",
  ];

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Configuration Editor</h1>

      <div className="flex space-x-4 mb-6">
        <label className="block text-sm font-medium text-gray-700">
          Import JSON Config
        </label>
        <input
          type="file"
          accept=".json"
          onChange={handleFileImport}
          className="border border-gray-300 p-2 rounded"
        />
      </div>

      {/* Basic Info for root element */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Registration
          </label>
          <label className="text-xs text-color-gray-500">
            This field identify for which aircraft registration the
            configuration is defined.
          </label>
          <input
            type="text"
            value={config.registration}
            onChange={(e) => handleInputChange(e, "registration")}
            className="mt-1 block w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">BEW</label>
          <label className="text-xs text-color-gray-500">
            The BASIC EMPTY WEIGHT of the aircraft. This is the weight of the
            aircraft without operator specific additions, typically supplied by
            the manufacturer.
          </label>
          <input
            type="number"
            value={config.bew}
            onChange={(e) => handleInputChange(e, "bew")}
            className="mt-1 block w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">BI</label>
          <input
            type="number"
            value={config.bi}
            onChange={(e) => handleInputChange(e, "bi")}
            className="mt-1 block w-full p-2 border border-gray-300 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Digital Signature
          </label>
          <select
            value={config.digitalSignature}
            onChange={(e) => handleInputChange(e as any, "digitalSignature")}
            className="mt-1 block w-full p-2 border border-gray-300 rounded"
          >
            <option value="PASSWORD">Password</option>
            <option value="HANDWRITTEN">Handwritten</option>
            <option value="DEVICE_SIGNATURE">Device Signature</option>
            <option value="NONE">None</option>
          </select>
        </div>

        <div className="flex items-center mt-2">
          <input
            type="checkbox"
            checked={config.operationalUse}
            onChange={(e) => handleInputChange(e, "operationalUse")}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
          />
          <label className="ml-2 block text-sm font-medium text-gray-700">
            Operational Use
          </label>
        </div>

        {/* Highlighted Results */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Root Highlighted Results
          </label>
          <p className="text-xs text-gray-500">
            Overridden by variation specific highlighted results
          </p>
          <select
            multiple
            value={config.highlightedResults || []} // Handle root-level highlightedResults
            onChange={(e) => handleMultiSelectChange(e, "highlightedResults")} // Use the generic handler
            className="mt-1 block w-full p-2 border border-gray-300 rounded"
          >
            {validHighlightedResults.map((result) => (
              <option key={result} value={result}>
                {result}
              </option>
            ))}
          </select>
        </div>

        {/* Disclaimer */}
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            Disclaimer
          </label>
          <textarea
            value={config.disclaimer || ""}
            onChange={(e) => handleInputChange(e, "disclaimer")}
            className="mt-1 block w-full p-2 border border-gray-300 rounded"
          />
        </div>
      </div>

      {/* Variations */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Variations</h3>
        {config.variations?.map((variation, index) => (
          <div key={index} className="mb-4 p-4 bg-gray-100 rounded-lg">
            <h4 className="text-md font-medium">Variation {index + 1}</h4>

            <div className="mt-3">
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                value={variation.name}
                onChange={(e) =>
                  handleInputChange(e, `variations.${index}.name`)
                }
                className="mt-1 block w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div className="mt-3">
              <label className="block text-sm font-medium text-gray-700">
                Short Description
              </label>
              <input
                type="text"
                value={variation.shortDescription || ""}
                onChange={(e) =>
                  handleInputChange(e, `variations.${index}.shortDescription`)
                }
                className="mt-1 block w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div className="flex items-center mt-3">
              <input
                type="checkbox"
                checked={variation.default || false}
                onChange={(e) =>
                  handleInputChange(e, `variations.${index}.default`)
                }
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm font-medium text-gray-700">
                Default
              </label>
            </div>

            <div className="sm:col-span-2 mt-3">
              <label className="block text-sm font-medium text-gray-700">
                Info
              </label>
              <textarea
                value={variation.info || ""}
                onChange={(e) =>
                  handleInputChange(e, `variations.${index}.info`)
                }
                className="mt-1 block w-full p-2 border border-gray-300 rounded"
              />
            </div>

            {/* Render highlightedResults for variation.general */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Variation Highlighted Results
              </label>
              <select
                multiple
                value={variation.general?.highlightedResults || []} // Handle variation-level highlightedResults
                onChange={(e) =>
                  handleMultiSelectChange(
                    e,
                    `variations.${index}.general.highlightedResults`
                  )
                } // Use the generic handler
                className="mt-1 block w-full p-2 border border-gray-300 rounded"
              >
                {validHighlightedResults.map((result) => (
                  <option key={result} value={result}>
                    {result}
                  </option>
                ))}
              </select>
            </div>

            {/* Add other fields for variation (General, Aircraft, WeightPolicy, Cabin, HoldConfiguration, Fuel, etc.) */}
            {/* Example: Aircraft Section */}
            <h4 className="text-md font-medium mt-4">Aircraft Settings</h4>
            <label className="block text-sm font-medium text-gray-700">
              Structural MZFW
            </label>
            <input
              type="number"
              value={variation.aircraft.structuralMzfw}
              onChange={(e) =>
                handleInputChange(
                  e,
                  `variations.${index}.aircraft.structuralMzfw`
                )
              }
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
            />

            <label className="block text-sm font-medium text-gray-700">
              Structural MRMPW
            </label>
            <input
              type="number"
              value={variation.aircraft.structuralMrmpw}
              onChange={(e) =>
                handleInputChange(
                  e,
                  `variations.${index}.aircraft.structuralMrmpw`
                )
              }
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
            />

            <label className="block text-sm font-medium text-gray-700">
              Structural MLW
            </label>
            <input
              type="number"
              value={variation.aircraft.structuralMlw}
              onChange={(e) =>
                handleInputChange(
                  e,
                  `variations.${index}.aircraft.structuralMlw`
                )
              }
              className="mt-1 block w-full p-2 border border-gray-300 rounded"
            />

            {/* Continue adding more Aircraft settings fields */}
            {/* Add fields for WeightPolicy, Cabin, HoldConfiguration, etc. */}
          </div>
        ))}
      </div>

      {/* Add Variation Button */}
      <button
        onClick={() =>
          setConfig((prevConfig) => ({
            ...prevConfig,
            variations: [
              ...(prevConfig.variations || []),
              {
                id: Date.now(),
                name: "",
                general: {
                  weightUnit: "KG",
                  fuelUnit: "KG",
                  performanceMtow: { min: 0, max: 0 },
                  performanceLw: { min: 0, max: 0 },
                  taxiFuel: { min: 0, max: 0 },
                  tripFuel: { min: 0, max: 0 },
                  landingFuel: { min: 0, max: 0 },
                  takeOffFuel: { min: 0, max: 0 },
                  dowCorrection: { min: 0, max: 0 },
                  doiCorrection: { min: 0, max: 0 },
                  drawFuelVector: false,
                },
                aircraft: {
                  structuralMzfw: 0,
                  structuralMrmpw: 0,
                  structuralMlw: 0,
                  structuralMtows: [{ mtow: 0 }],
                  configurationGroups: [],
                },
                weightPolicy: {
                  passenger: {
                    paxWeightPolicies: [],
                  },
                  bag: {
                    bagWeightPolicies: [],
                  },
                },
                cabin: {
                  type: "COMMERCIAL",
                  sections: [],
                },
                holdConfiguration: {
                  holds: [],
                  combinedLimits: [],
                },
                fuel: { trimming: false },
                envelopeTypes: [
                  {
                    id: 1,
                    label: "STANDARD",
                    zfw: { envelope: [] },
                    tow: { envelope: [] },
                    lw: { envelope: [] },
                  },
                ],
                table: {
                  standardFueling: { y: 0, value: 0 },
                  cgToMac: {
                    mac: 0,
                    index1: 0,
                    weight1: 0,
                    index2: 0,
                    weight2: 0,
                  },
                  macToThs: { y: 0, value: 0 },
                },
              },
            ],
          }))
        }
        className="bg-blue-600 text-white px-4 py-2 mt-4 rounded hover:bg-blue-700"
      >
        Add New Variation
      </button>

      {/* Export Button */}
      <button
        onClick={exportConfig}
        className="bg-green-600 text-white px-4 py-2 mt-6 rounded hover:bg-green-700"
      >
        Export Configuration
      </button>
    </div>
  );
}
