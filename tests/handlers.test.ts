import { PentagonClient } from "./mocks/ClientMock";
import { describe, test, expect, vi } from "vitest";
import { bold, underline } from "colorette";
import { InteractionReplyOptions, RepliableInteraction } from "discord.js";

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
	test("ErrorHandler: handling Discord responses", () => {
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
