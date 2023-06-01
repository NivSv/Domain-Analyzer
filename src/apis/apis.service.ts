import { Injectable } from '@nestjs/common'
import axios from 'axios'
import { ConfigService } from '../config/config.service'

@Injectable()
export class ApisService {
    configService = new ConfigService()

    WhoIsApi = async (domain: string): Promise<any> => {
        const whoIs_res = await axios.get(
            `https://www.whoisxmlapi.com/whoisserver/WhoisService?apiKey=${this.configService.WHOIS_KEY}&domainName=${domain}&outputFormat=JSON`
        )
        return whoIs_res.data.WhoisRecord
    }

    VirusTotalApi = async (domain: string): Promise<any> => {
        const virusTotal_res = await axios.get(
            ` https://www.virustotal.com/api/v3/domains/${domain}`,
            {
                headers: {
                    'x-apikey': this.configService.VIRUS_TOTAL_KEY,
                },
            }
        )
        return virusTotal_res.data.data
    }
}
