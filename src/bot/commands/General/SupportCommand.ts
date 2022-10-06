import {
	ActionRowBuilder,
	ModalActionRowComponentBuilder,
	ApplicationCommandOptionType,
	CommandInteraction,
	ModalBuilder,
	TextInputBuilder,
	TextInputStyle
} from "discord.js";
import { ApplyOptions } from "../../../lib/decorators/StructureDecorators.js";
import { Command, CommandOptions } from "../../../lib/structures/Command.js";

@ApplyOptions<CommandOptions>({
	name: "support",
	nameLocalizations: {
		"en-GB": "support"
	},
	descriptions: {
		"en-GB": "Get support from the developers or support agents via our support server.",
		nl: "Krijg hulp via een developer of support agent via onze support server."
	},
	options: [
		{
			name: "server",
			description: "The link to our Discord support server.",
			description_localizations: {
				nl: "Een link naar de Discord help server."
			},
			type: ApplicationCommandOptionType.Subcommand
		},
		{
			name: "contact-dev",
			description: "Contact a developer from the support server.",
			description_localizations: {
				nl: "Contacteer een developer uit de support server."
			},
			type: ApplicationCommandOptionType.Subcommand
		}
	],
	permissions: {
		dm: true
	}
})
export default class extends Command {
	public async run(interaction: CommandInteraction) {
		// TODO: add subcommand handler
		if (!interaction.isChatInputCommand()) return;

		const subcommand = interaction.options.getSubcommand(true);
		if (subcommand === "server") {
			await interaction.reply(
				`🤝 Follow [this link](https://discord.gg/${process.env.DISCORD_SUPPORT_SERVER}) to join our server, if you need help do not hesistate to ask and if you want to contact a developer use </support contact-dev:${interaction.commandId}>`
			);

			return;
		}

		const modal = new ModalBuilder().setTitle("Contact the developer team.").setCustomId("contact-devteam");
		const titleInput = new TextInputBuilder()
			.setCustomId("contact-title")
			.setLabel("Title")
			.setPlaceholder("Is it possible to add...")
			.setRequired(true)
			.setStyle(TextInputStyle.Short);
		const descriptionInput = new TextInputBuilder()
			.setCustomId("contact-description")
			.setLabel("Description")
			.setPlaceholder("It is because currently...")
			.setRequired(true)
			.setStyle(TextInputStyle.Paragraph);

		const firstActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(titleInput);
		const secondActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(descriptionInput);

		modal.addComponents(firstActionRow, secondActionRow);
		await interaction.showModal(modal);
	}
}
