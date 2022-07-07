/* eslint-disable @typescript-eslint/no-var-requires */
import hash from 'hash-sum'
import { SFCDescriptor } from '@vue/compiler-sfc'
import { isVue3 } from 'vue-inbrowser-compiler-utils'
import LRUCache from 'lru-cache'

const cache = new LRUCache(100)

export default function parseVue(source: string): SFCDescriptor {
	const cacheKey = hash(source)
	// source-map cache busting for hot-reloaded modules
	const output = cache.get(cacheKey)
	if (output) {
		return output
	}

	const parse = isVue3
		? require('@vue/compiler-sfc').parse
		: // eslint-disable-next-line import/no-unresolved
		  require('vue-template-compiler').parseComponent
	const parsedSFC = parse(source)
	const descriptor = parsedSFC.descriptor ?? parsedSFC
	cache.set(cacheKey, descriptor)
	return descriptor
}
