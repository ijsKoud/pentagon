import {
	ActionRowBuilder,
	ModalActionRowComponentBuilder,
	ApplicationCommandOptionType,
	ModalBuilder,
	TextInputBuilder,
	TextInputStyle,
	ChatInputCommandInteraction,
	AutocompleteInteraction,
	CacheType
} from "discord.js";
import { ApplyOptions } from "../../../lib/decorators/StructureDecorators.js";
import { SubCommand, SubCommandOptions } from "../../../lib/structures/SubCommand.js";

@ApplyOptions<SubCommandOptions>({
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
		},
		{
			name: "reply",
			description: "Reply to a message from a ticket.",
			description_localizations: {
				nl: "Beantwoord een bericht van een ticket."
			},
			type: ApplicationCommandOptionType.Subcommand,
			options: [
				{
					name: "ticket",
					description: "The Id of the ticket you want to reply to.",
					description_localizations: {
						nl: "De Id van de ticket waarop je wilt reageren."
					},
					type: ApplicationCommandOptionType.String,
					autocomplete: true,
					required: true
				},
				{
					name: "response",
					name_localizations: {
						nl: "reactie"
					},
					description: "The message you the want to send.",
					description_localizations: {
						nl: "Het bericht dat je wilt versturen."
					},
					type: ApplicationCommandOptionType.String,
					max_length: 2048,
					required: true
				},
				{
					name: "attachments",
					name_localizations: {
						nl: "bijlagen"
					},
					description: "Any attachments you want to send with it.",
					description_localizations: {
						nl: "De eventuele bijlagen die je erbij wilt versturen."
					},
					type: ApplicationCommandOptionType.Attachment,
					required: false
				}
			]
		}
	],
	permissions: {
		dm: true
	},
	subcommands: [
		{
			name: "server",
			functionName: "serverSubCommand"
		},
		{
			name: "contact-dev",
			functionName: "contactDevSubCommand"
		},
		{
			name: "reply",
			functionName: "replySubCommand"
		}
	]
})
export default class extends SubCommand {
	public async autocomplete(interaction: AutocompleteInteraction<CacheType>) {
		const ticketInput = interaction.options.getString("ticket", true);
		const tickets = ["ticket-1234567890", "ticket-0987654321"];

		ticketInput;
		await interaction.respond(tickets.map((ticket) => ({ name: ticket, value: ticket })));
	}

	public async serverSubCommand(interaction: ChatInputCommandInteraction) {
		await interaction.reply(
			`🤝 Follow [this link](https://discord.gg/${process.env.DISCORD_SUPPORT_SERVER}) to join our server, if you need help do not hesistate to ask and if you want to contact a developer use </support contact-dev:${interaction.commandId}>`
		);
	}

	public async contactDevSubCommand(interaction: ChatInputCommandInteraction) {
		const modal = new ModalBuilder().setTitle("Contact the developer team.").setCustomId("contact-devteam");
		const titleInput = new TextInputBuilder()
			.setCustomId("contact-title")
			.setLabel("Title")
			.setPlaceholder("Is it possible to add...")
			.setRequired(true)
			.setMaxLength(512)
			.setStyle(TextInputStyle.Short);
		const descriptionInput = new TextInputBuilder()
			.setCustomId("contact-description")
			.setLabel("Description")
			.setPlaceholder("It is because currently...")
			.setRequired(true)
			.setMaxLength(2048)
			.setStyle(TextInputStyle.Paragraph);

		const firstActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(titleInput);
		const secondActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(descriptionInput);

		modal.addComponents(firstActionRow, secondActionRow);
		await interaction.showModal(modal);
	}

	public async replySubCommand(interaction: ChatInputCommandInteraction) {
		await interaction.deferReply({ ephemeral: true });

		const ticket = interaction.options.getString("ticket", true);
		const response = interaction.options.getString("response", true);
		const attachments = interaction.options.getAttachment("attachments", false);

		await interaction.editReply({ content: `<:greentick:749587347372507228>` });

		console.log(ticket, response, attachments);
	}
}
