import { Command } from '@oclif/core';
export default class DevClone extends Command {
    static description: string;
    static examples: string[];
    static aliases: string[];
    static flags: {
        branch: import("@oclif/core/lib/interfaces").OptionFlag<string | undefined>;
        verbose: import("@oclif/core/lib/interfaces").BooleanFlag<boolean>;
    };
    static args: ({
        name: string;
        required: boolean;
        description: string;
        options: string[];
    } | {
        name: string;
        description: string;
        required?: undefined;
        options?: undefined;
    })[];
    run(): Promise<void>;
}
