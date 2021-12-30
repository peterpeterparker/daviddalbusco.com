import type {Slug} from '$lib/types/slug';
import {readdirSync} from 'fs';
import {parse} from 'path';

export const listSlugs = ({path}: {path: 'portfolio' | 'blog'}): Slug[] => {
  return readdirSync(`src/${path}`)
    .filter((fileName) => /.+\.md$/.test(fileName))
    .map((fileName) => ({
      slug: parse(fileName).name
    }));
};
