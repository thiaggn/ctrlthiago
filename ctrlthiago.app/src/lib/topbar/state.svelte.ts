class TopbarState {
    private _paths: string[] = $state([])

    public setPath(...path: string[]) {
        this._paths = [...path]
    }

    get paths (): string[] {
        return this._paths
    }
}

export const topbarState = new TopbarState()

