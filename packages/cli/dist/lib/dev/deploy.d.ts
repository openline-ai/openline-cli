export interface Yaml {
    deployYaml: string;
    serviceYaml: string;
    loadbalancerYaml?: string;
}
export declare function deployImage(imageUrl: string | null, deployConfig: Yaml, verbose?: boolean): boolean;
export declare function updateImageTag(deployFiles: string[], imageVersion: string): boolean;
export declare function deployLoadbalancer(YamlConfigPath: string, verbose: boolean): boolean;
