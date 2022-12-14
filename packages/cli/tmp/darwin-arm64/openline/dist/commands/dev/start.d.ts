import { Command } from '@oclif/core';
export default class DevStart extends Command {
    static description: string;
    static examples: string[];
    static flags: {
        all: import("@oclif/core/lib/interfaces").BooleanFlag<boolean>;
        tag: import("@oclif/core/lib/interfaces").OptionFlag<string>;
        location: import("@oclif/core/lib/interfaces").OptionFlag<string | undefined>;
        verbose: import("@oclif/core/lib/interfaces").BooleanFlag<boolean>;
        test: import("@oclif/core/lib/interfaces").BooleanFlag<boolean>;
    };
    static args: {
        name: string;
        required: boolean;
        description: string;
        default: string;
        options: string[];
    }[];
    run(): Promise<void>;
}
