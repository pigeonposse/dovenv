export type Config = {
	/**
	 * Name of the repository
	 * @example "dovenv"
	 */
	repoID?                : string
	/**
	 * GitHub user|org ID
	 */
	userID?                : string
	/**
	 * URL of the repopository
	 * @example "https://github.com/pigeonposse/dovenv"
	 */
	repoURL?               : string
	/**
	 * The URL of the project's homepage.
	 * @example "https://pigeonposse.com"
	 */
	homepageURL?           : string
	/**
	 * Tags or topics associated with the repository
	 * @example [ "web", "api", "rest-api", "openapi", "library", "node", "js"]
	 */
	repoTags?              : string[]
	/**
	 * Description of the repository
	 * @example "This is a cool project"
	 */
	repoDesc?              : string
	/**
	 * Workflow default inputs
	 */
	workflowDefaultInputs? : string
	/**
	 * Path to .github/workflows directory
	 */
	workflowsDir?          : string
	/**
	 * Primary branch from the repository
	 * @example "main"
	 */
	defaultBranch?         : string

}
