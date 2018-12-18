import { CPPFunction } from 'aclovis';

export abstract class ChunkWriter {
    protected fxn: CPPFunction;

    getIdentifier(): string {
        return this.fxn.getSignature(true).replace(/;$/, '');
    }

    process(): void {}
}
