import { InteractionType, ModalSubmitInteraction } from "discord.js";
import { ApplyOptions } from "../../lib/decorators/StructureDecorators.js";
import { InteractionListener, InteractionListenerOptions } from "../../lib/structures/InteractionListener.js";

@ApplyOptions<InteractionListenerOptions>({
	name: "contact-devteam",
	type: InteractionType.ModalSubmit
})
export default class extends InteractionListener {
	public async run(interaction: ModalSubmitInteraction) {
		const title = interaction.fields.getTextInputValue("contact-title");
		const description = interaction.fields.getField("contact-description");

		console.log(title, description);
		await interaction.reply({
			content: `<:greentick:749587347372507228> We have received your request. A developer will pick-up your ticket as soon as possible, we will DM you when we are ready. Make sure to keep them open and notifications enabled!`,
			ephemeral: true
		});
	}
}
