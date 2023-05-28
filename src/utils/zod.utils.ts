import { z } from 'zod'

export function isValidDomain(domain: string) {
    const domainSchema = z
        .string()
        .regex(/^[a-zA-Z0-9]+([\-\.]{1}[a-zA-Z0-9]+)*\.[a-zA-Z]{2,}$/)

    try {
        domainSchema.parse(domain)
        return true
    } catch (error) {
        return false
    }
}
