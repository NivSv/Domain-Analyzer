import { Domains } from '@prisma/client'

export const domainStub: Domains = {
    id: '0',
    domain: 'google.com',
    lastScanned: new Date('2021-08-01T00:00:00.000Z'),
    virusTotal_Data: {},
    WHOIS_Data: {},
}
