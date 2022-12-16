import { Command } from '@oclif/core';
export default class Repo extends Command {
    static description: string;
    static examples: string[];
    static args: {
        name: string;
        required: boolean;
        description: string;
        options: string[];
    }[];
    run(): Promise<void>;
}
