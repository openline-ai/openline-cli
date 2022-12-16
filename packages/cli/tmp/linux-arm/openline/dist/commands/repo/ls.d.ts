import { Command } from '@oclif/core';
export default class RepoLs extends Command {
    static description: string;
    static examples: string[];
    static flags: {};
    static args: never[];
    run(): Promise<void>;
}
