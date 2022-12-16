import { Command } from '@oclif/core';
export default class DevRm extends Command {
    static description: string;
    static examples: string[];
    static flags: {
        all: import("@oclif/core/lib/interfaces").BooleanFlag<boolean>;
        verbose: import("@oclif/core/lib/interfaces").BooleanFlag<boolean>;
    };
    static args: {
        name: string;
        required: boolean;
        description: string;
        options: string[];
    }[];
    run(): Promise<void>;
}
