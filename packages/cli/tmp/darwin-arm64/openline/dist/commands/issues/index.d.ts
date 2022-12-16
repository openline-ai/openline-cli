import { Command } from '@oclif/core';
export default class Issues extends Command {
    static description: string;
    static examples: string[];
    static flags: {
        all: import("@oclif/core/lib/interfaces").BooleanFlag<boolean>;
        bug: import("@oclif/core/lib/interfaces").BooleanFlag<boolean>;
        milestone: import("@oclif/core/lib/interfaces").BooleanFlag<boolean>;
        new: import("@oclif/core/lib/interfaces").BooleanFlag<boolean>;
        token: import("@oclif/core/lib/interfaces").OptionFlag<string | undefined>;
    };
    static args: never[];
    run(): Promise<void>;
}
