import { ExtendedClient } from "../core/client.js";
import { utilityService } from "../modules/community/utility.service.js";
import { EmbedBuilder, TextChannel } from "discord.js";

export function startReminderCron(client: ExtendedClient) {
  setInterval(async () => {
    try {
      const dueReminders = await utilityService.getDueReminders();
      for (const reminder of dueReminders) {
        await utilityService.completeReminder(reminder.id);

        const embed = new EmbedBuilder()
          .setColor(0xf1c40f)
          .setTitle("⏰ Reminder Alert")
          .setDescription(`Hey <@${reminder.userId}>, here is what you asked to be reminded of:\n\n> **${reminder.message}**`)
          .setFooter({ text: "Scheduled Reminder" })
          .setTimestamp();

        let delivered = false;

        // 1. Try sending to original channel
        try {
          const channel = await client.channels.fetch(reminder.channelId).catch(() => null);
          if (channel && channel.isTextBased()) {
            await (channel as TextChannel).send({
              content: `<@${reminder.userId}>`,
              embeds: [embed],
            });
            delivered = true;
          }
        } catch {
          // Channel might be deleted or inaccessible
        }

        // 2. Fallback to Direct Message if channel delivery failed
        if (!delivered) {
          try {
            const user = await client.users.fetch(reminder.userId).catch(() => null);
            if (user) {
              await user.send({ embeds: [embed] }).catch(() => null);
            }
          } catch {
            // DM might be closed
          }
        }
      }
    } catch (err) {
      console.error("[Reminder Interval Error]", err);
    }
  }, 10000);
}
