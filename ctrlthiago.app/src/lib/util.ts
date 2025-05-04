export function log<T>(t: T, ...args: any[]): T {
    console.log(t, ...args)
    return t
}