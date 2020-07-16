const request = require('request')
const tldEnum = require('tld-enum')
const tldExtract = require('tld-extract')

const gloriafoodOptions = {
  method: 'POST',
  url: 'https://www.gloriafood.com/api/stats/clients_list',
  headers: { 'Authorization': process.env.GLORIAFOOD_API_KEY },
  body: {
    limit: 1_000_000
  },
  json: true
}

request(gloriafoodOptions, (error, response, body) => {
  if (error) throw new Error(error)

  const clients = body.rows.filter(client => tldEnum.list.includes(tldExtract(`https://www.${client.email.split('@')[1]}`).tld))
  const contacts = clients.map(client => ({
    email: client.email,
    properties: [
      { property: 'firstname', value: client.first_name },
      { property: 'lastname', value: client.last_name },
      { property: 'email', value: client.email },
      { property: 'phone', value: client.phone },
      { property: 'orders', value: client.orders_count },
      { property: 'total', value: client.orders_value },
      { property: 'pizzeria', value: true }
    ]
  }))

  // Post contacts to HubSpot
  const hubspotOptions = {
    method: 'POST',
    url: `https://api.hubapi.com/contacts/v1/contact/batch`,
    qs: { hapikey: process.env.HUBSPOT_API_KEY },
    body: contacts,
    json: true
  }

  request(hubspotOptions, (error, response, body) => {
    if (error) throw new Error(error)
    if (body && body.failureMessages) throw new Error(body.failureMessages)
  })
})
