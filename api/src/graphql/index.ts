import * as glob from 'glob';
import * as fs from 'fs';
import { mergeTypes } from 'merge-graphql-schemas';

function loadFiles(pattern: string): any[] {
    const paths = glob.sync(pattern);
    return paths.map(path => fs.readFileSync(path, 'utf8'));
}

function mergeTypesByPaths(...pathsToTypes: string[]): string {
    return mergeTypes(
        ...pathsToTypes.map(pattern => loadFiles(pattern)),
    );
}

export function getTypes(): string {
    return mergeTypesByPaths("./**/*.graphql");
}