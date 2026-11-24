'use strict';

// API input uses camelCase; services map it to database columns.
const { z } = require('zod');

const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Expected YYYY-MM-DD');
const str = (max) => z.string().trim().max(max);

const fields = {
  title: str(50).nullable().optional(),
  fullName: str(200).min(1),
  position: str(200).nullable().optional(),
  startDate: date,
  contractType: z.literal('1y').optional(),
  field: z.enum(['law', 'edu']).nullable().optional(),
  email: z.union([z.literal(''), z.string().trim().email().max(200)]).nullable().optional(),
  phone: str(30).nullable().optional(),
  notes: str(2000).nullable().optional(),
  attachmentUrl: z.union([z.literal(""), z.string().trim().max(1000).url().refine((u) => /^https:\/\//i.test(u), "Must start with https://")]).nullable().optional(),
  attachmentName: str(200).nullable().optional(),
};

const createSchema = z.object({ ...fields, fullName: str(200).min(1), startDate: date });
const updateSchema = z.object(fields).partial();

module.exports = { createSchema, updateSchema };
