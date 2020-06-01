export interface DashboardGadgetConfiguration {
    group: string;
    title: string;
    description: string;
    formComponent: any;
    gadgetComponent: any;
}

export default class RegisterComponent<T = any> {
    private map: Map<string, T>;

    constructor() {
        this.map = new Map<string, T>();
    }

    public getAll(): Map<string, T> {
        return this.map;
    }

    public register(id: string, gadgetDef: T) {
        this.map.set(id.toLowerCase(), gadgetDef);
    }

    public get(id: string): T | undefined {
        let returnValue: T | undefined = this.map.get(id.toLowerCase());
        if (!returnValue) {
            returnValue = this.map.get("default");
        }
        return returnValue;
    }
}