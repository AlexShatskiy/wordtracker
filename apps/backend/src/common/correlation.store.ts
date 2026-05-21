import { AsyncLocalStorage } from 'async_hooks';

export const correlationStore = new AsyncLocalStorage<string>();

export const getCorrelationId = (): string => correlationStore.getStore() ?? '-';
