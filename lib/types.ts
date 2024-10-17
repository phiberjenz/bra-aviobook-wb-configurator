export type Root = {
  bew?: number;
  bi?: number;
  digitalSignature?: "PASSWORD" | "HANDWRITTEN" | "DEVICE_SIGNATURE" | "NONE";
  highlightedResults?: HighlightedResult[];
  operationalUse: boolean;
  registration: string;
  variations?: Variation[];
  disclaimer?: string;
};

export type HighlightedResult =
  | "DOW"
  | "PAYLOAD"
  | "ZFW"
  | "TO"
  | "TOW"
  | "TRIP"
  | "LW"
  | "UNDERLOAD"
  | "DOI"
  | "ZFCG"
  | "TOCG"
  | "LCG"
  | "MACZFW"
  | "MACTOW"
  | "MACLW"
  | "THS";

export type Variation = {
  id: number;
  shortDescription?: string;
  default?: boolean;
  name: string;
  info?: string;
  general: General;
  aircraft: Aircraft;
  weightPolicy: WeightPolicy;
  cabin: Cabin;
  holdConfiguration: HoldConfiguration;
  fuel: { trimming?: boolean };
  envelopeTypes: EnvelopeType[];
  table: Table;
};

export type General = {
  weightUnit: "KG" | "LB";
  fuelUnit: "KG" | "LB";
  performanceMtow: { min: number; max: number; requireManualInput?: boolean };
  performanceLw: { min: number; max: number; requireManualInput?: boolean };
  blockFuel?: { min: number; max: number };
  taxiFuel: { min: number; max: number };
  tripFuel: { min: number; max: number };
  landingFuel: { min: number; max: number };
  takeOffFuel: { min: number; max: number };
  dowCorrection: { min: number; max: number };
  doiCorrection: { min: number; max: number };
  dowLimit?: { min: number; max: number };
  doiLimit?: { min: number; max: number };
  payloadLimit?: { min: number; max: number };
  drawFuelVector: boolean;
  disclaimer?: string;
  digitalSignature?: "PASSWORD" | "HANDWRITTEN" | "DEVICE_SIGNATURE" | "NONE";
  highlightedResults?: HighlightedResult[];
};

export type Aircraft = {
  structuralMzfw: number;
  structuralMrmpw: number;
  structuralMlw: number;
  configurationGroups: {
    label: string;
    configurations: {
      id: number;
      label?: string;
      indexShift?: number;
      weightShift?: number;
      default?: boolean;
    }[];
  }[];
  structuralMtows: { mtow: number }[];
};

export type WeightPolicy = {
  passenger: {
    allowOptimum?: boolean;
    default?: boolean;
    paxWeightPolicies: {
      id: number;
      maleWeight: number;
      femaleWeight: number;
      childWeight: number;
      adultWeight: number;
      infantWeight: number;
      label: string;
      default?: boolean;
    }[];
  };
  bag: {
    default?: boolean;
    bagWeightPolicies: {
      id: number;
      label: string;
      bagWeight: number;
      default?: boolean;
    }[];
  };
};

export type Cabin = {
  type: "COMMERCIAL";
  sections: {
    id: number;
    indexShiftPerWeightUnit: number;
    jumpSeat?: boolean;
    label: string;
    max: number;
    rowFrom?: number;
    rowTo?: number;
  }[];
};

export type HoldConfiguration = {
  useMail?: boolean;
  useCargo?: boolean;
  useBags?: boolean;
  daaWeight?: number;
  crewBagWeight?: number;
  holds: {
    id: number;
    used?: boolean;
    label?: string;
    max?: number;
    indexShiftPerWeightUnit?: number;
  }[];
  combinedLimits: { max?: number; holds: number[] }[];
};

export type EnvelopeType = {
  id: number;
  label: string;
  default?: boolean;
  zfw: Envelope;
  tow: Envelope;
  lw: Envelope;
};

export type Envelope = {
  weight?: number;
  minVal?: number;
  maxVal?: number;
  envelope: { x: number; y: number }[];
};

export type Table = {
  standardFueling: Records;
  cgToMac: Lines;
  macToThs: Records;
};

export type Records = { y: number; value: number };

export type Lines = {
  // Has to be sorted ascending based on %MAC
  mac: number;
  index1: number;
  weight1: number;
  index2: number;
  weight2: number;
};
