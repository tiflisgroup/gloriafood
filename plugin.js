import request from 'request'

const gloriafoodOptions = {
  method: 'POST',
  url: 'https://www.gloriafood.com/api/stats/clients_list',
  headers: { 'Authorization': 'UTx1bfBDlrDhECaNEykVHRC9Xyq4JN0Uqgvvy5E' },
  body: {
    limit: 1_000_000
  },
  json: true
}

request(gloriafoodOptions, (error, response, body) => {
  if (error) throw new Error(error)

  const clients = clients.body.rows.filter
  
  const contacts = body.rows.map(client => {
    const email = client.email === 'giovinazzablu@hotmail.itn' ? 'giovinazzablu@hotmail.it' : 
                  client.email === 'vic.rosso@gmail.cim' ? 'vic.rosso@gmail.com' :
                  client.email
    return {
      email: email,
      properties: [
        { property: 'firstname', value: client.first_name },
        { property: 'lastname', value: client.last_name },
        { property: 'email', value: client.email },
        { property: 'phone', value: client.phone },
        // { property: 'orderscount', value: client.orders_count },
        // { property: 'ordersvalue', value: client.orders_value },
        // { property: 'lastorder', value: client.last_order },
        // { properties: 'labels', value: 'pizzeria' }
      ]
    }
  })

  const hubspotOptions = {
    method: 'POST',
    url: `https://api.hubapi.com/contacts/v1/contact/batch`,
    qs: { hapikey: '3e60c85c-9098-45c7-a63f-f98e279270d1' },
    body: contacts,
    json: true
  }

  request(hubspotOptions, (error, response, body) => {
    if (error) throw new Error(error)

    console.log(body.failureMessages.map(msg => msg.propertyValidationResult))
  })
})

