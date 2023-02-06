/*
 * Generated type guards for "type.ts".
 * WARNING: Do not manually change this file.
 */
import { MapData } from "./type";

export function isMapData(obj: unknown): obj is MapData {
    const typedObj = obj as MapData
    return (
        (typedObj !== null &&
            typeof typedObj === "object" ||
            typeof typedObj === "function") &&
        Array.isArray(typedObj["map"]) &&
        typedObj["map"].every((e: any) =>
            Array.isArray(e) &&
            e.every((e: any) =>
                typeof e === "number"
            )
        ) &&
        Array.isArray(typedObj["spawns"]) &&
        typedObj["spawns"].every((e: any) =>
            (e !== null &&
                typeof e === "object" ||
                typeof e === "function") &&
            typeof e["x"] === "number" &&
            typeof e["y"] === "number"
        )
    )
}
