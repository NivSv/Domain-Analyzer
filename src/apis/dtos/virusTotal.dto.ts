import { z } from 'nestjs-zod/z'
import { last } from 'rxjs'

const dnsRecordSchema = z.object({
    flags: z.string().optional(),
    priority: z.number().optional(),
    rname: z.string().optional(),
    retry: z.number().optional(),
    refresh: z.number().optional(),
    minimum: z.number().optional(),
    type: z.string().optional(),
    value: z.string(),
    tag: z.string().optional(),
    ttl: z.number(),
    expire: z.number().optional(),
    serial: z.number().optional(),
})

const rankSchema = z.object({
    timestamp: z.number(),
    rank: z.number(),
})

const analysisResultSchema = z.object({
    category: z.string(),
    result: z.string(),
    method: z.string(),
    engine_name: z.string(),
})

export const virusTotalSchema = z.object({
    attributes: z
        .object({
            last_dns_records: z.array(dnsRecordSchema),
            jarm: z.string().optional(),
            whois: z.string(),
            last_https_certificate_date: z.number().optional(),
            tags: z.array(z.string()),
            popularity_ranks: z.object({
                Majestic: rankSchema.optional(),
                Statvoo: rankSchema.optional(),
                Alexa: rankSchema.optional(),
                Cisco_Umbrella: rankSchema.optional(),
                Quantcast: rankSchema.optional(),
            }),
            last_analysis_date: z.number(),
            last_dns_records_date: z.number().optional(),
            last_analysis_stats: z.object({
                harmless: z.number(),
                malicious: z.number(),
                suspicious: z.number(),
                undetected: z.number(),
                timeout: z.number(),
            }),
            creation_date: z.number(),
            whois_date: z.number(),
            reputation: z.number(),
            registrar: z.string(),
            last_analysis_results: z.record(analysisResultSchema),
            last_update_date: z.number(),
            last_modification_date: z.number(),
            tld: z.string(),
            last_https_certificate: z.object({
                size: z.number(),
                public_key: z.object({
                    ec: z
                        .object({
                            oid: z.string(),
                            pub: z.string(),
                        })
                        .optional(),
                    algorithm: z.string(),
                }),
                thumbprint_sha256: z.string(),
                cert_signature: z.object({
                    signature: z.string(),
                    signature_algorithm: z.string(),
                }),
                validity: z.object({
                    not_after: z.string(),
                    not_before: z.string(),
                }),
                version: z.string(),
                extensions: z.object({
                    certificate_policies: z.array(z.string()),
                    extended_key_usage: z.array(z.string()),
                    authority_key_identifier: z.object({
                        keyid: z.string(),
                    }),
                    subject_alternative_name: z.array(z.string()),
                    subject_key_identifier: z.string(),
                    crl_distribution_points: z.array(z.string()).optional(),
                    key_usage: z.array(z.string()),
                    '1.3.6.1.4.1.11129.2.4.2': z.string(),
                    CA: z.boolean(),
                    ca_information_access: z.object({
                        'CA Issuers': z.string(),
                        OCSP: z.string(),
                    }),
                }),
                thumbprint: z.string(),
                serial_number: z.string(),
                issuer: z.object({
                    C: z.string(),
                    CN: z.string(),
                    O: z.string(),
                }),
                subject: z.object({
                    CN: z.string(),
                }),
            }),
            categories: z.record(z.string()),
            total_votes: z.object({
                harmless: z.number(),
                malicious: z.number(),
            }),
        })
        .optional(),
    type: z.string(),
    id: z.string(),
    links: z.object({
        self: z.string(),
    }),
})

export type virusTotalDto = z.infer<typeof virusTotalSchema>
