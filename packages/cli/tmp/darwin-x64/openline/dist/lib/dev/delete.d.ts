export interface Apps {
    deployments: string[];
    services: string[];
    statefulsets: string[];
}
export declare function deleteApp(apps: Apps, verbose: boolean): boolean;
export declare function deleteAll(verbose: boolean): boolean;
