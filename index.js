const dotenv = require('dotenv')
const request = require('request')
const tldEnum = require('tld-enum')
const tldExtract = require('tld-extract')
const SlackBot = require('slackbots')

const GLORIAFOOD_API_CLIENTS_URL = 'https://www.gloriafood.com/api/stats/clients_list'
const HUBSPOT_API_CONTACTS_URL = 'https://api.hubapi.com/contacts/v1/contact/batch'

dotenv.config()

const gloriafoodOptions = {
  method: 'POST',
  url: GLORIAFOOD_API_CLIENTS_URL,
  headers: { Authorization: process.env.GLORIAFOOD_API_KEY },
  body: {
    limit: 1000000,
  },
  json: true,
}

const bot = new SlackBot({
  token: process.env.SLACKBOT_API_KEY,
  name: 'GloriaFood',
})

const parseClient = client => ({
  email: client.email,
  properties: [
    { property: 'firstname', value: client.first_name },
    { property: 'lastname', value: client.last_name },
    { property: 'email', value: client.email },
    { property: 'phone', value: client.phone },
    { property: 'orders', value: client.orders_count },
    { property: 'total', value: client.orders_value },
  ],
})

const postSuccessMessageToTechChannel = () =>
  bot.postMessageToChannel(
    'tech',
    `
  ✅ Contacts successfully migrated to HubSpot :hubspot: See them live *<https://app.hubspot.com/contacts/${process.env.HUBSPOT_ACCOUNT_ID}|here>*.
`,
    {
      icon_emoji: ':gloriafood',
    },
  )

const postErrorMessageToTechChannel = () =>
  bot.postMessageToChannel(
    'tech',
    `
  ❌ There was an error with running the contacts migration. See the full logs *<https://dashboard.heroku.com/apps/${process.env.HEROKU_APP_NAME}/logs|here>*
`,
    {
      icon_emoji: ':gloriafood:',
    },
  )

const runPlugin = () => {
  request(gloriafoodOptions, (error, _, body) => {
    if (error) {
      postErrorMessageToTechChannel()
      throw error
    }

    const clients = body.rows.filter(client =>
      tldEnum.list.includes(tldExtract(`https://www.${client.email.split('@')[1]}`).tld),
    )
    const contacts = clients.map(client => parseClient(client))

    const hubspotOptions = {
      method: 'POST',
      url: HUBSPOT_API_CONTACTS_URL,
      qs: { hapikey: process.env.HUBSPOT_API_KEY },
      body: contacts,
      json: true,
    }

    request(hubspotOptions, (error, response, body) => {
      if (error) {
        postErrorMessageToTechChannel()
        throw error
      }
      if (body && body.failureMessages) {
        postErrorMessageToTechChannel()
        return
      }
      postSuccessMessageToTechChannel()
    })
  })
}

bot.on('start', runPlugin)
