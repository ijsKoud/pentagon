import type { PentagonClient } from "../Client.js";
import type { Base } from "../structures/Base.js";
import type { CommandOptions } from "../structures/Command.js";
import type { EventListenerOptions } from "../structures/EventListener.js";
import { ApplyOptionsParam, createClassDecorator, createProxy, ConstructorType } from "./utils.js";

/**
 * Applies the ConstructorOptions to a Command | EventListener extended class
 * @param result The ConstructorOptions or a function to get the ConstructorOptions from
 */
export function ApplyOptions<Options extends CommandOptions | EventListenerOptions>(result: ApplyOptionsParam<Options>): ClassDecorator {
	const getOptions = (client: PentagonClient) => (typeof result === "function" ? result(client) : result);

	const classDecorator = createClassDecorator((target: ConstructorType<ConstructorParameters<typeof Base>, Options>) => {
		createProxy(target, {
			construct: (constructor, [client, baseOptions = {}]: [PentagonClient, Partial<Options>]) =>
				new constructor(client, { ...baseOptions, ...getOptions(client) })
		});
	});

	return classDecorator;
}
