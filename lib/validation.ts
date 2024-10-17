import { z } from "zod";

// HighlightedResult Schema
const HighlightedResultSchema = z.enum([
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
]);

// Envelope Schema
const EnvelopeSchema = z.object({
  weight: z.number().optional(),
  minVal: z.number().optional(),
  maxVal: z.number().optional(),
  envelope: z.array(z.object({ x: z.number(), y: z.number() })),
});

// Table Schema
const TableSchema = z.object({
  standardFueling: z.object({ y: z.number(), value: z.number() }),
  cgToMac: z.object({
    mac: z.number(),
    index1: z.number(),
    weight1: z.number(),
    index2: z.number(),
    weight2: z.number(),
  }),
  macToThs: z.object({ y: z.number(), value: z.number() }),
});

// WeightPolicy Schema
const WeightPolicySchema = z.object({
  passenger: z.object({
    allowOptimum: z.boolean().optional(),
    default: z.boolean().optional(),
    paxWeightPolicies: z.array(
      z.object({
        id: z.number(),
        maleWeight: z.number(),
        femaleWeight: z.number(),
        childWeight: z.number(),
        adultWeight: z.number(),
        infantWeight: z.number(),
        label: z.string(),
        default: z.boolean().optional(),
      })
    ),
  }),
  bag: z.object({
    default: z.boolean().optional(),
    bagWeightPolicies: z.array(
      z.object({
        id: z.number(),
        label: z.string(),
        bagWeight: z.number(),
        default: z.boolean().optional(),
      })
    ),
  }),
});

// Cabin Schema
const CabinSchema = z.object({
  type: z.literal("COMMERCIAL"),
  sections: z.array(
    z.object({
      id: z.number(),
      indexShiftPerWeightUnit: z.number(),
      jumpSeat: z.boolean().optional(),
      label: z.string(),
      max: z.number(),
      rowFrom: z.number().optional(),
      rowTo: z.number().optional(),
    })
  ),
});

// HoldConfiguration Schema
const HoldConfigurationSchema = z.object({
  useMail: z.boolean().optional(),
  useCargo: z.boolean().optional(),
  useBags: z.boolean().optional(),
  daaWeight: z.number().optional(),
  crewBagWeight: z.number().optional(),
  holds: z.array(
    z.object({
      id: z.number(),
      used: z.boolean().optional(),
      label: z.string().optional(),
      max: z.number().optional(),
      indexShiftPerWeightUnit: z.number().optional(),
    })
  ),
  combinedLimits: z.array(
    z.object({
      max: z.number().optional(),
      holds: z.array(z.number()),
    })
  ),
});

// Aircraft Schema
const AircraftSchema = z.object({
  structuralMzfw: z.number(),
  structuralMrmpw: z.number(),
  structuralMlw: z.number(),
  configurationGroups: z.array(
    z.object({
      label: z.string(),
      configurations: z.array(
        z.object({
          id: z.number(),
          label: z.string().optional(),
          indexShift: z.number().optional(),
          weightShift: z.number().optional(),
          default: z.boolean().optional(),
        })
      ),
    })
  ),
  structuralMtows: z.array(
    z.object({
      mtow: z.number(),
    })
  ),
});

// General Schema
const GeneralSchema = z.object({
  weightUnit: z.enum(["KG", "LB"]),
  fuelUnit: z.enum(["KG", "LB"]),
  performanceMtow: z.object({
    min: z.number(),
    max: z.number(),
    requireManualInput: z.boolean().optional(),
  }),
  performanceLw: z.object({
    min: z.number(),
    max: z.number(),
    requireManualInput: z.boolean().optional(),
  }),
  blockFuel: z
    .object({
      min: z.number(),
      max: z.number(),
    })
    .optional(),
  taxiFuel: z.object({
    min: z.number(),
    max: z.number(),
  }),
  tripFuel: z.object({
    min: z.number(),
    max: z.number(),
  }),
  landingFuel: z.object({
    min: z.number(),
    max: z.number(),
  }),
  takeOffFuel: z.object({
    min: z.number(),
    max: z.number(),
  }),
  dowCorrection: z.object({
    min: z.number(),
    max: z.number(),
  }),
  doiCorrection: z.object({
    min: z.number(),
    max: z.number(),
  }),
  dowLimit: z
    .object({
      min: z.number(),
      max: z.number(),
    })
    .optional(),
  doiLimit: z
    .object({
      min: z.number(),
      max: z.number(),
    })
    .optional(),
  payloadLimit: z
    .object({
      min: z.number(),
      max: z.number(),
    })
    .optional(),
  drawFuelVector: z.boolean(),
  disclaimer: z.string().optional(),
  digitalSignature: z
    .enum(["PASSWORD", "HANDWRITTEN", "DEVICE_SIGNATURE", "NONE"])
    .optional(),
  highlightedResults: z.array(HighlightedResultSchema).optional(),
});

// Variation Schema
const VariationSchema = z.object({
  id: z.number(),
  shortDescription: z.string().optional(),
  default: z.boolean().optional(),
  name: z.string(),
  info: z.string().optional(),
  general: GeneralSchema,
  aircraft: AircraftSchema,
  weightPolicy: WeightPolicySchema,
  cabin: CabinSchema,
  holdConfiguration: HoldConfigurationSchema,
  fuel: z.object({
    trimming: z.boolean().optional(),
  }),
  envelopeTypes: z.array(
    z.object({
      id: z.number(),
      label: z.string(),
      default: z.boolean().optional(),
      zfw: EnvelopeSchema,
      tow: EnvelopeSchema,
      lw: EnvelopeSchema,
    })
  ),
  table: TableSchema,
});

// Root Schema
export const RootSchema = z.object({
  bew: z
    .number()
    .int()
    .min(0, { message: "BEW must be a positive integer." })
    .optional(),
  bi: z
    .number()
    .min(0, { message: "BI must be a positive double." })
    .optional(),
  digitalSignature: z
    .enum(["PASSWORD", "HANDWRITTEN", "DEVICE_SIGNATURE", "NONE"])
    .optional(),
  highlightedResults: z.array(HighlightedResultSchema).optional(),
  operationalUse: z.boolean(),
  registration: z
    .string()
    .length(5, { message: "Registration must be exactly 5 letters." }),
  variations: z
    .array(VariationSchema)
    .min(1, { message: "At least one variation must be defined" })
    .optional(),
  disclaimer: z.string().optional(),
});
