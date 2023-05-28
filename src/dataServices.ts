import axios from 'axios'
import { ConfigService } from './config/config.service'
const configService = new ConfigService()

export const WhoIsApi = async (domain: string) => {
    const whoIs_res = await axios.get(
        `https://www.whoisxmlapi.com/whoisserver/WhoisService?apiKey=${configService.WHOIS_KEY}&domainName=${domain}&outputFormat=JSON`
    )
    return whoIs_res.data.WhoisRecord
}

export const VirusTotalApi = async (domain: string) => {
    const virusTotal_res = await axios.get(
        ` https://www.virustotal.com/api/v3/domains/${domain}`,
        {
            headers: {
                'x-apikey': configService.VIRUS_TOTAL_KEY,
            },
        }
    )
    return virusTotal_res.data.data
}
