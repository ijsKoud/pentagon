import { ApplyOptions } from "../../../lib/decorators/StructureDecorators.js";
import { Command, CommandLoadOptions, CommandOptions } from "../../../lib/structures/Command.js";

@ApplyOptions<CommandOptions>({
	name: "ping",
	descriptions: {
		"en-GB": "Ping... Pong!"
	}
})
export default class extends Command {
	public load(options: CommandLoadOptions) {
		super.load(options);
	}
}
