import { Cache } from '@raycast/api';
import { Backlog, type Entity } from 'backlog-js';

const cache = new Cache();

export const getSpaceWithCache = async (spaceKey: string, domain: string, apiKey: string) => {
  const host = `${spaceKey}.${domain}`;
  const cacheKey = `backlog-space-${host}`;
  const cached = await cache.get(cacheKey);

  console.log(cached);

  if (cached) {
    return JSON.parse(cached) as Entity.Space.Space;
  }

  console.log(host, apiKey)
  
  const backlog = new Backlog({ host, apiKey });
  const space = await backlog.getSpace();

  console.log(space);

  cache.set(cacheKey, JSON.stringify(space));

  return space;
}