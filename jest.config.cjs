/** @type {import('jest').Config} */
module.exports = {
	transform: { "^.+\\.ts?$": ["ts-jest", { isolatedModules: true, useESM: true }] },
	moduleNameMapper: {
		"^(\\.{1,2}/.*)\\.js$": "$1"
	},
	testEnvironment: "node",
	testRegex: "/tests/.*\\.(test|spec)?\\.(ts|tsx)$",
	moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
	extensionsToTreatAsEsm: [".ts"]
};
