import { Client, GatewayIntentBits } from "discord.js";

export class PentagonClient extends Client {
	public constructor() {
		super({
			intents: [
				GatewayIntentBits.Guilds,
				GatewayIntentBits.MessageContent,
				GatewayIntentBits.GuildMessages,
				GatewayIntentBits.DirectMessages,
				GatewayIntentBits.GuildMembers
			]
		});
	}
}
