import { Command } from '@oclif/core';
export default class DevStop extends Command {
    static description: string;
    static examples: string[];
    static flags: {
        verbose: import("@oclif/core/lib/interfaces").BooleanFlag<boolean>;
    };
    static args: never[];
    run(): Promise<void>;
}
