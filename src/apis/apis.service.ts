import { Injectable } from '@nestjs/common'
import axios from 'axios'
import { ConfigService } from '../config/config.service'
import { whoIsDto, whoIsSchema } from './dtos/whoIs.dto'
import { virusTotalDto, virusTotalSchema } from './dtos/virusTotal.dto'

@Injectable()
export class ApisService {
    configService = new ConfigService()

    WhoIsApi = async (domain: string): Promise<whoIsDto> => {
        const whoIs_res = await axios.get(
            `https://www.whoisxmlapi.com/whoisserver/WhoisService?apiKey=${this.configService.WHOIS_KEY}&domainName=${domain}&outputFormat=JSON`
        )
        whoIsSchema.parse(whoIs_res.data.WhoisRecord)
        return whoIs_res.data.WhoisRecord
    }

    VirusTotalApi = async (domain: string): Promise<virusTotalDto> => {
        const virusTotal_res = await axios.get(
            ` https://www.virustotal.com/api/v3/domains/${domain}`,
            {
                headers: {
                    'x-apikey': this.configService.VIRUS_TOTAL_KEY,
                },
            }
        )
        virusTotalSchema.parse(virusTotal_res.data.data)
        return virusTotal_res.data.data
    }
}
