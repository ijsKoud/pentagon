import type { ticket } from "@prisma/client";
import type { Attachment } from "discord.js";
import type { PentagonClient } from "../Client.js";

export class TicketSystem {
	public constructor(public client: PentagonClient) {}

	public async message(ticket: ticket, message: string, attachment: Attachment | null, toOP: boolean, userTag: string) {
		if (ticket.status !== TicketStatus.CLAIMED) return;

		const id = toOP ? ticket.originalPoster : ticket.claimedBy;
		const content = `💬 \`[${ticket.id}]\` => Message from **${userTag}** (<@${toOP ? ticket.claimedBy : ticket.originalPoster}>): ${message}`;

		await this.client.users.send(id, {
			content,
			files: attachment ? [attachment] : []
		});
	}
}

export enum TicketType {
	GUILD_TICKET = 1,
	DEV_TICKET
}

export enum TicketStatus {
	OPEN = 1,
	CLAIMED,
	CLOSED
}
