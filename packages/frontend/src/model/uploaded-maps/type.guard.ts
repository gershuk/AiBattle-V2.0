/*
 * Generated type guards for "type.ts".
 * WARNING: Do not manually change this file.
 */
import { MapData } from './type'

export function isMapData(obj: unknown): obj is MapData {
	const typedObj = obj as MapData
	return (
		((typedObj !== null && typeof typedObj === 'object') ||
			typeof typedObj === 'function') &&
		typeof typedObj['width'] === 'number' &&
		typeof typedObj['height'] === 'number' &&
		Array.isArray(typedObj['map']) &&
		typedObj['map'].every(
			(e: any) => Array.isArray(e) && e.every((e: any) => typeof e === 'string')
		) &&
		(typeof typedObj['startSnowMap'] === 'number' ||
			(Array.isArray(typedObj['startSnowMap']) &&
				typedObj['startSnowMap'].every(
					(e: any) =>
						Array.isArray(e) && e.every((e: any) => typeof e === 'number')
				))) &&
		typeof typedObj['snowIncreasePeriod'] === 'number' &&
		(typeof typedObj['snowIncreaseValue'] === 'number' ||
			(Array.isArray(typedObj['snowIncreaseValue']) &&
				typedObj['snowIncreaseValue'].every(
					(e: any) =>
						Array.isArray(e) && e.every((e: any) => typeof e === 'number')
				))) &&
		typeof typedObj['lastSnowIncreaseStep'] === 'number' &&
		Array.isArray(typedObj['spawns']) &&
		typedObj['spawns'].every(
			(e: any) =>
				((e !== null && typeof e === 'object') || typeof e === 'function') &&
				typeof e['x'] === 'number' &&
				typeof e['y'] === 'number'
		) &&
		Array.isArray(typedObj['bases']) &&
		typedObj['bases'].every(
			(e: any) =>
				((e !== null && typeof e === 'object') || typeof e === 'function') &&
				((e['topLeft'] !== null && typeof e['topLeft'] === 'object') ||
					typeof e['topLeft'] === 'function') &&
				typeof e['topLeft']['x'] === 'number' &&
				typeof e['topLeft']['y'] === 'number' &&
				((e['bottomRight'] !== null && typeof e['bottomRight'] === 'object') ||
					typeof e['bottomRight'] === 'function') &&
				typeof e['bottomRight']['x'] === 'number' &&
				typeof e['bottomRight']['y'] === 'number'
		) &&
		typeof typedObj['turns'] === 'number'
	)
}
