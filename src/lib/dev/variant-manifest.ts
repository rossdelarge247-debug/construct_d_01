export type VariantOption = {
  id: string;
  label: string;
  description?: string;
};

export type VariantSet = {
  label: string;
  options: VariantOption[];
  default: string;
};

export type VariantManifest = Record<string, VariantSet>;

export type PrototypeVariants = {
  prototypeId: string;
  prototypeLabel: string;
  manifest: VariantManifest;
};

export type VariantRegistry = Record<string, PrototypeVariants>;

export function findOption(set: VariantSet, id: string): VariantOption | undefined {
  return set.options.find((o) => o.id === id);
}

export function isValidVariantId(set: VariantSet | undefined, id: string | null | undefined): id is string {
  if (!id || !set) return false;
  return set.options.some((o) => o.id === id);
}
