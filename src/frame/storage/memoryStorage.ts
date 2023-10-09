
import { isUndefinedOrNull } from './types';
import { IStorageService, StorageScope, logStorage } from './storage';

export class InMemoryStorageService implements IStorageService {
	readonly _serviceBrand: undefined;

	private readonly globalCache = new Map<string, string>();
	private readonly workspaceCache = new Map<string, string>();

	private getCache(scope: StorageScope): Map<string, string> {
		return scope === StorageScope.GLOBAL ? this.globalCache : this.workspaceCache;
	}

	get(key: string, scope: StorageScope, fallbackValue: string): string;
	get(key: string, scope: StorageScope, fallbackValue?: string): string | undefined {
		const value = this.getCache(scope).get(key);

		if (isUndefinedOrNull(value)) {
			return fallbackValue;
		}

		return value;
	}

	getBoolean(key: string, scope: StorageScope, fallbackValue: boolean): boolean;
	getBoolean(key: string, scope: StorageScope, fallbackValue?: boolean): boolean | undefined {
		const value = this.getCache(scope).get(key);

		if (isUndefinedOrNull(value)) {
			return fallbackValue;
		}

		return value === 'true';
	}

	getNumber(key: string, scope: StorageScope, fallbackValue: number): number;
	getNumber(key: string, scope: StorageScope, fallbackValue?: number): number | undefined {
		const value = this.getCache(scope).get(key);

		if (isUndefinedOrNull(value)) {
			return fallbackValue;
		}

		return parseInt(value, 10);
	}

	store(key: string, value: string | boolean | number | undefined | null, scope: StorageScope): Promise<void> {

		// We remove the key for undefined/null values
		if (isUndefinedOrNull(value)) {
			return this.remove(key, scope);
		}

		// Otherwise, convert to String and store
		const valueStr = String(value);

		// Return early if value already set
		const currentValue = this.getCache(scope).get(key);
		if (currentValue === valueStr) {
			return Promise.resolve();
		}

		// Update in cache
		this.getCache(scope).set(key, valueStr);
		// Events
		// this._onDidChangeStorage.fire({ scope, key });

		return Promise.resolve();
	}

	remove(key: string, scope: StorageScope): Promise<void> {
		const wasDeleted = this.getCache(scope).delete(key);
		if (!wasDeleted) {
			return Promise.resolve(); // Return early if value already deleted
		}

		// Events

		return Promise.resolve();
	}

	logStorage(): void {
		logStorage(this.globalCache, this.workspaceCache, 'inMemory', 'inMemory');
	}

	flush(): void {
		// this._onWillSaveState.fire({ reason: WillSaveStateReason.NONE });
	}

	isNew(): boolean {
		return true; // always new when in-memory
	}

	close() { }
}
