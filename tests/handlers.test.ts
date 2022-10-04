import { PentagonClient } from "./mocks/ClientMock";
import { describe, test, expect, vi } from "vitest";
import { bold, underline } from "colorette";
import { ApplicationCommand, ApplicationCommandOptionType, InteractionReplyOptions, PermissionsBitField, RepliableInteraction } from "discord.js";
import { Command } from "../src/lib/structures/Command";

describe("test(EventHandler): handling & running functions", () => {
	const client = new PentagonClient();

	test("client(Handlers): loading the classes", async () => {
		expect(await client.run()).toEqual({ commands: 1, events: 1 });
	});

	test("client(EventListener): test event listening", () => {
		const log = vi.spyOn(console, "log").mockImplementation(() => void 0);
		client.emit("test");

		expect(log).toBeCalledWith("test(EventListener): test complete, event was called.");
	});
});

describe("test(ErrorHandler): Discord responses & console.log", () => {
	test("ErrorHandler: handling logging in console", () => {
		const client = new PentagonClient({ console });
		const log = vi.spyOn(console, "error").mockImplementation(() => void 0);

		client.errorHandler.handleError(new Error("This is a mock Error"));
		expect(log).toBeCalledWith(`[ERROR] » ${bold(underline(`Error(Error)`))}: This is a mock Error`);
	});

	test("ErrorHandler: handling Discord responses", () => {
		const mockInteraction = {
			followUp: (options: InteractionReplyOptions) => new Promise((res) => res(void 0)),
			isRepliable: () => true,
			guildId: "123456789012",
			channelId: "123456789012"
		} as unknown as RepliableInteraction;

		const client = new PentagonClient();
		const followUpSpy = vi.spyOn(mockInteraction, "followUp");

		client.errorHandler.handleError(new Error("This is a mock Error"), mockInteraction);
		expect(followUpSpy).toBeCalledWith({
			content:
				"Welcome to our corner of errors, a place you shouldn't come to too often. It is probably not your fault though, something on our side brought you here. Stay safe out there, if this happens again make sure to contact the support team."
		});
	});
});

describe("test(CommandRegistryHandler): differences & data getters", () => {
	const client = new PentagonClient();
	const mockApplicationCommand: ApplicationCommand = {
		name: "test",
		nameLocalizations: {
			"en-GB": "test",
			"en-US": "test2"
		},
		description: "hello world",
		descriptionLocalizations: {
			"en-GB": "hello world",
			"en-US": "hello universe"
		},
		dmPermission: false,
		defaultMemberPermissions: new PermissionsBitField(["AddReactions"]),
		options: [
			{
				name: "name",
				description: "your name",
				type: ApplicationCommandOptionType.String,
				choices: [
					{
						name: "Daan",
						value: "Daan"
					}
				]
			}
		]
	} as ApplicationCommand;

	const mockCommand: Command = {
		name: "test",
		nameLocalizations: {
			"en-GB": "test",
			"en-US": "test2"
		},
		descriptions: {
			"en-GB": "hello world",
			"en-US": "hello universe"
		},
		permissions: {
			dm: false,
			default: ["AddReactions"]
		},
		options: [
			{
				name: "name",
				description: "your name",
				type: ApplicationCommandOptionType.String,
				choices: [
					{
						name: "Daan",
						value: "Daan"
					}
				]
			}
		]
	} as unknown as Command;

	test("CommandRegistryHandler: checking the difference should received 'null'", () => {
		// @ts-expect-error not for testing
		expect(client.commandHandler.registry.isDifferent(mockApplicationCommand, mockCommand)).toEqual(null);
	});

	test("CommandRegistryHandler: checking the difference should received 'dmPermission'", () => {
		const command = { ...mockCommand };
		command.permissions.dm = true;

		// @ts-expect-error not for testing
		expect(client.commandHandler.registry.isDifferent(mockApplicationCommand, mockCommand)).toEqual("dmPermission");
		command.permissions.dm = false;
	});

	test("CommandRegistryHandler: checking the difference should receive 'defaultMemberPermissions'", () => {
		const command = { ...mockCommand };
		command.permissions.default = undefined;

		// @ts-expect-error not for testing
		expect(client.commandHandler.registry.isDifferent(mockApplicationCommand, command)).toEqual("defaultMemberPermissions");

		command.permissions.default = ["AddReactions"];
	});

	test("CommandRegistryHandler: checking the difference should receive 'descriptionLocalizations'", () => {
		const command = { ...mockCommand };
		command.descriptions["en-US"] = undefined;

		// @ts-expect-error not for testing
		expect(client.commandHandler.registry.isDifferent(mockApplicationCommand, command)).toEqual("descriptionLocalizations");

		command.descriptions!["en-US"] = "hello universe";
	});

	test("CommandRegistryHandler: checking the difference should receive 'nameLocalizations'", () => {
		const command = { ...mockCommand };
		command.nameLocalizations!["en-US"] = undefined;

		// @ts-expect-error not for testing
		expect(client.commandHandler.registry.isDifferent(mockApplicationCommand, command)).toEqual("nameLocalizations");

		command.nameLocalizations!["en-US"] = "test2";
	});

	test("CommandRegistryHandler: checking the difference should receive 'options'", () => {
		const command = { ...mockCommand };
		command.options = [];

		// @ts-expect-error not for testing
		expect(client.commandHandler.registry.isDifferent(mockApplicationCommand, command)).toEqual("options");
	});

	// TODO: Add tests for: getCommandData
});
