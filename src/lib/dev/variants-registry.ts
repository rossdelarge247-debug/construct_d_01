import { PRE_SIGNUP_INTERVIEW_VARIANTS } from '@/app/dev/proto/pre-signup-interview/variants';
import type { VariantRegistry } from './variant-manifest';

export const VARIANT_REGISTRY: VariantRegistry = {
  [PRE_SIGNUP_INTERVIEW_VARIANTS.prototypeId]: PRE_SIGNUP_INTERVIEW_VARIANTS,
};
