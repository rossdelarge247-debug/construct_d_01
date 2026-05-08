import { z } from 'zod';

export const sectionSchema = z.enum([
  'pre-auth-public',
  'auth-boundary',
  'post-signup-onboarding',
  'bank-connect',
  'hub',
  'build',
  'reconcile',
  'settle',
  'finalise',
  'cross-cutting',
  'dev-tools',
]);

export const statusSchema = z.enum([
  'not-started',
  'spec-only',
  'canvas-drafted',
  'prototype-built',
  'shipped',
]);

export const confidenceSchema = z.enum(['high', 'medium', 'low', 'low-blocked']);

export const ownerSchema = z.enum(['user', 'claude', 'both']);

export const linksSchema = z.object({
  spec: z.string().optional(),
  canvas: z.string().optional(),
  prototype: z.string().optional(),
  slice: z.string().optional(),
});

export const lastTouchedSchema = z.object({
  session: z.number().int().nonnegative(),
  date: z.string().min(1),
});

export const registryRowSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  section: sectionSchema,
  status: statusSchema,
  confidence: confidenceSchema,
  owner: ownerSchema,
  tags: z.array(z.string()),
  openQuestions: z.array(z.string()).max(5),
  lastTouched: lastTouchedSchema,
  links: linksSchema,
});

export type Section = z.infer<typeof sectionSchema>;
export type Status = z.infer<typeof statusSchema>;
export type Confidence = z.infer<typeof confidenceSchema>;
export type Owner = z.infer<typeof ownerSchema>;
export type RegistryRow = z.infer<typeof registryRowSchema>;
