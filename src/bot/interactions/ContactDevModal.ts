import { InteractionType, ModalSubmitInteraction } from "discord.js";
import { TicketStatus, TicketType } from "../../lib/components/TicketSystem.js";
import { ApplyOptions } from "../../lib/decorators/StructureDecorators.js";
import { InteractionListener, InteractionListenerOptions } from "../../lib/structures/InteractionListener.js";
import { nanoid } from "nanoid";

@ApplyOptions<InteractionListenerOptions>({
	name: "contact-devteam",
	type: InteractionType.ModalSubmit
})
export default class extends InteractionListener {
	public async run(interaction: ModalSubmitInteraction) {
		await interaction.deferReply({ ephemeral: true });

		const title = interaction.fields.getTextInputValue("contact-title");
		const description = interaction.fields.getTextInputValue("contact-description");

		const existingTicket = await this.client.prisma.ticket.findFirst({
			where: { originalPoster: interaction.user.id, type: TicketType.DEV_TICKET, status: { in: [TicketStatus.CLAIMED, TicketStatus.OPEN] } }
		});
		if (existingTicket) {
			await interaction.editReply({
				content: `<:redcross:749587325901602867> You already opened a ticket (${existingTicket.id}), please finish that one first before opening a new one.`
			});
			return;
		}

		const ticket = await this.client.prisma.ticket.create({
			data: {
				claimedBy: "",
				id: `ticket-${nanoid(12)}`,
				type: TicketType.DEV_TICKET,
				title,
				description,
				originalPoster: interaction.user.id,
				transcription: {},
				status: TicketStatus.CLAIMED
			}
		});

		await interaction.editReply({
			content: `<:greentick:749587347372507228> We have received your request. A developer will pick-up your ticket (\`${ticket.id}\`) as soon as possible, we will DM you when we are ready. Make sure to keep them open and notifications enabled!`
		});
	}
}
