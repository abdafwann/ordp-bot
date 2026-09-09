import { ActivityType, Events } from 'discord.js'
import { ExtendedClient } from '../core/client.js'

export function registerReadyEvent(client: ExtendedClient) {
  client.once(Events.ClientReady, (readyClient) => {
    console.log(`[Bot Ready] Logged in as ${readyClient.user.tag}`)

    readyClient.user.setPresence({
      activities: [
        {
          name: 'Listening to your heartbeat',
          type: ActivityType.Custom,
        },
      ],
      status: 'online',
    })
  })
}
