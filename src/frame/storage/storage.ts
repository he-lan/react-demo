

export enum StorageScope {

	/**
	 * The stored data will be scoped to all workspaces.
	 */
	GLOBAL,

	/**
	 * The stored data will be scoped to the current workspace.
	 */
	WORKSPACE
}

export interface IStorageService {

	readonly _serviceBrand: undefined;
	
	/**
	 * Emitted when the storage is about to persist. This is the right time
	 * to persist data to ensure it is stored before the application shuts
	 * down.
	 *
	 * The will save state event allows to optionally ask for the reason of
	 * saving the state, e.g. to find out if the state is saved due to a
	 * shutdown.
	 *
	 * Note: this event may be fired many times, not only on shutdown to prevent
	 * loss of state in situations where the shutdown is not sufficient to
	 * persist the data properly.
	 */
	// readonly onWillSaveState: Event<IWillSaveStateEvent>;

	/**
	 * Retrieve an element stored with the given key from storage. Use
	 * the provided defaultValue if the element is null or undefined.
	 *
	 * The scope argument allows to define the scope of the storage
	 * operation to either the current workspace only or all workspaces.
	 */
	get(key: string, scope: StorageScope, fallbackValue: string): string;
	get(key: string, scope: StorageScope, fallbackValue?: string): string | undefined;

	/**
	 * Retrieve an element stored with the given key from storage. Use
	 * the provided defaultValue if the element is null or undefined. The element
	 * will be converted to a boolean.
	 *
	 * The scope argument allows to define the scope of the storage
	 * operation to either the current workspace only or all workspaces.
	 */
	getBoolean(key: string, scope: StorageScope, fallbackValue: boolean): boolean;
	getBoolean(key: string, scope: StorageScope, fallbackValue?: boolean): boolean | undefined;

	/**
	 * Retrieve an element stored with the given key from storage. Use
	 * the provided defaultValue if the element is null or undefined. The element
	 * will be converted to a number using parseInt with a base of 10.
	 *
	 * The scope argument allows to define the scope of the storage
	 * operation to either the current workspace only or all workspaces.
	 */
	getNumber(key: string, scope: StorageScope, fallbackValue: number): number;
	getNumber(key: string, scope: StorageScope, fallbackValue?: number): number | undefined;

	/**
	 * Store a value under the given key to storage. The value will be converted to a string.
	 * Storing either undefined or null will remove the entry under the key.
	 *
	 * The scope argument allows to define the scope of the storage
	 * operation to either the current workspace only or all workspaces.
	 */
	store(key: string, value: string | boolean | number | undefined | null, scope: StorageScope): void;

	/**
	 * Delete an element stored under the provided key from storage.
	 *
	 * The scope argument allows to define the scope of the storage
	 * operation to either the current workspace only or all workspaces.
	 */
	remove(key: string, scope: StorageScope): void;

	/**
	 * Log the contents of the storage to the console.
	 */
	logStorage(): void;

	/**
	 * Migrate the storage contents to another workspace.
	 */
	// migrate(toWorkspace: IWorkspaceInitializationPayload): Promise<void>;

	/**
	 * Whether the storage for the given scope was created during this session or
	 * existed before.
	 *
	 */
	isNew(scope: StorageScope): boolean;

	/**
	 * Allows to flush state, e.g. in cases where a shutdown is
	 * imminent. This will send out the onWillSaveState to ask
	 * everyone for latest state.
	 */
	flush(): void;
}

export enum WillSaveStateReason {
	NONE = 0,
	SHUTDOWN = 1
}

export function logStorage(global: Map<string, string>, workspace: Map<string, string>, globalPath: string, workspacePath: string) {
	const safeParse = (value: string) => {
		try {
			return JSON.parse(value);
		} catch (error) {
			return value;
		}
	};

	const globalItems = new Map<string, string>();
	const globalItemsParsed = new Map<string, string>();
	global.forEach((value, key) => {
		globalItems.set(key, value);
		globalItemsParsed.set(key, safeParse(value));
	});

	const workspaceItems = new Map<string, string>();
	const workspaceItemsParsed = new Map<string, string>();
	workspace.forEach((value, key) => {
		workspaceItems.set(key, value);
		workspaceItemsParsed.set(key, safeParse(value));
	});

	console.group(`Storage: Global (path: ${globalPath})`);
	let globalValues: { key: string, value: string }[] = [];
	globalItems.forEach((value, key) => {
		globalValues.push({ key, value });
	});
	console.table(globalValues);
	console.groupEnd();

	console.log(globalItemsParsed);

	console.group(`Storage: Workspace (path: ${workspacePath})`);
	let workspaceValues: { key: string, value: string }[] = [];
	workspaceItems.forEach((value, key) => {
		workspaceValues.push({ key, value });
	});
	console.table(workspaceValues);
	console.groupEnd();

	console.log(workspaceItemsParsed);
}