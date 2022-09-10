const axios = require('axios')
const cherio = require('cherio')
const url = 'https://www.amazon.in/gp/product/B08ZJQWWTN/ref=s9_acss_bw_cg_Budget_2a1_w?pf_rd_m=A1K21FY43GMZF8&pf_rd_s=merchandised-search-16&pf_rd_r=GW4KT5DBTT0H30D23R6R&pf_rd_t=101&pf_rd_p=9a0bd88f-92e8-4c52-bd37-648ff3009c45&pf_rd_i=1389401031&th=1'
require('dotenv').config();
var accountSid = process.env.TWILIO_ACCOUNT_SID; // Your Account SID from www.twilio.com/console
var authToken = process.env.TWILIO_AUTH_TOKEN;   // Your Auth Token from www.twilio.com/console

const client = require('twilio')(accountSid, authToken);
const product = {name: '', price: '', link: ''}

// const handler = setInterval(scrap, 2000)
async function scrap() {
    try {
      const {data} = await axios.get(url);
      const $ = cherio.load(data)
      const item = $('div#dp-container')
      const productName = $(item).find('h1 span#productTitle').text().trim();
      const price = $(item).find('.apexPriceToPay').children().first().text().replace(/[,]/g, '')


      const priceNum = parseInt(price.substring(1))
      product.name = productName;
      product.price = price;
      product.link = url;

      if (priceNum < 100000) {
        client.messages.create({
          body: `Price change alert for ${product.name}\n\n Current price: ${product.price}\n\n You can purchase it on this link: ${product.link}`,
          from: '+15735383265',
          to: '+917417639020'
        }).then((messages) => {
          console.log(messages)
          clearInterval(handler)
        })
      }
    } catch (error) {
      console.error(error);
    }
}
  