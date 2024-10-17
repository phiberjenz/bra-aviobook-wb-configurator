"use client";

import { useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { RootSchema } from "@/lib/validation";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

export default function ConfigsPage() {
  const digitalSignatureOptions = [
    { value: "PASSWORD", label: "Password" },
    { value: "HANDWRITTEN", label: "Handwritten" },
    { value: "DEVICE_SIGNATURE", label: "Device Signature" },
    { value: "NONE", label: "None" },
  ];

  // Default variation structure as a constant
  const defaultVariation = (id: number) => ({
    id,
    name: "",
    general: {
      weightUnit: "KG" as "KG" | "LB",
      fuelUnit: "KG" as "KG" | "LB",
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
      passenger: { paxWeightPolicies: [] },
      bag: { bagWeightPolicies: [] },
    },
    cabin: { type: "COMMERCIAL" as "COMMERCIAL", sections: [] },
    holdConfiguration: { holds: [], combinedLimits: [] },
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
  });

  const form = useForm<z.infer<typeof RootSchema>>({
    resolver: zodResolver(RootSchema),
    defaultValues: {
      registration: "",
      operationalUse: false,
      variations: [defaultVariation(1)],
    },
  });

  const { control, setValue, watch } = form;
  const variationsFieldArray = useFieldArray({
    control,
    name: "variations",
  });

  // Watch for changes in variations to recalculate IDs
  const variations = watch("variations");

  // Recalculate IDs whenever the variations array changes
  useEffect(() => {
    variationsFieldArray.fields.forEach((_, index) => {
      // Set the variation's ID based on the index (starting from 1)
      setValue(`variations.${index}.id`, index + 1);
    });
  }, [variations, variationsFieldArray.fields, setValue]);

  function onSubmit(values: z.infer<typeof RootSchema>) {
    console.log(values);
  }

  // Export logic (same as before)
  const handleExport = () => {
    const formValues = form.getValues(); // Get the form values
    const dataStr = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(formValues, null, 2)
    )}`;
    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute(
      "download",
      `config_${formValues.registration || "config"}.json`
    );
    document.body.appendChild(downloadAnchorNode); // required for Firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  // Import logic (same as before)
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const importedConfig = JSON.parse(event.target?.result as string);
          form.reset(importedConfig); // Reset the form with imported data
        } catch (error) {
          console.error("Invalid JSON file", error);
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="p-5">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Registration Field */}
          <FormField
            control={form.control}
            name="registration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Registration</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription>
                  Enter the registration number (exactly 5 letters).
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* BEW Field */}
          <FormField
            control={form.control}
            name="bew"
            render={({ field }) => (
              <FormItem>
                <FormLabel>BEW</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormDescription>
                  Basic empty weight of the aircraft (must be positive).
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* BI Field */}
          <FormField
            control={form.control}
            name="bi"
            render={({ field }) => (
              <FormItem>
                <FormLabel>BI</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} />
                </FormControl>
                <FormDescription>
                  Basic Index (positive double).
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Digital Signature */}
          <FormField
            control={form.control}
            name="digitalSignature"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Digital Signature</FormLabel>

                <Select
                  onValueChange={(value) => field.onChange(value)} // Update form value with the literal
                  value={field.value || ""} // Bind the current value to the Select
                >
                  <FormControl>
                    <SelectTrigger>
                      {/* Find the label for the current value */}
                      <SelectValue placeholder="Select an option">
                        {digitalSignatureOptions.find(
                          (option) => option.value === field.value
                        )?.label || "Select an option"}
                      </SelectValue>
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {digitalSignatureOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label} {/* Display the user-friendly label */}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Select the digital signature type.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Operational Use */}
          <FormField
            control={form.control}
            name="operationalUse"
            render={({ field }) => (
              <FormItem className="flex flew-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Operational Use</FormLabel>
                  <FormDescription>
                    Is this configuration for operational use?
                  </FormDescription>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </div>
                <div className="space-y-1 leading-none"></div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Variations Dynamic Field Array */}
          <FormItem>
            <FormLabel>Variations</FormLabel>
            <FormDescription>Manage aircraft variations here.</FormDescription>
            {variationsFieldArray.fields.map((item, index) => (
              <div key={item.id} className="mb-5">
                <h3 className="text-lg font-semibold">
                  Variation {form.getValues(`variations.${index}.id`)}
                </h3>
                <FormField
                  control={form.control}
                  name={`variations.${index}.name`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Variation Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>Name of the variation.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Remove Button */}
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => variationsFieldArray.remove(index)}
                >
                  Remove Variation
                </Button>
              </div>
            ))}

            {/* Add Variation Button */}
            <Button
              type="button"
              onClick={() => variationsFieldArray.append(defaultVariation())}
            >
              Add Variation
            </Button>
          </FormItem>

          {/* Export Button */}
          <Button type="button" onClick={handleExport} className="bg-green-600">
            Export JSON
          </Button>

          {/* Import JSON */}
          <div className="flex items-center space-x-4">
            <label className="block text-sm font-medium text-gray-700">
              Import JSON Config
            </label>
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              className="border border-gray-300 p-2 rounded"
            />
          </div>

          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
}
