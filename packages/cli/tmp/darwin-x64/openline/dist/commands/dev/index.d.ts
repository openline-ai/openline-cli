import { Command } from '@oclif/core';
export default class Dev extends Command {
    static description: string;
    static examples: never[];
    run(): Promise<void>;
}
