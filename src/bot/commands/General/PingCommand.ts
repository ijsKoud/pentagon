import { ApplyOptions } from "../../../lib/decorators/StructureDecorators.js";
import { Command, CommandLoadOptions, CommandOptions } from "../../../lib/structures/Command.js";

@ApplyOptions<CommandOptions>({
	name: "test",
	description: "test 3"
})
export default class extends Command {
	public load(options: CommandLoadOptions) {
		super.load(options);
	}
}
